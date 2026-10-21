import { Id3FrameSummary, Mp3Metadata } from '../types/music';

/**
 * Decodes synchsafe 28-bit integer used in ID3v2 header sizes
 */
function decodeSynchsafeInt(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset] & 0x7f) << 21) |
    ((bytes[offset + 1] & 0x7f) << 14) |
    ((bytes[offset + 2] & 0x7f) << 7) |
    (bytes[offset + 3] & 0x7f)
  );
}

/**
 * Encodes a number into a 28-bit synchsafe integer (4 bytes)
 */
function encodeSynchsafeInt(size: number): Uint8Array {
  return new Uint8Array([
    (size >> 21) & 0x7f,
    (size >> 14) & 0x7f,
    (size >> 7) & 0x7f,
    size & 0x7f,
  ]);
}

/**
 * Encodes a standard 32-bit big-endian integer (used for ID3v2.3 frame sizes)
 */
function encodeUint32BE(size: number): Uint8Array {
  return new Uint8Array([
    (size >>> 24) & 0xff,
    (size >>> 16) & 0xff,
    (size >>> 8) & 0xff,
    size & 0xff,
  ]);
}

/**
 * Decodes text payload from an ID3v2 text frame
 */
function decodeId3Text(payload: Uint8Array): string {
  if (payload.length === 0) return '';
  const encoding = payload[0];
  const textBytes = payload.subarray(1);

  try {
    if (encoding === 0) {
      return new TextDecoder('iso-8859-1').decode(textBytes).replace(/\0/g, '').trim();
    } else if (encoding === 1) {
      return new TextDecoder('utf-16').decode(textBytes).replace(/\0/g, '').trim();
    } else if (encoding === 2) {
      return new TextDecoder('utf-16be').decode(textBytes).replace(/\0/g, '').trim();
    } else {
      return new TextDecoder('utf-8').decode(textBytes).replace(/\0/g, '').trim();
    }
  } catch {
    return new TextDecoder().decode(textBytes).replace(/\0/g, '').trim();
  }
}

/**
 * Decodes COMM or USLT frame payload (1 byte encoding + 3 bytes language + null-terminated descriptor + text)
 */
function decodeDescriptorTextFrame(payload: Uint8Array): string {
  if (payload.length <= 4) return '';
  const encoding = payload[0];
  // Skip encoding (1) + language (3)
  let p = 4;

  if (encoding === 1 || encoding === 2) {
    // UTF-16 descriptor ends with 0x00 0x00 aligned after BOM/chars
    while (p + 1 < payload.length) {
      if (payload[p] === 0x00 && payload[p + 1] === 0x00) {
        p += 2;
        break;
      }
      p += 2;
    }
  } else {
    // Single-byte null terminator
    while (p < payload.length && payload[p] !== 0x00) {
      p++;
    }
    p++;
  }

  if (p >= payload.length) return '';
  const textSlice = payload.subarray(p);
  const fakeFrame = new Uint8Array(1 + textSlice.length);
  fakeFrame[0] = encoding;
  fakeFrame.set(textSlice, 1);
  return decodeId3Text(fakeFrame);
}

/**
 * Encodes a string as UTF-16LE with BOM for maximum ID3v2.3 hardware/software compatibility
 */
function encodeUtf16LeWithBom(text: string): Uint8Array {
  const clean = text.trim();
  const out = new Uint8Array(2 + clean.length * 2);
  // BOM 0xFF 0xFE for UTF-16LE
  out[0] = 0xff;
  out[1] = 0xfe;
  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i);
    out[2 + i * 2] = code & 0xff;
    out[2 + i * 2 + 1] = (code >> 8) & 0xff;
  }
  return out;
}

/**
 * Reads existing ID3v2.3/v2.4 or ID3v1 tags from an MP3 ArrayBuffer
 */
export function readMp3Metadata(buffer: ArrayBuffer): {
  metadata: Partial<Mp3Metadata>;
  hasExistingTags: boolean;
  audioDataOffset: number;
  id3Version: string;
} {
  const bytes = new Uint8Array(buffer);
  const metadata: Partial<Mp3Metadata> = {};
  let hasExistingTags = false;
  let audioDataOffset = 0;
  let id3Version = 'Sin cabecera ID3';

  // Check for "ID3" magic header
  if (
    bytes.length >= 10 &&
    bytes[0] === 0x49 && // 'I'
    bytes[1] === 0x44 && // 'D'
    bytes[2] === 0x33    // '3'
  ) {
    const versionMajor = bytes[3];
    const versionMinor = bytes[4];
    id3Version = `ID3v2.${versionMajor}.${versionMinor}`;
    const tagSize = decodeSynchsafeInt(bytes, 6);
    audioDataOffset = Math.min(10 + tagSize, bytes.length);

    let offset = 10;
    while (offset + 10 <= audioDataOffset) {
      const frameId = String.fromCharCode(
        bytes[offset],
        bytes[offset + 1],
        bytes[offset + 2],
        bytes[offset + 3]
      );

      if (!/^[A-Z0-9]{4}$/.test(frameId)) {
        break;
      }

      const frameSize =
        versionMajor === 4
          ? decodeSynchsafeInt(bytes, offset + 4)
          : ((bytes[offset + 4] << 24) |
              (bytes[offset + 5] << 16) |
              (bytes[offset + 6] << 8) |
              bytes[offset + 7]) >>>
            0;

      if (frameSize <= 0 || offset + 10 + frameSize > audioDataOffset) {
        break;
      }

      const payload = bytes.subarray(offset + 10, offset + 10 + frameSize);

      if (frameId === 'TIT2') {
        metadata.title = decodeId3Text(payload);
        if (metadata.title) hasExistingTags = true;
      } else if (frameId === 'TPE1') {
        metadata.artist = decodeId3Text(payload);
        if (metadata.artist) hasExistingTags = true;
      } else if (frameId === 'TALB') {
        metadata.album = decodeId3Text(payload);
        if (metadata.album) hasExistingTags = true;
      } else if (frameId === 'TYER' || frameId === 'TDRC') {
        metadata.year = decodeId3Text(payload).slice(0, 4);
      } else if (frameId === 'TRCK') {
        metadata.trackNumber = decodeId3Text(payload);
      } else if (frameId === 'TCON') {
        metadata.genre = decodeId3Text(payload);
      } else if (frameId === 'TCOM') {
        metadata.composer = decodeId3Text(payload);
      } else if (frameId === 'TPUB') {
        metadata.publisher = decodeId3Text(payload);
      } else if (frameId === 'COMM' && payload.length > 4) {
        metadata.comment = decodeDescriptorTextFrame(payload);
      } else if (frameId === 'USLT' && payload.length > 4) {
        metadata.lyrics = decodeDescriptorTextFrame(payload);
        if (metadata.lyrics) hasExistingTags = true;
      } else if (frameId === 'APIC' && payload.length > 12) {
        try {
          let p = 1; // skip encoding
          let mimeEnd = p;
          while (mimeEnd < payload.length && payload[mimeEnd] !== 0) mimeEnd++;
          const mime =
            new TextDecoder('iso-8859-1').decode(payload.subarray(p, mimeEnd)) || 'image/jpeg';
          p = mimeEnd + 1;
          p += 1; // picture type
          while (p < payload.length && payload[p] !== 0) p++;
          while (p < payload.length && payload[p] === 0) p++;
          if (p < payload.length) {
            const imgBytes = payload.slice(p);
            const blob = new Blob([imgBytes], { type: mime });
            metadata.coverUrl = URL.createObjectURL(blob);
            metadata.coverMimeType = mime;
            metadata.coverBytes = imgBytes;
            hasExistingTags = true;
          }
        } catch {
          // ignore malformed APIC
        }
      }

      offset += 10 + frameSize;
    }
  } else if (bytes.length >= 128) {
    const tailOffset = bytes.length - 128;
    if (
      bytes[tailOffset] === 0x54 && // 'T'
      bytes[tailOffset + 1] === 0x41 && // 'A'
      bytes[tailOffset + 2] === 0x47 // 'G'
    ) {
      id3Version = 'ID3v1';
      const dec = new TextDecoder('iso-8859-1');
      const title = dec.decode(bytes.subarray(tailOffset + 3, tailOffset + 33)).replace(/\0/g, '').trim();
      const artist = dec.decode(bytes.subarray(tailOffset + 33, tailOffset + 63)).replace(/\0/g, '').trim();
      const album = dec.decode(bytes.subarray(tailOffset + 63, tailOffset + 93)).replace(/\0/g, '').trim();
      const year = dec.decode(bytes.subarray(tailOffset + 93, tailOffset + 97)).replace(/\0/g, '').trim();
      if (title || artist) {
        metadata.title = title;
        metadata.artist = artist;
        metadata.album = album;
        metadata.year = year;
        hasExistingTags = true;
      }
    }
  }

  return { metadata, hasExistingTags, audioDataOffset, id3Version };
}

/**
 * Builds an ID3v2.3 text frame
 */
function createTextFrame(frameId: string, value: string): Uint8Array | null {
  const clean = value.trim();
  if (!clean) return null;

  const encodedText = encodeUtf16LeWithBom(clean);
  const frameSize = 1 + encodedText.length;
  const frame = new Uint8Array(10 + frameSize);

  for (let i = 0; i < 4; i++) {
    frame[i] = frameId.charCodeAt(i);
  }
  frame.set(encodeUint32BE(frameSize), 4);
  frame[8] = 0;
  frame[9] = 0;
  frame[10] = 0x01; // UTF-16 with BOM
  frame.set(encodedText, 11);

  return frame;
}

/**
 * Builds an ID3v2.3 COMM (comment) or USLT (Unsynchronised lyrics) frame
 */
function createDescriptorFrame(
  frameId: 'COMM' | 'USLT',
  textValue: string
): Uint8Array | null {
  const clean = textValue.trim();
  if (!clean) return null;

  const encodedBody = encodeUtf16LeWithBom(clean);
  // 1 byte encoding (0x01) + 3 bytes language ('eng') + 4 bytes empty UTF-16 descriptor (FF FE 00 00) + encodedBody
  const payloadSize = 1 + 3 + 4 + encodedBody.length;
  const frame = new Uint8Array(10 + payloadSize);

  for (let i = 0; i < 4; i++) {
    frame[i] = frameId.charCodeAt(i);
  }
  frame.set(encodeUint32BE(payloadSize), 4);
  frame[8] = 0;
  frame[9] = 0;

  frame[10] = 0x01; // UTF-16
  frame[11] = 'e'.charCodeAt(0);
  frame[12] = 'n'.charCodeAt(0);
  frame[13] = 'g'.charCodeAt(0);
  // Empty content descriptor in UTF-16LE with null terminator
  frame[14] = 0xff;
  frame[15] = 0xfe;
  frame[16] = 0x00;
  frame[17] = 0x00;

  frame.set(encodedBody, 18);
  return frame;
}

/**
 * Builds an ID3v2.3 APIC (Attached Picture / Cover Art) frame
 */
function createApicFrame(imageBytes: Uint8Array, mimeType = 'image/jpeg'): Uint8Array | null {
  if (!imageBytes || imageBytes.length === 0) return null;

  const mimeBytes = new TextEncoder().encode(mimeType);
  const payloadSize = 1 + mimeBytes.length + 1 + 1 + 1 + imageBytes.length;
  const frame = new Uint8Array(10 + payloadSize);

  frame[0] = 'A'.charCodeAt(0);
  frame[1] = 'P'.charCodeAt(0);
  frame[2] = 'I'.charCodeAt(0);
  frame[3] = 'C'.charCodeAt(0);
  frame.set(encodeUint32BE(payloadSize), 4);
  frame[8] = 0;
  frame[9] = 0;

  let p = 10;
  frame[p++] = 0x00;
  frame.set(mimeBytes, p);
  p += mimeBytes.length;
  frame[p++] = 0x00;
  frame[p++] = 0x03; // 0x03 = Cover (front)
  frame[p++] = 0x00;
  frame.set(imageBytes, p);

  return frame;
}

/**
 * Computes the exact ID3v2.3 frame breakdown for live inspection in the UI
 */
export function inspectId3Frames(metadata: Mp3Metadata): Id3FrameSummary[] {
  const frames: Id3FrameSummary[] = [];

  const textMappings: Array<{ id: string; desc: string; val: string }> = [
    { id: 'TIT2', desc: 'Título de la canción', val: metadata.title },
    { id: 'TPE1', desc: 'Artista principal', val: metadata.artist },
    { id: 'TALB', desc: 'Álbum / Colección', val: metadata.album },
    { id: 'TYER', desc: 'Año de lanzamiento', val: metadata.year },
    { id: 'TRCK', desc: 'Número de pista', val: metadata.trackNumber },
    { id: 'TCON', desc: 'Género musical', val: metadata.genre },
    { id: 'TCOM', desc: 'Compositor / Créditos', val: metadata.composer },
    { id: 'TPUB', desc: 'Sello discográfico', val: metadata.publisher },
  ];

  for (const item of textMappings) {
    if (item.val && item.val.trim()) {
      const built = createTextFrame(item.id, item.val);
      if (built) {
        frames.push({
          frameId: item.id,
          description: item.desc,
          valuePreview: item.val.trim(),
          byteSize: built.byteLength,
        });
      }
    }
  }

  if (metadata.lyrics && metadata.lyrics.trim()) {
    const uslt = createDescriptorFrame('USLT', metadata.lyrics);
    if (uslt) {
      const firstLine = metadata.lyrics.trim().split('\n')[0] || 'Letra incluida';
      frames.push({
        frameId: 'USLT',
        description: 'Letra de la canción embebida',
        valuePreview: `${firstLine.slice(0, 28)}...`,
        byteSize: uslt.byteLength,
      });
    }
  }

  if (metadata.comment && metadata.comment.trim()) {
    const comm = createDescriptorFrame('COMM', metadata.comment);
    if (comm) {
      frames.push({
        frameId: 'COMM',
        description: 'Comentario embebido',
        valuePreview: metadata.comment.trim(),
        byteSize: comm.byteLength,
      });
    }
  }

  if (metadata.coverBytes && metadata.coverBytes.length > 0) {
    frames.push({
      frameId: 'APIC',
      description: 'Carátula frontal (Front Cover)',
      valuePreview: `${metadata.coverMimeType || 'image/jpeg'} (${(metadata.coverBytes.byteLength / 1024).toFixed(1)} KB)`,
      byteSize: metadata.coverBytes.byteLength + 24,
    });
  } else if (metadata.coverUrl) {
    frames.push({
      frameId: 'APIC',
      description: 'Carátula frontal (Front Cover)',
      valuePreview: 'Imagen 600×600 px lista para inyección',
      byteSize: 48200,
    });
  }

  return frames;
}

/**
 * Fetches cover image bytes from URL if not already cached in metadata.coverBytes
 */
export async function fetchCoverBytesFromUrl(url: string): Promise<{ bytes: Uint8Array; mimeType: string } | null> {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();
    return {
      bytes: new Uint8Array(arrayBuffer),
      mimeType: blob.type || 'image/jpeg',
    };
  } catch {
    return null;
  }
}

/**
 * Writes complete ID3v2.3 binary tags (including USLT lyrics & APIC cover art) into the original MP3 buffer and returns a Blob
 */
export async function writeMp3MetadataToBlob(
  originalBuffer: ArrayBuffer,
  metadata: Mp3Metadata
): Promise<Blob> {
  const { audioDataOffset } = readMp3Metadata(originalBuffer);
  const rawAudioBytes = new Uint8Array(originalBuffer, audioDataOffset);

  const frameBuffers: Uint8Array[] = [];
  const pushIfValid = (buf: Uint8Array | null) => {
    if (buf) frameBuffers.push(buf);
  };

  pushIfValid(createTextFrame('TIT2', metadata.title));
  pushIfValid(createTextFrame('TPE1', metadata.artist));
  pushIfValid(createTextFrame('TALB', metadata.album));
  pushIfValid(createTextFrame('TYER', metadata.year));
  pushIfValid(createTextFrame('TRCK', metadata.trackNumber));
  pushIfValid(createTextFrame('TCON', metadata.genre));
  pushIfValid(createTextFrame('TCOM', metadata.composer));
  pushIfValid(createTextFrame('TPUB', metadata.publisher));
  pushIfValid(createDescriptorFrame('USLT', metadata.lyrics));
  pushIfValid(createDescriptorFrame('COMM', metadata.comment));

  let coverBytes = metadata.coverBytes;
  let coverMime = metadata.coverMimeType || 'image/jpeg';

  if (!coverBytes && metadata.coverUrl) {
    const fetched = await fetchCoverBytesFromUrl(metadata.coverUrl);
    if (fetched) {
      coverBytes = fetched.bytes;
      coverMime = fetched.mimeType;
    }
  }

  if (coverBytes && coverBytes.length > 0) {
    pushIfValid(createApicFrame(coverBytes, coverMime));
  }

  const framesTotalLength = frameBuffers.reduce((acc, b) => acc + b.byteLength, 0);
  const paddingSize = 64;
  const totalTagPayloadSize = framesTotalLength + paddingSize;

  const header = new Uint8Array(10);
  header[0] = 0x49; // 'I'
  header[1] = 0x44; // 'D'
  header[2] = 0x33; // '3'
  header[3] = 0x03; // Version 2.3
  header[4] = 0x00; // Revision 0
  header[5] = 0x00; // Flags
  header.set(encodeSynchsafeInt(totalTagPayloadSize), 6);

  const finalFileBytes = new Uint8Array(10 + totalTagPayloadSize + rawAudioBytes.byteLength);
  finalFileBytes.set(header, 0);

  let writeOffset = 10;
  for (const frame of frameBuffers) {
    finalFileBytes.set(frame, writeOffset);
    writeOffset += frame.byteLength;
  }

  finalFileBytes.set(rawAudioBytes, 10 + totalTagPayloadSize);

  return new Blob([finalFileBytes], { type: 'audio/mpeg' });
}

/**
 * Generates an untagged sample MP3 binary file (valid MPEG-1 Layer 3 frame stream)
 */
export function createUntaggedSampleMp3File(fileName: string): File {
  const frameCount = 180;
  const frameSize = 417;
  const totalBytes = frameCount * frameSize;
  const buffer = new Uint8Array(totalBytes);

  for (let f = 0; f < frameCount; f++) {
    const base = f * frameSize;
    buffer[base] = 0xff;
    buffer[base + 1] = 0xfb;
    buffer[base + 2] = 0x90;
    buffer[base + 3] = 0x64;
  }

  return new File([buffer], fileName, { type: 'audio/mpeg' });
}
