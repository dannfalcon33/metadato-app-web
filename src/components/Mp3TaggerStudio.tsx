import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Upload,
  Search,
  Download,
  Sparkles,
  ImagePlus,
  RotateCcw,
  CheckCircle2,
  FileAudio,
  Play,
  Pause,
  HardDriveDownload,
  FileText,
  AlertTriangle,
  Compass,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from 'lucide-react';
import { CatalogTrackResult, Mp3Metadata } from '../types/music';
import {
  createUntaggedSampleMp3File,
  fetchCoverBytesFromUrl,
  inspectId3Frames,
  PostWriteVerificationResult,
  PreservedId3Frame,
  readMp3Metadata,
  verifyWrittenMp3Blob,
  writeMp3MetadataToBlob,
} from '../utils/id3';
import {
  fetchTrackLyricsOnline,
  parseFilenameToSearchQuery,
  searchTracksOnline,
} from '../services/musicCatalog';
import { CoverArtVisual } from './CoverArtVisual';
import { useLanguage } from '../i18n/LanguageContext';

interface Mp3TaggerStudioProps {
  externalSelectedTrack: CatalogTrackResult | null;
  onClearExternalTrack: () => void;
}

const SAMPLE_UNTAGGED_FILES = [
  'REM - Losing My Religion.mp3',
  'Daft Punk - Veridis Quo.mp3',
  'Kavinsky - Nightcall.mp3',
  'Soda Stereo - De Musica Ligera.mp3',
];

const EMPTY_METADATA: Mp3Metadata = {
  title: '',
  artist: '',
  album: '',
  year: '',
  trackNumber: '',
  genre: '',
  composer: '',
  publisher: '',
  comment: '',
  lyrics: '',
  coverUrl: '',
};

const revealTransition = {
  duration: 0.42,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const Mp3TaggerStudio: React.FC<Mp3TaggerStudioProps> = ({
  externalSelectedTrack,
  onClearExternalTrack,
}) => {
  const { tr } = useLanguage();

  const [loadedFileName, setLoadedFileName] = useState<string>('');
  const [loadedFileSize, setLoadedFileSize] = useState<number>(0);
  const [originalId3Status, setOriginalId3Status] = useState<string>('');
  const [mp3ArrayBuffer, setMp3ArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [preservedFrames, setPreservedFrames] = useState<PreservedId3Frame[]>(
    []
  );
  const [metadata, setMetadata] = useState<Mp3Metadata>(EMPTY_METADATA);

  const [isAutoSearching, setIsAutoSearching] = useState<boolean>(false);
  const [isFetchingLyrics, setIsFetchingLyrics] = useState<boolean>(false);
  const [autoMatchNotice, setAutoMatchNotice] = useState<string>('');
  const [fileErrorNotice, setFileErrorNotice] = useState<string>('');
  const [candidateMatches, setCandidateMatches] = useState<CatalogTrackResult[]>(
    []
  );
  const [manualQuery, setManualQuery] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string>('');
  const [postWriteReport, setPostWriteReport] =
    useState<PostWriteVerificationResult | null>(null);
  const [showBinaryInspectorMobile, setShowBinaryInspectorMobile] =
    useState<boolean>(true);

  const [previewAudioUrl, setPreviewAudioUrl] = useState<string>('');
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (externalSelectedTrack) {
      applyCatalogTrackToEditor(externalSelectedTrack, true);
      onClearExternalTrack();
    } else if (!mp3ArrayBuffer) {
      const defaultDemoFile = createUntaggedSampleMp3File(
        'REM - Losing My Religion.mp3'
      );
      handleProcessMp3File(defaultDemoFile, true);
    }

    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      if (searchAbortRef.current) {
        searchAbortRef.current.abort();
      }
    };
  }, [externalSelectedTrack]);

  const stopPreviewPlayback = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
    setIsPlayingPreview(false);
  };

  const togglePreviewPlayback = () => {
    if (!previewAudioUrl) return;
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio(previewAudioUrl);
      audioPlayerRef.current.onended = () => setIsPlayingPreview(false);
    } else if (audioPlayerRef.current.src !== previewAudioUrl) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.src = previewAudioUrl;
    }

    if (isPlayingPreview) {
      audioPlayerRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioPlayerRef.current.play().catch(() => setIsPlayingPreview(false));
      setIsPlayingPreview(true);
    }
  };

  const applyCatalogTrackToEditor = async (
    track: CatalogTrackResult,
    fromExplorer = false
  ) => {
    stopPreviewPlayback();
    setPreviewAudioUrl(track.previewUrl || '');
    setExportSuccessMessage('');
    setPostWriteReport(null);
    setFileErrorNotice('');

    if (!mp3ArrayBuffer) {
      const generatedFile = createUntaggedSampleMp3File(
        `${track.artist} - ${track.title}.mp3`
      );
      const buf = await generatedFile.arrayBuffer();
      setMp3ArrayBuffer(buf);
      setLoadedFileName(generatedFile.name);
      setLoadedFileSize(generatedFile.size);
      setOriginalId3Status(
        tr(
          'Contenedor MP3 de trabajo listo',
          'Working MP3 container ready',
          'Contêiner MP3 de trabalho pronto'
        )
      );
      setPreservedFrames([]);
    }

    setIsFetchingLyrics(true);
    const [coverData, fetchedLyrics] = await Promise.all([
      fetchCoverBytesFromUrl(track.coverUrl),
      track.lyrics
        ? Promise.resolve(track.lyrics)
        : fetchTrackLyricsOnline(track.artist, track.title),
    ]);
    setIsFetchingLyrics(false);

    setMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album,
      year: track.year,
      trackNumber: track.trackNumber,
      genre: track.genre,
      composer: track.artist,
      publisher: track.publisher || `${track.country || 'Global'} Release`,
      comment: `MetaPulse ID3v2.3`,
      lyrics: fetchedLyrics,
      coverUrl: track.coverUrl,
      coverBytes: coverData?.bytes,
      coverMimeType: coverData?.mimeType || 'image/jpeg',
    });

    setAutoMatchNotice(
      fromExplorer
        ? tr(
            `Metadatos precompletados desde el Buscador Musical para "${track.artist} - ${track.title}". Revisa los campos antes de descargar.`,
            `Metadata prefilled from Music Search for "${track.artist} - ${track.title}". Review fields before downloading.`,
            `Metadados preenchidos pelo Buscador Musical para "${track.artist} - ${track.title}". Revise os campos antes de baixar.`
          )
        : tr(
            `Autocompletado web de etiquetas, carátula y letra completado para "${track.artist} - ${track.title}" (${track.album}, ${track.year}).`,
            `Web autocomplete of tags, cover art, and lyrics completed for "${track.artist} - ${track.title}" (${track.album}, ${track.year}).`,
            `Preenchimento automático web de tags, capa e letra concluído para "${track.artist} - ${track.title}" (${track.album}, ${track.year}).`
          )
    );
  };

  const handleFetchLyricsForCurrentFields = async () => {
    if (!metadata.title.trim()) return;
    setIsFetchingLyrics(true);
    try {
      const lyricsText = await fetchTrackLyricsOnline(
        metadata.artist,
        metadata.title
      );
      setMetadata((prev) => ({ ...prev, lyrics: lyricsText }));
    } finally {
      setIsFetchingLyrics(false);
      setExportSuccessMessage('');
      setPostWriteReport(null);
    }
  };

  const validateAndProcessFile = (file: File) => {
    setFileErrorNotice('');
    const isMp3Extension = /\.mp3$/i.test(file.name);
    const isMp3Mime =
      file.type === 'audio/mpeg' ||
      file.type === 'audio/mp3' ||
      file.type === '';

    if (!isMp3Extension && !isMp3Mime) {
      setFileErrorNotice(
        tr(
          `El archivo "${file.name}" no es un archivo MP3 válido. Selecciona un archivo con extensión .mp3.`,
          `File "${file.name}" is not a valid MP3 file. Please select a file with the .mp3 extension.`,
          `O arquivo "${file.name}" não é um arquivo MP3 válido. Selecione um arquivo com extensão .mp3.`
        )
      );
      return;
    }

    handleProcessMp3File(file, false);
  };

  const handleProcessMp3File = async (file: File, isSample = false) => {
    stopPreviewPlayback();
    setExportSuccessMessage('');
    setPostWriteReport(null);
    setFileErrorNotice('');
    setLoadedFileName(file.name);
    setLoadedFileSize(file.size);

    const buffer = await file.arrayBuffer();
    setMp3ArrayBuffer(buffer);

    const parsed = readMp3Metadata(buffer);
    setPreservedFrames(parsed.preservedFrames);

    const { guessedArtist, guessedTitle, cleanQuery } =
      parseFilenameToSearchQuery(file.name);
    setManualQuery(cleanQuery);

    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
    }
    const controller = new AbortController();
    searchAbortRef.current = controller;

    if (parsed.hasExistingTags && parsed.metadata.title && parsed.metadata.artist) {
      setOriginalId3Status(
        tr(
          `${parsed.id3Version} detectado en el archivo`,
          `${parsed.id3Version} detected in file`,
          `${parsed.id3Version} detectado no arquivo`
        )
      );
      const existingLyrics =
        parsed.metadata.lyrics ||
        (await fetchTrackLyricsOnline(
          parsed.metadata.artist || guessedArtist,
          parsed.metadata.title || guessedTitle,
          controller.signal
        ).catch(() => ''));

      setMetadata({
        title: parsed.metadata.title || guessedTitle,
        artist: parsed.metadata.artist || guessedArtist,
        album: parsed.metadata.album || '',
        year: parsed.metadata.year || '',
        trackNumber: parsed.metadata.trackNumber || '1',
        genre: parsed.metadata.genre || '',
        composer: parsed.metadata.composer || '',
        publisher: parsed.metadata.publisher || '',
        comment: parsed.metadata.comment || '',
        lyrics: existingLyrics,
        coverUrl: parsed.metadata.coverUrl || '',
        coverBytes: parsed.metadata.coverBytes,
        coverMimeType: parsed.metadata.coverMimeType,
      });
      setAutoMatchNotice(
        tr(
          `Se leyeron las etiquetas ${parsed.id3Version} existentes del archivo y se sincronizó su letra (USLT).`,
          `Existing ${parsed.id3Version} tags were read from the file and its lyrics (USLT) were synchronized.`,
          `As tags ${parsed.id3Version} existentes do arquivo foram lidas e sua letra (USLT) foi sincronizada.`
        )
      );
      try {
        const matches = await searchTracksOnline(
          `${parsed.metadata.artist} ${parsed.metadata.title}`,
          6,
          controller.signal
        );
        setCandidateMatches(matches);
      } catch {
        // aborted
      }
    } else {
      setOriginalId3Status(
        isSample
          ? tr(
              'Archivo MP3 de prueba sin etiquetas (0 bytes ID3)',
              'Sample untagged MP3 file (0 bytes ID3)',
              'Arquivo MP3 de teste sem tags (0 bytes ID3)'
            )
          : tr(
              'Sin etiquetas ID3 — Búsqueda web activada',
              'No ID3 tags — Web lookup activated',
              'Sem tags ID3 — Busca web ativada'
            )
      );
      setIsAutoSearching(true);
      setAutoMatchNotice(
        tr(
          `Analizando "${file.name}" y buscando carátula, letra (USLT) y etiquetas en la red...`,
          `Analyzing "${file.name}" and searching for cover art, lyrics (USLT), and tags online...`,
          `Analisando "${file.name}" e buscando capa, letra (USLT) e tags online...`
        )
      );

      try {
        const matches = await searchTracksOnline(
          cleanQuery,
          6,
          controller.signal
        );
        setCandidateMatches(matches);
        setIsAutoSearching(false);

        if (matches.length > 0) {
          await applyCatalogTrackToEditor(matches[0], false);
        } else {
          const fallbackLyrics = await fetchTrackLyricsOnline(
            guessedArtist,
            guessedTitle,
            controller.signal
          );
          setMetadata({
            ...EMPTY_METADATA,
            title: guessedTitle,
            artist: guessedArtist,
            lyrics: fallbackLyrics,
          });
          setAutoMatchNotice(
            tr(
              `No se hallaron coincidencias exactas en el catálogo en línea. Se extrajo "${guessedArtist} - ${guessedTitle}" del nombre del archivo para edición manual.`,
              `No exact matches found in online catalog. Extracted "${guessedArtist} - ${guessedTitle}" from filename for manual editing.`,
              `Nenhuma correspondência exata encontrada no catálogo online. Extraído "${guessedArtist} - ${guessedTitle}" do nome do arquivo para edição manual.`
            )
          );
        }
      } catch (err) {
        if ((err as Error)?.name !== 'AbortError') {
          setIsAutoSearching(false);
        }
      }
    }
  };

  const handleManualWebSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuery.trim()) return;

    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
    }
    const controller = new AbortController();
    searchAbortRef.current = controller;

    setIsAutoSearching(true);
    setAutoMatchNotice(
      tr(
        `Buscando coincidencias y letra para "${manualQuery}"...`,
        `Searching matches and lyrics for "${manualQuery}"...`,
        `Buscando correspondências e letra para "${manualQuery}"...`
      )
    );

    try {
      const matches = await searchTracksOnline(
        manualQuery,
        6,
        controller.signal
      );
      setCandidateMatches(matches);
      setIsAutoSearching(false);
      if (matches.length > 0) {
        await applyCatalogTrackToEditor(matches[0], false);
      } else {
        setAutoMatchNotice(
          tr(
            `No se encontraron resultados en el catálogo para "${manualQuery}". Puedes editar los campos manualmente.`,
            `No catalog results found for "${manualQuery}". You can edit the fields manually.`,
            `Nenhum resultado encontrado no catálogo para "${manualQuery}". Você pode editar os campos manualmente.`
          )
        );
      }
    } catch (err) {
      if ((err as Error)?.name !== 'AbortError') {
        setIsAutoSearching(false);
        setAutoMatchNotice(
          tr(
            'Error de red al consultar el catálogo.',
            'Network error while querying catalog.',
            'Erro de rede ao consultar o catálogo.'
          )
        );
      }
    }
  };

  const handleCustomCoverUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;
    const buf = await imgFile.arrayBuffer();
    const objUrl = URL.createObjectURL(imgFile);
    setMetadata((prev) => ({
      ...prev,
      coverUrl: objUrl,
      coverBytes: new Uint8Array(buf),
      coverMimeType: imgFile.type || 'image/jpeg',
    }));
    setExportSuccessMessage('');
    setPostWriteReport(null);
  };

  const handleDownloadTaggedMp3 = async () => {
    if (!mp3ArrayBuffer) return;
    setIsExporting(true);
    setExportSuccessMessage('');
    setPostWriteReport(null);

    try {
      const taggedBlob = await writeMp3MetadataToBlob(mp3ArrayBuffer, metadata);
      const verification = await verifyWrittenMp3Blob(taggedBlob);
      setPostWriteReport(verification);

      const safeArtist = (metadata.artist || 'Artista').replace(
        /[\\/:*?"<>|]/g,
        ''
      );
      const safeTitle = (metadata.title || 'Cancion').replace(
        /[\\/:*?"<>|]/g,
        ''
      );
      const downloadFileName = `${safeArtist} - ${safeTitle}.mp3`;

      const downloadUrl = URL.createObjectURL(taggedBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = downloadFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);

      setExportSuccessMessage(
        tr(
          `Archivo "${downloadFileName}" (${(taggedBlob.size / 1024).toFixed(1)} KB) generado y descargado correctamente.`,
          `File "${downloadFileName}" (${(taggedBlob.size / 1024).toFixed(1)} KB) generated and downloaded successfully.`,
          `Arquivo "${downloadFileName}" (${(taggedBlob.size / 1024).toFixed(1)} KB) gerado e baixado com sucesso.`
        )
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleFieldChange = (field: keyof Mp3Metadata, value: string) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
    setExportSuccessMessage('');
    setPostWriteReport(null);
  };

  const frameSummaries = inspectId3Frames(metadata, preservedFrames);
  const totalMetadataBytes = frameSummaries.reduce(
    (sum, f) => sum + f.byteSize,
    0
  );

  return (
    <section id="estudio-mp3" className="py-12">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8"
        >
          <div>
            <p className="text-xs font-mono-tabular neon-text tracking-wider mb-2">
              {tr(
                'ESTUDIO DEDICADO DE ETIQUETADO BINARIO MP3',
                'DEDICATED BINARY MP3 TAGGING STUDIO',
                'ESTÚDIO DEDICADO DE TAGUEAMENTO BINÁRIO MP3'
              )}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white balance-text">
              {tr(
                'Editor de Metadatos ID3v2.3, Letras USLT y Carátula APIC',
                'ID3v2.3 Metadata, USLT Lyrics & APIC Cover Art Editor',
                'Editor de Metadados ID3v2.3, Letras USLT e Capa APIC'
              )}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/search"
              className="px-3.5 py-2 rounded-lg bg-[var(--surface-card)] border border-white/15 hover:border-[var(--neon-primary)] text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5 neon-text" />
              <span>
                {tr(
                  'Buscar canciones en el Buscador Musical',
                  'Search songs in Music Search',
                  'Buscar músicas no Buscador Musical'
                )}
              </span>
            </Link>
          </div>
        </motion.div>

        {/* File Validation Error Alert */}
        {fileErrorNotice && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-xs text-rose-200 flex items-center gap-2.5"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{fileErrorNotice}</span>
          </div>
        )}

        {/* Sample Untagged MP3 Quick Bar + File Dropzone */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: 0.04 }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const dropped = e.dataTransfer.files?.[0];
              if (dropped) validateAndProcessFile(dropped);
            }}
            className="lg:col-span-5 bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-sm font-semibold text-white">
                  {tr(
                    '1. Cargar archivo MP3 desde tu equipo',
                    '1. Load MP3 file from your device',
                    '1. Carregar arquivo MP3 do seu dispositivo'
                  )}
                </span>
                <FileAudio className="w-5 h-5 neon-text shrink-0" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-5">
                {tr(
                  'Selecciona o arrastra un archivo ',
                  'Select or drag and drop an ',
                  'Selecione ou arraste um arquivo '
                )}
                <span className="text-white font-mono-tabular">.mp3</span>
                {tr(
                  '. Si no contiene etiquetas ID3 internas (por ejemplo ',
                  ' file. If it has no internal ID3 tags (for example ',
                  '. Se não contiver tags ID3 internas (por exemplo '
                )}
                <span className="text-white font-mono-tabular">
                  &quot;REM - Losing My Religion.mp3&quot;
                </span>
                {tr(
                  '), el sistema analiza el nombre y consulta coincidencias en línea.',
                  '), the system parses the filename and queries online matches.',
                  '), o sistema analisa o nome e consulta correspondências online.'
                )}
              </p>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,audio/mpeg"
                onChange={(e) => {
                  const selected = e.target.files?.[0];
                  if (selected) validateAndProcessFile(selected);
                }}
                className="hidden"
                aria-label={tr(
                  'Seleccionar archivo MP3 local',
                  'Select local MP3 file',
                  'Selecionar arquivo MP3 local'
                )}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-lg neon-btn-primary text-sm flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Upload className="w-4 h-4 shrink-0" />
                <span>
                  {tr(
                    'Seleccionar archivo .MP3 local',
                    'Select local .MP3 file',
                    'Selecionar arquivo .MP3 local'
                  )}
                </span>
              </button>
            </div>
          </motion.div>

          {/* Right: Instant Sample Untagged MP3 Loader + Web Query Override */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: 0.08 }}
            className="lg:col-span-7 bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-sm font-semibold text-white">
                  {tr(
                    '2. Archivos MP3 de prueba sin etiquetas o búsqueda directa',
                    '2. Sample untagged MP3 files or direct search',
                    '2. Arquivos MP3 de teste sem tags ou busca direta'
                  )}
                </span>
                <span className="text-xs text-slate-400 font-mono-tabular">
                  {tr(
                    'Simulador de autodetección',
                    'Auto-detection simulator',
                    'Simulador de autodetecção'
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-4">
                {tr(
                  'Prueba la detección automática con un contenedor MP3 sin metadatos o busca cualquier canción por título y artista:',
                  'Test automatic detection with an untagged MP3 container or search any song by title and artist:',
                  'Teste a detecção automática com um contêiner MP3 sem metadados ou busque qualquer música por título e artista:'
                )}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                {SAMPLE_UNTAGGED_FILES.map((sampleName) => {
                  const isCurrent = loadedFileName === sampleName;
                  return (
                    <button
                      key={sampleName}
                      type="button"
                      onClick={() => {
                        const demoFile = createUntaggedSampleMp3File(sampleName);
                        handleProcessMp3File(demoFile, true);
                      }}
                      className={`px-3.5 py-2.5 rounded-lg text-left text-xs font-mono-tabular transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                        isCurrent
                          ? 'neon-bg-soft neon-text border border-[var(--neon-primary)]'
                          : 'bg-[#090C12] text-slate-300 border border-white/10 hover:border-white/25'
                      }`}
                    >
                      <span className="truncate">{sampleName}</span>
                      <span className="text-[11px] opacity-75 shrink-0">
                        {tr('Cargar', 'Load', 'Carregar')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleManualWebSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={manualQuery}
                  onChange={(e) => setManualQuery(e.target.value)}
                  aria-label={tr(
                    'Buscar canción en línea para autocompletar etiquetas',
                    'Search song online to autocomplete tags',
                    'Buscar música online para autocompletar tags'
                  )}
                  placeholder={tr(
                    'Buscar otra canción en la red (ej. Radiohead - Karma Police)...',
                    'Search another song online (e.g. Radiohead - Karma Police)...',
                    'Buscar outra música na rede (ex. Radiohead - Karma Police)...'
                  )}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#090C12] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[var(--neon-primary)]"
                />
              </div>
              <button
                type="submit"
                disabled={isAutoSearching}
                className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 neon-text" />
                <span>
                  {isAutoSearching
                    ? tr('Buscando...', 'Searching...', 'Buscando...')
                    : tr('Autocompletar', 'Autocomplete', 'Autocompletar')}
                </span>
              </button>
            </form>
          </motion.div>
        </div>

        {/* Status Bar for Current File & Web Auto-Match Candidates */}
        <div
          aria-live="polite"
          className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-5 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span className="text-slate-400">
                {tr('Archivo activo:', 'Active file:', 'Arquivo ativo:')}
              </span>
              <span className="font-mono-tabular font-semibold text-white">
                {loadedFileName || tr('Ninguno', 'None', 'Nenhum')}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono-tabular text-slate-300">
                {(loadedFileSize / 1024).toFixed(1)} KB
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono-tabular neon-text">{originalId3Status}</span>
            </div>

            {autoMatchNotice && (
              <div className="text-xs text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 neon-text shrink-0" />
                <span>{autoMatchNotice}</span>
              </div>
            )}
          </div>

          {candidateMatches.length > 0 && (
            <div className="pt-4">
              <div className="text-xs text-slate-300 mb-2.5">
                {tr(
                  'Coincidencias encontradas (selecciona cualquier edición para revisar sus etiquetas, letra y carátula antes de guardar):',
                  'Matches found (select any release to review its tags, lyrics, and cover art before saving):',
                  'Correspondências encontradas (selecione qualquer edição para revisar suas tags, letra e capa antes de salvar):'
                )}
              </div>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {candidateMatches.map((cand) => {
                  const isSelected =
                    metadata.title === cand.title &&
                    metadata.album === cand.album &&
                    metadata.year === cand.year;
                  return (
                    <button
                      key={cand.trackId}
                      type="button"
                      onClick={() => applyCatalogTrackToEditor(cand, false)}
                      className={`px-3 py-2 rounded-lg text-left transition-colors shrink-0 flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'neon-bg-soft border border-[var(--neon-primary)]'
                          : 'bg-[#090C12] border border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="w-9 h-9 rounded overflow-hidden shrink-0 bg-black">
                        <CoverArtVisual
                          src={cand.coverUrl}
                          alt={cand.album}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="min-w-0 max-w-[200px]">
                        <div className="text-xs font-semibold text-white truncate">
                          {cand.artist} — {cand.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate font-mono-tabular">
                          {cand.album} · {cand.year} ·{' '}
                          {tr('Pista', 'Track', 'Faixa')} {cand.trackNumber}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Main 3-Column Editor Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Cover Art & Audio Preview (4 cols) */}
          <div className="lg:col-span-4 bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">
                {tr(
                  'Carátula frontal (Frame APIC)',
                  'Front Cover Art (APIC Frame)',
                  'Capa frontal (Frame APIC)'
                )}
              </h2>
              <span className="text-xs font-mono-tabular text-slate-400">
                600 × 600 px
              </span>
            </div>

            <div className="aspect-square w-full rounded-lg overflow-hidden border border-white/10 mb-4 bg-[#07090E]">
              <CoverArtVisual
                src={metadata.coverUrl}
                alt={`Cover ${metadata.album || metadata.title || 'MP3'}`}
                title={metadata.title}
                artist={metadata.artist}
                className="w-full h-full"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCustomCoverUpload}
                className="hidden"
                aria-label={tr(
                  'Subir imagen de carátula personalizada',
                  'Upload custom cover art image',
                  'Enviar imagem de capa personalizada'
                )}
              />
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <ImagePlus className="w-4 h-4 neon-text" />
                <span>
                  {tr(
                    'Reemplazar carátula por imagen local',
                    'Replace cover art with local image',
                    'Substituir capa por imagem local'
                  )}
                </span>
              </button>

              {previewAudioUrl ? (
                <button
                  type="button"
                  onClick={togglePreviewPlayback}
                  className="w-full py-2.5 px-4 rounded-lg border border-white/15 hover:border-[var(--neon-primary)] text-xs font-medium text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  {isPlayingPreview ? (
                    <>
                      <Pause className="w-4 h-4 neon-text" />
                      <span>
                        {tr(
                          'Pausar vista previa de referencia',
                          'Pause reference preview',
                          'Pausar prévia de referência'
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 neon-text" />
                      <span>
                        {tr(
                          'Escuchar vista previa disponible',
                          'Listen to available preview',
                          'Ouvir prévia disponível'
                        )}
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <div className="py-2 px-3 rounded-lg bg-[#090C12] border border-white/5 text-[11px] text-slate-400 text-center">
                  {tr(
                    'Vista previa de audio no disponible en la fuente para esta edición',
                    'Audio preview not available from source for this release',
                    'Prévia de áudio não disponível na fonte para esta edição'
                  )}
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 text-xs text-slate-400 space-y-1 font-mono-tabular">
              <div className="flex justify-between">
                <span>
                  {tr('Formato de portada:', 'Cover format:', 'Formato da capa:')}
                </span>
                <span className="text-slate-200">
                  {metadata.coverMimeType || 'image/jpeg'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>
                  {tr('Descriptor ID3:', 'ID3 Descriptor:', 'Descritor ID3:')}
                </span>
                <span className="text-slate-200">0x03 Front Cover</span>
              </div>
            </div>
          </div>

          {/* Column 2: ID3v2.3 Tag Form Fields + Lyrics (USLT) (5 cols) */}
          <div className="lg:col-span-5 bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-white">
                {tr(
                  'Etiquetas y Letra del archivo MP3',
                  'MP3 File Tags & Lyrics',
                  'Tags e Letra do arquivo MP3'
                )}
              </h2>
              <button
                type="button"
                onClick={() => setMetadata(EMPTY_METADATA)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  {tr('Limpiar campos', 'Clear fields', 'Limpar campos')}
                </span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="field-title"
                  className="block text-xs text-slate-300 mb-1.5"
                >
                  {tr('Título de la canción', 'Song Title', 'Título da música')}{' '}
                  <span className="font-mono-tabular text-slate-400">(TIT2)</span>
                </label>
                <input
                  id="field-title"
                  type="text"
                  value={metadata.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="Losing My Religion"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#090C12] border border-white/10 text-sm text-white focus:outline-none focus:border-[var(--neon-primary)]"
                />
              </div>

              <div>
                <label
                  htmlFor="field-artist"
                  className="block text-xs text-slate-300 mb-1.5"
                >
                  {tr('Artista principal', 'Lead Artist', 'Artista principal')}{' '}
                  <span className="font-mono-tabular text-slate-400">(TPE1)</span>
                </label>
                <input
                  id="field-artist"
                  type="text"
                  value={metadata.artist}
                  onChange={(e) => handleFieldChange('artist', e.target.value)}
                  placeholder="R.E.M."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#090C12] border border-white/10 text-sm text-white focus:outline-none focus:border-[var(--neon-primary)]"
                />
              </div>

              <div>
                <label
                  htmlFor="field-album"
                  className="block text-xs text-slate-300 mb-1.5"
                >
                  {tr('Álbum', 'Album', 'Álbum')}{' '}
                  <span className="font-mono-tabular text-slate-400">(TALB)</span>
                </label>
                <input
                  id="field-album"
                  type="text"
                  value={metadata.album}
                  onChange={(e) => handleFieldChange('album', e.target.value)}
                  placeholder="Out of Time"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#090C12] border border-white/10 text-sm text-white focus:outline-none focus:border-[var(--neon-primary)]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="field-year"
                    className="block text-xs text-slate-300 mb-1.5"
                  >
                    {tr('Año', 'Year', 'Ano')}{' '}
                    <span className="font-mono-tabular text-slate-400">(TYER)</span>
                  </label>
                  <input
                    id="field-year"
                    type="text"
                    value={metadata.year}
                    onChange={(e) => handleFieldChange('year', e.target.value)}
                    placeholder="1991"
                    className="w-full px-3 py-2 rounded-lg bg-[#090C12] border border-white/10 text-sm font-mono-tabular text-white focus:outline-none focus:border-[var(--neon-primary)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="field-track"
                    className="block text-xs text-slate-300 mb-1.5"
                  >
                    {tr('Pista', 'Track', 'Faixa')}{' '}
                    <span className="font-mono-tabular text-slate-400">(TRCK)</span>
                  </label>
                  <input
                    id="field-track"
                    type="text"
                    value={metadata.trackNumber}
                    onChange={(e) => handleFieldChange('trackNumber', e.target.value)}
                    placeholder="4/11"
                    className="w-full px-3 py-2 rounded-lg bg-[#090C12] border border-white/10 text-sm font-mono-tabular text-white focus:outline-none focus:border-[var(--neon-primary)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="field-genre"
                    className="block text-xs text-slate-300 mb-1.5"
                  >
                    {tr('Género', 'Genre', 'Gênero')}{' '}
                    <span className="font-mono-tabular text-slate-400">(TCON)</span>
                  </label>
                  <input
                    id="field-genre"
                    type="text"
                    value={metadata.genre}
                    onChange={(e) => handleFieldChange('genre', e.target.value)}
                    placeholder="Alternative"
                    className="w-full px-3 py-2 rounded-lg bg-[#090C12] border border-white/10 text-sm text-white focus:outline-none focus:border-[var(--neon-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="field-composer"
                    className="block text-xs text-slate-300 mb-1.5"
                  >
                    {tr('Compositor', 'Composer', 'Compositor')}{' '}
                    <span className="font-mono-tabular text-slate-400">(TCOM)</span>
                  </label>
                  <input
                    id="field-composer"
                    type="text"
                    value={metadata.composer}
                    onChange={(e) => handleFieldChange('composer', e.target.value)}
                    placeholder="Bill Berry, Peter Buck, Mike Mills, Michael Stipe"
                    className="w-full px-3 py-2 rounded-lg bg-[#090C12] border border-white/10 text-xs text-white focus:outline-none focus:border-[var(--neon-primary)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="field-publisher"
                    className="block text-xs text-slate-300 mb-1.5"
                  >
                    {tr(
                      'Sello / Editorial',
                      'Label / Publisher',
                      'Gravadora / Editora'
                    )}{' '}
                    <span className="font-mono-tabular text-slate-400">(TPUB)</span>
                  </label>
                  <input
                    id="field-publisher"
                    type="text"
                    value={metadata.publisher}
                    onChange={(e) => handleFieldChange('publisher', e.target.value)}
                    placeholder="Warner Bros. Records"
                    className="w-full px-3 py-2 rounded-lg bg-[#090C12] border border-white/10 text-xs text-white focus:outline-none focus:border-[var(--neon-primary)]"
                  />
                </div>
              </div>

              {/* Song Lyrics Field (USLT Frame) */}
              <div className="pt-1">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label
                    htmlFor="field-lyrics"
                    className="text-xs text-slate-300 flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 neon-text" />
                    <span>
                      {tr('Letra del tema', 'Song Lyrics', 'Letra da música')}{' '}
                      <span className="font-mono-tabular text-slate-400">(USLT)</span>
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={handleFetchLyricsForCurrentFields}
                    disabled={isFetchingLyrics || !metadata.title.trim()}
                    className="text-xs neon-text hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>
                      {isFetchingLyrics
                        ? tr(
                            'Buscando letra...',
                            'Fetching lyrics...',
                            'Buscando letra...'
                          )
                        : tr(
                            'Buscar letra en la red',
                            'Fetch lyrics online',
                            'Buscar letra na rede'
                          )}
                    </span>
                  </button>
                </div>
                <textarea
                  id="field-lyrics"
                  rows={6}
                  value={metadata.lyrics}
                  onChange={(e) => handleFieldChange('lyrics', e.target.value)}
                  placeholder={tr(
                    'La letra de la canción se autocompleta aquí o puedes pegarla manualmente para incrustarla en el frame binario USLT del MP3...',
                    'Song lyrics are autocompleted here or you can paste them manually to embed inside the MP3 binary USLT frame...',
                    'A letra da música é preenchida automaticamente aqui ou você pode colá-la manualmente para incorporá-la no frame binário USLT do MP3...'
                  )}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090C12] border border-white/10 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-[var(--neon-primary)] resize-y font-sans"
                />
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono-tabular mt-1">
                  <span>
                    {tr(
                      'Incrustación estándar ID3v2.3 USLT (UTF-16)',
                      'Standard ID3v2.3 USLT embedding (UTF-16)',
                      'Incorporação padrão ID3v2.3 USLT (UTF-16)'
                    )}
                  </span>
                  <span>
                    {metadata.lyrics.length}{' '}
                    {tr('caracteres', 'characters', 'caracteres')}
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="field-comment"
                  className="block text-xs text-slate-300 mb-1.5"
                >
                  {tr('Comentario embebido', 'Embedded Comment', 'Comentário embutido')}{' '}
                  <span className="font-mono-tabular text-slate-400">(COMM)</span>
                </label>
                <input
                  id="field-comment"
                  type="text"
                  value={metadata.comment}
                  onChange={(e) => handleFieldChange('comment', e.target.value)}
                  placeholder={tr(
                    'Notas de masterización o catálogo...',
                    'Mastering or catalog notes...',
                    'Notas de masterização ou catálogo...'
                  )}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#090C12] border border-white/10 text-xs text-white focus:outline-none focus:border-[var(--neon-primary)]"
                />
              </div>
            </div>
          </div>

          {/* Column 3: Download Action + Post-Write Verification + Collapsible Binary ID3 Frame Table (3 cols) */}
          <div className="lg:col-span-3 bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6 flex flex-col justify-between gap-6">
            <div>
              <h2 className="text-sm font-semibold text-white mb-2">
                {tr(
                  'Exportación del archivo MP3',
                  'MP3 File Export',
                  'Exportação do arquivo MP3'
                )}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {tr(
                  'Inyecta las etiquetas revisadas en la cabecera binaria ID3v2.3 sin recodificar el flujo de audio original.',
                  'Injects the reviewed tags into the ID3v2.3 binary header without re-encoding the original audio stream.',
                  'Injeta as tags revisadas no cabeçalho binário ID3v2.3 sem recodificar o fluxo de áudio original.'
                )}
              </p>

              <button
                type="button"
                onClick={handleDownloadTaggedMp3}
                disabled={isExporting || !mp3ArrayBuffer}
                className="w-full py-3.5 px-4 rounded-lg neon-btn-primary text-sm flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap disabled:opacity-50"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>
                  {isExporting
                    ? tr(
                        'Empaquetando MP3...',
                        'Packaging MP3...',
                        'Empacotando MP3...'
                      )
                    : tr(
                        'Descargar MP3 con Metadatos',
                        'Download Tagged MP3',
                        'Baixar MP3 com Metadados'
                      )}
                </span>
              </button>

              {exportSuccessMessage && (
                <div
                  role="status"
                  className="mt-4 p-3 rounded-lg neon-bg-soft border border-[var(--neon-primary)] text-xs text-slate-200 leading-relaxed flex flex-col gap-2"
                >
                  <div className="flex items-start gap-2">
                    <HardDriveDownload className="w-4 h-4 neon-text shrink-0 mt-0.5" />
                    <span>{exportSuccessMessage}</span>
                  </div>

                  {postWriteReport && postWriteReport.verified && (
                    <div className="pt-2 border-t border-white/10 font-mono-tabular text-[11px] text-slate-300 space-y-1">
                      <div className="flex items-center gap-1.5 neon-text font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {tr(
                            'Verificación post-escritura superada',
                            'Post-write verification passed',
                            'Verificação pós-escrita aprovada'
                          )}
                        </span>
                      </div>
                      <div>
                        {tr(
                          'Cabecera re-leída:',
                          'Re-read header:',
                          'Cabeçalho relido:'
                        )}{' '}
                        {postWriteReport.id3Version} (
                        {postWriteReport.verifiedFramesCount}{' '}
                        {tr(
                          'tramas verificadas',
                          'verified frames',
                          'frames verificados'
                        )}
                        )
                      </div>
                      <div>
                        APIC: {postWriteReport.hasCoverArt ? 'OK' : 'No'} · USLT:{' '}
                        {postWriteReport.hasLyrics ? 'OK' : 'No'}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Advanced Binary Frame Inspector (Collapsible on small screens) */}
            <div className="pt-5 border-t border-white/10">
              <button
                type="button"
                onClick={() =>
                  setShowBinaryInspectorMobile((prev) => !prev)
                }
                className="w-full flex items-center justify-between text-left mb-3 cursor-pointer"
              >
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {tr(
                      'Inspector binario ID3v2.3',
                      'ID3v2.3 Binary Inspector',
                      'Inspetor binário ID3v2.3'
                    )}
                  </span>
                  <span className="text-xs font-mono-tabular neon-text">
                    {tr('Total cabecera:', 'Total header:', 'Total cabeçalho:')}{' '}
                    {(totalMetadataBytes / 1024).toFixed(1)} KB
                  </span>
                </div>
                <span className="text-slate-400">
                  {showBinaryInspectorMobile ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </span>
              </button>

              {showBinaryInspectorMobile && (
                <div className="border border-white/10 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-[#090C12] text-xs text-slate-400">
                        <th className="py-2 px-2.5 font-medium">Frame</th>
                        <th className="py-2 px-2.5 font-medium">
                          {tr('Valor', 'Value', 'Valor')}
                        </th>
                        <th className="py-2 px-2.5 font-medium text-right">
                          Bytes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {frameSummaries.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="py-6 px-3 text-center text-slate-400"
                          >
                            {tr(
                              'Completa al menos un campo para generar tramas ID3v2.3.',
                              'Fill in at least one field to generate ID3v2.3 frames.',
                              'Preencha pelo menos um campo para gerar frames ID3v2.3.'
                            )}
                          </td>
                        </tr>
                      ) : (
                        frameSummaries.map((f) => (
                          <tr key={f.frameId} className="hover:bg-white/[0.02]">
                            <td className="py-2 px-2.5 font-mono-tabular neon-text font-medium">
                              {f.frameId}
                            </td>
                            <td
                              className="py-2 px-2.5 text-slate-300 truncate max-w-[110px]"
                              title={f.description}
                            >
                              {f.valuePreview}
                            </td>
                            <td className="py-2 px-2.5 font-mono-tabular text-slate-400 text-right">
                              {f.byteSize}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
