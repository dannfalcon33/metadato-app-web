import {
  CatalogAlbumResult,
  CatalogArtistResult,
  CatalogTrackResult,
} from '../types/music';

/**
 * Cleans an MP3 filename like "04 - REM - Losing My Religion (Official Audio) [320kbps].mp3"
 * into structured search terms.
 */
export function parseFilenameToSearchQuery(fileName: string): {
  cleanQuery: string;
  guessedArtist: string;
  guessedTitle: string;
} {
  let base = fileName.replace(/\.(mp3|wav|flac|m4a|ogg)$/i, '');

  base = base
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\((?:official|audio|video|lyrics|remaster|hd|hq|320kbps|128kbps|live)[^)]*\)/gi, ' ')
    .replace(/^\s*\d{1,3}[\s._-]+/, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const parts = base.split(/\s*-\s*/);
  if (parts.length >= 2) {
    const rawArtist = parts[0].trim();
    const rawTitle = parts.slice(1).join(' - ').trim();
    return {
      cleanQuery: `${rawArtist} ${rawTitle}`,
      guessedArtist: /^rem$/i.test(rawArtist) ? 'R.E.M.' : rawArtist,
      guessedTitle: rawTitle,
    };
  }

  return {
    cleanQuery: base,
    guessedArtist: '',
    guessedTitle: base,
  };
}

/**
 * Upgrades iTunes 100x100 artwork URL to 600x600 high-resolution cover art
 */
function upgradeCoverUrl(url?: string): string {
  if (!url) return '';
  return url.replace(/100x100bb\.jpg$/i, '600x600bb.jpg');
}

const FALLBACK_LYRICS_MAP: Record<string, string> = {
  'losing my religion': `Oh life, it's bigger
It's bigger than you
And you are not me
The lengths that I will go to
The distance in your eyes
Oh no, I've said too much
I set it up

That's me in the corner
That's me in the spotlight
Losing my religion
Trying to keep up with you
And I don't know if I can do it
Oh no, I've said too much
I haven't said enough

I thought that I heard you laughing
I thought that I heard you sing
I think I thought I saw you try`,
  'veridis quo': `[Pista Instrumental — Daft Punk (Discovery, 2001)]
Composición y sintetizadores: Thomas Bangalter & Guy-Manuel de Homem-Christo.
Progresión melódica barroca en Sol menor (114 BPM).`,
  'nightcall': `I'm giving you a night call to tell you how I feel
I want to drive you through the night, down the hills
I'm gonna tell you something you don't want to hear
I'm gonna show you where it's dark, but have no fear

There's something inside you
It's hard to explain
They're talking about you, boy
But you're still the same

There's something inside you
It's hard to explain
They're talking about you, boy
But you're still the same`,
  'de música ligera': `Ella durmió al calor de las masas
Y yo desperté queriendo soñarla
Algún tiempo atrás pensé en escribirle
Que nunca sorteé las trampas del amor

De aquel amor
De música ligera
Nada nos libra
Nada más queda

No le enviaré cenizas de rosas
Ni pienso evitar un roce secreto
De aquel amor
De música ligera
Nada nos libra
Nada más queda`,
  'de musica ligera': `Ella durmió al calor de las masas
Y yo desperté queriendo soñarla
Algún tiempo atrás pensé en escribirle
Que nunca sorteé las trampas del amor

De aquel amor
De música ligera
Nada nos libra
Nada más queda`,
};

/**
 * Fetches unsynchronized song lyrics from public databases (LRCLIB / Lyrics.ovh) with AbortSignal support and fallback
 */
export async function fetchTrackLyricsOnline(
  artist: string,
  title: string,
  signal?: AbortSignal
): Promise<string> {
  const cleanArtist = artist.trim();
  const cleanTitle = title.replace(/\s*\([^)]*\)/g, '').trim();

  if (!cleanTitle) return '';

  // 1. Try LRCLIB API
  try {
    const lrcUrl = `https://lrclib.net/api/search?track_name=${encodeURIComponent(
      cleanTitle
    )}&artist_name=${encodeURIComponent(cleanArtist)}`;
    const res = await fetch(lrcUrl, { signal });
    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list) && list.length > 0) {
        const matchWithPlain = list.find(
          (item: Record<string, unknown>) =>
            typeof item.plainLyrics === 'string' && item.plainLyrics.trim().length > 0
        );
        if (matchWithPlain && typeof matchWithPlain.plainLyrics === 'string') {
          return matchWithPlain.plainLyrics.trim();
        }
        if (list[0]?.instrumental === true) {
          return `[Pista Instrumental — ${cleanArtist} - ${cleanTitle}]`;
        }
      }
    }
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err;
  }

  // 2. Try lyrics.ovh API
  if (cleanArtist && cleanTitle) {
    try {
      const ovhUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(
        cleanArtist
      )}/${encodeURIComponent(cleanTitle)}`;
      const res = await fetch(ovhUrl, { signal });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.lyrics === 'string' && data.lyrics.trim()) {
          return data.lyrics.replace(/^Paroles de la chanson[^\n]*\n+/i, '').trim();
        }
      }
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') throw err;
    }
  }

  // 3. Check curated fallback map
  const key = cleanTitle.toLowerCase();
  for (const [k, val] of Object.entries(FALLBACK_LYRICS_MAP)) {
    if (key.includes(k)) {
      return val;
    }
  }

  return `[Letra para "${cleanArtist ? `${cleanArtist} — ` : ''}${cleanTitle}"]\nEscribe o pega aquí la letra completa para incrustarla en la trama binaria USLT del archivo MP3.`;
}

export const CURATED_FALLBACK_TRACKS: CatalogTrackResult[] = [
  {
    trackId: 310657084,
    title: 'Losing My Religion',
    artist: 'R.E.M.',
    album: 'Out of Time (25th Anniversary Edition)',
    collectionId: 1154822460,
    artistId: 310657,
    year: '1991',
    releaseDate: '1991-03-12',
    trackNumber: '4/11',
    trackCount: 11,
    discNumber: 1,
    genre: 'Alternative Rock',
    durationMs: 268426,
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/7b/5c/3f/7b5c3f0c-227c-0b86-8b50-8b2f19b58e88/888072010598.jpg/600x600bb.jpg',
    publisher: 'Craft Recordings / Warner Bros.',
    country: 'USA',
    lyrics: FALLBACK_LYRICS_MAP['losing my religion'],
  },
  {
    trackId: 697195787,
    title: 'Veridis Quo',
    artist: 'Daft Punk',
    album: 'Discovery',
    collectionId: 697194953,
    artistId: 5468295,
    year: '2001',
    releaseDate: '2001-03-12',
    trackNumber: '11/14',
    trackCount: 14,
    discNumber: 1,
    genre: 'Electronic',
    durationMs: 345186,
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f8/43/43/f8434394-3b88-c121-225b-95e2f9b1b591/825646286058.jpg/600x600bb.jpg',
    publisher: 'Daft Life Ltd. / Parlophone',
    country: 'FRA',
    lyrics: FALLBACK_LYRICS_MAP['veridis quo'],
  },
  {
    trackId: 591506365,
    title: 'Nightcall',
    artist: 'Kavinsky',
    album: 'OutRun',
    collectionId: 591506150,
    artistId: 121949763,
    year: '2010',
    releaseDate: '2010-03-29',
    trackNumber: '3/13',
    trackCount: 13,
    discNumber: 1,
    genre: 'Synthwave / Electronic',
    durationMs: 258386,
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/6e/80/5a/6e805a21-6c8c-67f5-6c30-074e59994a01/00602537292486.rgb.jpg/600x600bb.jpg',
    publisher: 'Record Makers',
    country: 'FRA',
    lyrics: FALLBACK_LYRICS_MAP['nightcall'],
  },
  {
    trackId: 321899104,
    title: 'De Música Ligera',
    artist: 'Soda Stereo',
    album: 'Canción Animal',
    collectionId: 321898990,
    artistId: 405921,
    year: '1990',
    releaseDate: '1990-08-07',
    trackNumber: '8/10',
    trackCount: 10,
    discNumber: 1,
    genre: 'Rock en Español',
    durationMs: 212800,
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/44/79/4b/44794b9b-83e4-3095-404c-2593797507e6/886443546141.jpg/600x600bb.jpg',
    publisher: 'Sony Music Entertainment',
    country: 'ARG',
    lyrics: FALLBACK_LYRICS_MAP['de música ligera'],
  },
];

/**
 * Searches the live iTunes catalog for tracks matching the query, supporting AbortSignal
 */
export async function searchTracksOnline(
  query: string,
  limit = 12,
  signal?: AbortSignal
): Promise<CatalogTrackResult[]> {
  const clean = query.trim();
  if (!clean) return CURATED_FALLBACK_TRACKS;

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(clean)}&entity=song&limit=${limit}`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error('Network response not ok');
    const data = await res.json();

    if (Array.isArray(data.results)) {
      return data.results.map((item: Record<string, unknown>) => {
        const releaseDateStr = String(item.releaseDate || '');
        const year = releaseDateStr ? releaseDateStr.slice(0, 4) : '';
        const trackNum = item.trackNumber ? String(item.trackNumber) : '1';
        const trackCount = item.trackCount ? Number(item.trackCount) : undefined;
        return {
          trackId: Number(item.trackId || Math.random() * 1000000),
          title: String(item.trackName || 'Sin título'),
          artist: String(item.artistName || 'Artista desconocido'),
          album: String(item.collectionName || 'Álbum desconocido'),
          collectionId: item.collectionId ? Number(item.collectionId) : undefined,
          artistId: item.artistId ? Number(item.artistId) : undefined,
          year,
          releaseDate: releaseDateStr ? releaseDateStr.slice(0, 10) : year,
          trackNumber: trackCount ? `${trackNum}/${trackCount}` : trackNum,
          trackCount,
          discNumber: item.discNumber ? Number(item.discNumber) : 1,
          genre: String(item.primaryGenreName || 'Alternative'),
          durationMs: Number(item.trackTimeMillis || 210000),
          coverUrl: upgradeCoverUrl(String(item.artworkUrl100 || '')),
          previewUrl: item.previewUrl ? String(item.previewUrl) : undefined,
          country: String(item.country || 'USA'),
        };
      });
    }
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err;
  }

  const lower = clean.toLowerCase();
  return CURATED_FALLBACK_TRACKS.filter(
    (t) =>
      t.title.toLowerCase().includes(lower) ||
      t.artist.toLowerCase().replace(/\./g, '').includes(lower.replace(/\./g, '')) ||
      t.album.toLowerCase().includes(lower)
  );
}

/**
 * Searches albums in the live catalog with AbortSignal support
 */
export async function searchAlbumsOnline(
  query: string,
  limit = 12,
  signal?: AbortSignal
): Promise<CatalogAlbumResult[]> {
  const clean = query.trim();
  if (!clean) return [];

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(clean)}&entity=album&limit=${limit}`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();

    if (Array.isArray(data.results)) {
      return data.results.map((item: Record<string, unknown>) => {
        const releaseDateStr = String(item.releaseDate || '');
        return {
          collectionId: Number(item.collectionId || Math.random() * 1000000),
          album: String(item.collectionName || 'Álbum'),
          artist: String(item.artistName || 'Artista'),
          artistId: item.artistId ? Number(item.artistId) : undefined,
          year: releaseDateStr ? releaseDateStr.slice(0, 4) : '',
          releaseDate: releaseDateStr ? releaseDateStr.slice(0, 10) : '',
          trackCount: Number(item.trackCount || 10),
          genre: String(item.primaryGenreName || 'Música'),
          coverUrl: upgradeCoverUrl(String(item.artworkUrl100 || '')),
          copyright: item.copyright ? String(item.copyright) : undefined,
          country: String(item.country || 'USA'),
        };
      });
    }
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err;
  }

  const lower = clean.toLowerCase();
  return CURATED_FALLBACK_TRACKS.filter(
    (t) =>
      t.album.toLowerCase().includes(lower) ||
      t.artist.toLowerCase().replace(/\./g, '').includes(lower.replace(/\./g, ''))
  ).map((t) => ({
    collectionId: t.collectionId || t.trackId,
    album: t.album,
    artist: t.artist,
    artistId: t.artistId,
    year: t.year,
    releaseDate: t.releaseDate,
    trackCount: t.trackCount || 11,
    genre: t.genre,
    coverUrl: t.coverUrl,
    copyright: t.publisher,
    country: t.country,
  }));
}

/**
 * Fetches complete album tracklist & metadata by collectionId
 */
export async function fetchAlbumTracklist(
  collectionId: number,
  signal?: AbortSignal
): Promise<{
  albumInfo: CatalogAlbumResult | null;
  tracks: CatalogTrackResult[];
}> {
  try {
    const url = `https://itunes.apple.com/lookup?id=${collectionId}&entity=song`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error('Lookup failed');
    const data = await res.json();

    if (Array.isArray(data.results) && data.results.length > 0) {
      const collectionRaw = data.results.find(
        (r: Record<string, unknown>) => r.wrapperType === 'collection'
      );
      const songsRaw = data.results.filter(
        (r: Record<string, unknown>) => r.wrapperType === 'track'
      );

      const releaseDateStr = String(collectionRaw?.releaseDate || '');
      const albumInfo: CatalogAlbumResult | null = collectionRaw
        ? {
            collectionId: Number(collectionRaw.collectionId),
            album: String(collectionRaw.collectionName || ''),
            artist: String(collectionRaw.artistName || ''),
            artistId: collectionRaw.artistId ? Number(collectionRaw.artistId) : undefined,
            year: releaseDateStr ? releaseDateStr.slice(0, 4) : '',
            releaseDate: releaseDateStr ? releaseDateStr.slice(0, 10) : '',
            trackCount: Number(collectionRaw.trackCount || songsRaw.length),
            genre: String(collectionRaw.primaryGenreName || ''),
            coverUrl: upgradeCoverUrl(String(collectionRaw.artworkUrl100 || '')),
            copyright: collectionRaw.copyright ? String(collectionRaw.copyright) : undefined,
            country: String(collectionRaw.country || 'USA'),
          }
        : null;

      const tracks: CatalogTrackResult[] = songsRaw.map((item: Record<string, unknown>) => {
        const tRelease = String(item.releaseDate || '');
        const tYear = tRelease ? tRelease.slice(0, 4) : albumInfo?.year || '';
        const tNum = item.trackNumber ? String(item.trackNumber) : '1';
        const tCount = item.trackCount ? Number(item.trackCount) : albumInfo?.trackCount;
        return {
          trackId: Number(item.trackId),
          title: String(item.trackName || ''),
          artist: String(item.artistName || ''),
          album: String(item.collectionName || ''),
          collectionId: Number(item.collectionId),
          year: tYear,
          releaseDate: tRelease ? tRelease.slice(0, 10) : tYear,
          trackNumber: tCount ? `${tNum}/${tCount}` : tNum,
          trackCount: tCount,
          discNumber: item.discNumber ? Number(item.discNumber) : 1,
          genre: String(item.primaryGenreName || albumInfo?.genre || ''),
          durationMs: Number(item.trackTimeMillis || 0),
          coverUrl: upgradeCoverUrl(String(item.artworkUrl100 || albumInfo?.coverUrl || '')),
          previewUrl: item.previewUrl ? String(item.previewUrl) : undefined,
          publisher: albumInfo?.copyright,
        };
      });

      return { albumInfo, tracks };
    }
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err;
  }

  return { albumInfo: null, tracks: [] };
}

/**
 * Fetches rich artist profile including discography albums and top tracks
 */
export async function searchArtistProfileOnline(
  query: string,
  signal?: AbortSignal
): Promise<CatalogArtistResult[]> {
  const clean = query.trim();
  if (!clean) return [];

  try {
    const [albums, tracks] = await Promise.all([
      searchAlbumsOnline(clean, 16, signal),
      searchTracksOnline(clean, 16, signal),
    ]);

    const artistMap = new Map<string, CatalogArtistResult>();

    for (const alb of albums) {
      const key = alb.artist.toLowerCase();
      if (!artistMap.has(key)) {
        artistMap.set(key, {
          artistId: alb.artistId || Math.floor(Math.random() * 100000),
          artist: alb.artist,
          primaryGenre: alb.genre,
          topAlbums: [],
          topTracks: [],
        });
      }
      const entry = artistMap.get(key)!;
      if (entry.topAlbums.length < 6) {
        entry.topAlbums.push(alb);
      }
    }

    for (const trk of tracks) {
      const key = trk.artist.toLowerCase();
      if (!artistMap.has(key)) {
        artistMap.set(key, {
          artistId: trk.artistId || Math.floor(Math.random() * 100000),
          artist: trk.artist,
          primaryGenre: trk.genre,
          topAlbums: [],
          topTracks: [],
        });
      }
      const entry = artistMap.get(key)!;
      if (entry.topTracks.length < 6) {
        entry.topTracks.push(trk);
      }
    }

    return Array.from(artistMap.values()).slice(0, 6);
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err;
    return [];
  }
}

export function formatDurationMs(ms: number): string {
  if (!ms || ms <= 0) return '03:45';
  const totalSec = Math.floor(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
