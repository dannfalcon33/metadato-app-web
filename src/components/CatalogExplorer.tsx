import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search,
  Disc,
  User,
  Music,
  Play,
  Pause,
  ArrowUpRight,
  ListMusic,
  X,
  FileText,
  VolumeX,
  SlidersHorizontal,
} from 'lucide-react';
import {
  CatalogAlbumResult,
  CatalogArtistResult,
  CatalogTrackResult,
} from '../types/music';
import {
  fetchAlbumTracklist,
  fetchTrackLyricsOnline,
  formatDurationMs,
  searchAlbumsOnline,
  searchArtistProfileOnline,
  searchTracksOnline,
} from '../services/musicCatalog';
import { CoverArtVisual } from './CoverArtVisual';

interface CatalogExplorerProps {
  onSendTrackToEditor: (track: CatalogTrackResult) => void;
}

type SearchMode = 'songs' | 'artists' | 'albums';

const QUICK_SEARCH_PRESETS = [
  'R.E.M.',
  'Daft Punk',
  'Soda Stereo',
  'Radiohead',
  'Kavinsky',
  'Depeche Mode',
];

const revealTransition = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1] as const,
};

function formatSeconds(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const CatalogExplorer: React.FC<CatalogExplorerProps> = ({
  onSendTrackToEditor,
}) => {
  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState<SearchMode>('songs');
  const [query, setQuery] = useState<string>('R.E.M.');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Contextual filters (Section 8)
  const [selectedGenreFilter, setSelectedGenreFilter] =
    useState<string>('all');
  const [onlyWithPreviewFilter, setOnlyWithPreviewFilter] =
    useState<boolean>(false);

  const [songResults, setSongResults] = useState<CatalogTrackResult[]>([]);
  const [artistResults, setArtistResults] = useState<CatalogArtistResult[]>([]);
  const [albumResults, setAlbumResults] = useState<CatalogAlbumResult[]>([]);

  // Detailed Album Tracklist Drawer State
  const [selectedAlbumDetail, setSelectedAlbumDetail] =
    useState<CatalogAlbumResult | null>(null);
  const [albumTracks, setAlbumTracks] = useState<CatalogTrackResult[]>([]);
  const [isLoadingAlbumTracks, setIsLoadingAlbumTracks] =
    useState<boolean>(false);

  // Lyrics Inspector State in Catalog Explorer
  const [inspectedLyricsTrack, setInspectedLyricsTrack] =
    useState<CatalogTrackResult | null>(null);
  const [inspectedLyricsText, setInspectedLyricsText] = useState<string>('');
  const [isLoadingLyrics, setIsLoadingLyrics] = useState<boolean>(false);

  // Single-instance Audio preview state with real duration & progress
  const [playingTrack, setPlayingTrack] = useState<CatalogTrackResult | null>(
    null
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [previewCurrentTime, setPreviewCurrentTime] = useState<number>(0);
  const [previewDuration, setPreviewDuration] = useState<number>(0);
  const [previewErrorId, setPreviewErrorId] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    executeCatalogSearch('R.E.M.', 'songs');
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (searchAbortRef.current) {
        searchAbortRef.current.abort();
      }
    };
  }, []);

  const stopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
    setPlayingTrack(null);
    setPreviewCurrentTime(0);
    setPreviewDuration(0);
  };

  const toggleTrackPreview = (track: CatalogTrackResult) => {
    if (!track.previewUrl) return;
    setPreviewErrorId(null);

    if (playingTrack?.trackId === track.trackId) {
      if (isPlayingAudio) {
        audioRef.current?.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current
          ?.play()
          .then(() => setIsPlayingAudio(true))
          .catch(() => setPreviewErrorId(track.trackId));
      }
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.ontimeupdate = () => {
        setPreviewCurrentTime(audioRef.current?.currentTime || 0);
      };
      audioRef.current.onloadedmetadata = () => {
        setPreviewDuration(audioRef.current?.duration || 0);
      };
      audioRef.current.onended = () => {
        setIsPlayingAudio(false);
        setPreviewCurrentTime(0);
      };
    } else {
      audioRef.current.pause();
    }

    audioRef.current.src = track.previewUrl;
    audioRef.current.onerror = () => {
      setIsPlayingAudio(false);
      setPlayingTrack(null);
      setPreviewErrorId(track.trackId);
    };

    setPlayingTrack(track);
    setPreviewCurrentTime(0);
    setPreviewDuration(0);

    audioRef.current
      .play()
      .then(() => {
        setIsPlayingAudio(true);
      })
      .catch(() => {
        setIsPlayingAudio(false);
        setPlayingTrack(null);
        setPreviewErrorId(track.trackId);
      });
  };

  const executeCatalogSearch = async (
    searchTerm: string,
    mode: SearchMode = searchMode
  ) => {
    const clean = searchTerm.trim();
    if (!clean) return;

    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
    }
    const controller = new AbortController();
    searchAbortRef.current = controller;

    stopPreview();
    setIsLoading(true);
    setErrorMessage('');
    setSelectedGenreFilter('all');

    try {
      if (mode === 'songs') {
        const tracks = await searchTracksOnline(clean, 12, controller.signal);
        setSongResults(tracks);
      } else if (mode === 'artists') {
        const artists = await searchArtistProfileOnline(
          clean,
          controller.signal
        );
        setArtistResults(artists);
      } else if (mode === 'albums') {
        const albums = await searchAlbumsOnline(clean, 12, controller.signal);
        setAlbumResults(albums);
      }
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return;
      setErrorMessage(
        'No fue posible completar la consulta en línea. Intenta nuevamente.'
      );
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  const handleModeSwitch = (newMode: SearchMode) => {
    setSearchMode(newMode);
    setSelectedAlbumDetail(null);
    executeCatalogSearch(query, newMode);
  };

  const handleOpenAlbumInspector = async (album: CatalogAlbumResult) => {
    setSelectedAlbumDetail(album);
    setIsLoadingAlbumTracks(true);
    const { albumInfo, tracks } = await fetchAlbumTracklist(album.collectionId);
    if (albumInfo) {
      setSelectedAlbumDetail(albumInfo);
    }
    setAlbumTracks(tracks);
    setIsLoadingAlbumTracks(false);
  };

  const handleInspectTrackLyrics = async (track: CatalogTrackResult) => {
    setInspectedLyricsTrack(track);
    setIsLoadingLyrics(true);
    try {
      const text = track.lyrics
        ? track.lyrics
        : await fetchTrackLyricsOnline(track.artist, track.title);
      setInspectedLyricsText(text);
    } finally {
      setIsLoadingLyrics(false);
    }
  };

  const handleTransferToEditor = (track: CatalogTrackResult) => {
    stopPreview();
    onSendTrackToEditor(track);
    navigate('/editor', { state: { prefilledTrack: track } });
  };

  // Extract available genres dynamically for contextual filtering
  const availableGenres = useMemo(() => {
    const set = new Set<string>();
    if (searchMode === 'songs') {
      songResults.forEach((s) => s.genre && set.add(s.genre));
    } else if (searchMode === 'albums') {
      albumResults.forEach((a) => a.genre && set.add(a.genre));
    } else {
      artistResults.forEach((ar) => ar.primaryGenre && set.add(ar.primaryGenre));
    }
    return Array.from(set);
  }, [searchMode, songResults, albumResults, artistResults]);

  const filteredSongs = useMemo(() => {
    return songResults.filter((s) => {
      if (selectedGenreFilter !== 'all' && s.genre !== selectedGenreFilter) {
        return false;
      }
      if (onlyWithPreviewFilter && !s.previewUrl) {
        return false;
      }
      return true;
    });
  }, [songResults, selectedGenreFilter, onlyWithPreviewFilter]);

  const filteredAlbums = useMemo(() => {
    return albumResults.filter((a) => {
      if (selectedGenreFilter !== 'all' && a.genre !== selectedGenreFilter) {
        return false;
      }
      return true;
    });
  }, [albumResults, selectedGenreFilter]);

  const filteredArtists = useMemo(() => {
    return artistResults.filter((ar) => {
      if (
        selectedGenreFilter !== 'all' &&
        ar.primaryGenre !== selectedGenreFilter
      ) {
        return false;
      }
      return true;
    });
  }, [artistResults, selectedGenreFilter]);

  return (
    <section id="explorador-musical" className="py-12">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8"
        >
          <div>
            <p className="text-xs font-mono-tabular neon-text tracking-wider mb-2">
              BUSCADOR MUSICAL E INSPECTOR DISCOGRÁFICO
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white balance-text">
              Consulta canciones, artistas, álbumes, letras y vistas previas disponibles
            </h1>
          </div>

          <p className="text-xs text-slate-300 max-w-md">
            Explora fichas técnicas o transfiere los metadatos de cualquier resultado
            al Editor MP3 para revisarlos antes de escribir en tu archivo.
          </p>
        </motion.div>

        {/* Search & Mode Controls Bar */}
        <div className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-5 mb-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-4">
            {/* Segmented Mode Tabs */}
            <div
              role="tablist"
              aria-label="Modo de búsqueda"
              className="flex items-center gap-1 p-1 bg-[#090C12] rounded-lg border border-white/10 shrink-0"
            >
              <button
                type="button"
                role="tab"
                aria-selected={searchMode === 'songs'}
                onClick={() => handleModeSwitch('songs')}
                className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  searchMode === 'songs'
                    ? 'neon-btn-primary'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Canciones</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={searchMode === 'artists'}
                onClick={() => handleModeSwitch('artists')}
                className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  searchMode === 'artists'
                    ? 'neon-btn-primary'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Artistas y Discografía</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={searchMode === 'albums'}
                onClick={() => handleModeSwitch('albums')}
                className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  searchMode === 'albums'
                    ? 'neon-btn-primary'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Disc className="w-3.5 h-3.5" />
                <span>Álbumes</span>
              </button>
            </div>

            {/* Search Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeCatalogSearch(query, searchMode);
              }}
              className="flex items-center gap-2 flex-1 max-w-xl"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Buscar canciones, artistas o álbumes"
                  placeholder="Buscar por canción, artista o título de álbum..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#090C12] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[var(--neon-primary)]"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2.5 rounded-lg neon-btn-primary text-xs cursor-pointer whitespace-nowrap shrink-0"
              >
                {isLoading ? 'Consultando...' : 'Buscar Datos'}
              </button>
            </form>
          </div>

          {/* Quick Search Presets + Contextual Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 mr-1">Búsquedas rápidas:</span>
              {QUICK_SEARCH_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setQuery(preset);
                    executeCatalogSearch(preset, searchMode);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-mono-tabular transition-colors cursor-pointer whitespace-nowrap ${
                    query.toLowerCase() === preset.toLowerCase()
                      ? 'neon-bg-soft neon-text border border-[var(--neon-primary)]'
                      : 'bg-[#090C12] text-slate-300 border border-white/10 hover:border-white/25'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Contextual Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {availableGenres.length > 1 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <SlidersHorizontal className="w-3.5 h-3.5 neon-text" />
                  <label htmlFor="genre-filter" className="text-slate-400">
                    Género:
                  </label>
                  <select
                    id="genre-filter"
                    value={selectedGenreFilter}
                    onChange={(e) => setSelectedGenreFilter(e.target.value)}
                    className="px-2.5 py-1 rounded bg-[#090C12] border border-white/10 text-xs text-white"
                  >
                    <option value="all">Todos ({availableGenres.length})</option>
                    {availableGenres.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {searchMode === 'songs' && (
                <button
                  type="button"
                  aria-pressed={onlyWithPreviewFilter}
                  onClick={() => setOnlyWithPreviewFilter((prev) => !prev)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer whitespace-nowrap ${
                    onlyWithPreviewFilter
                      ? 'neon-bg-soft neon-text border border-[var(--neon-primary)]'
                      : 'bg-[#090C12] text-slate-300 border border-white/10 hover:border-white/25'
                  }`}
                >
                  Solo con preview disponible
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Compact Persistent Audio Preview Player (when a preview is active) */}
        {playingTrack && (
          <div className="bg-[var(--surface-card)] neon-border-active rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => toggleTrackPreview(playingTrack)}
                className="w-9 h-9 rounded-lg neon-btn-primary flex items-center justify-center shrink-0 cursor-pointer"
                aria-label={isPlayingAudio ? 'Pausar preview' : 'Reproducir preview'}
              >
                {isPlayingAudio ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  Vista previa: {playingTrack.artist} — {playingTrack.title}
                </div>
                <div className="text-xs text-slate-400 truncate font-mono-tabular">
                  {playingTrack.album} ({playingTrack.year})
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto sm:min-w-[260px]">
              <span className="text-xs font-mono-tabular text-slate-300 shrink-0">
                {formatSeconds(previewCurrentTime)}
              </span>
              <div className="flex-1 h-1.5 bg-[#090C12] rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-[var(--neon-primary)] transition-all duration-150"
                  style={{
                    width:
                      previewDuration > 0
                        ? `${Math.min(
                            100,
                            (previewCurrentTime / previewDuration) * 100
                          )}%`
                        : '0%',
                  }}
                />
              </div>
              <span className="text-xs font-mono-tabular text-slate-400 shrink-0">
                {previewDuration > 0
                  ? formatSeconds(previewDuration)
                  : '--:--'}
              </span>
              <button
                type="button"
                onClick={stopPreview}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                aria-label="Cerrar reproductor de vista previa"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200"
          >
            {errorMessage}
          </div>
        )}

        {/* Lyrics Inspector Panel */}
        {inspectedLyricsTrack && (
          <div className="bg-[var(--surface-card)] neon-border-active rounded-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded overflow-hidden shrink-0 border border-white/10 bg-black">
                  <CoverArtVisual
                    src={inspectedLyricsTrack.coverUrl}
                    alt={inspectedLyricsTrack.album}
                  />
                </div>
                <div>
                  <div className="text-xs font-mono-tabular neon-text">
                    VISOR DE LETRA (FRAME USLT)
                  </div>
                  <h2 className="text-base font-bold text-white">
                    {inspectedLyricsTrack.artist} — {inspectedLyricsTrack.title}
                  </h2>
                  <div className="text-xs text-slate-400 font-mono-tabular">
                    {inspectedLyricsTrack.album} · {inspectedLyricsTrack.year}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    handleTransferToEditor({
                      ...inspectedLyricsTrack,
                      lyrics: inspectedLyricsText,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg neon-btn-primary text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <span>Usar en el Editor MP3</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setInspectedLyricsTrack(null)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-200 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cerrar</span>
                </button>
              </div>
            </div>

            {isLoadingLyrics ? (
              <div className="py-6 text-center text-xs text-slate-400 font-mono-tabular">
                Recuperando transcripción de letra (USLT)...
              </div>
            ) : (
              <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200 leading-relaxed max-h-64 overflow-y-auto p-4 rounded-lg bg-[#090C12] border border-white/10">
                {inspectedLyricsText}
              </pre>
            )}
          </div>
        )}

        {/* Selected Album Tracklist Inspector Panel */}
        {selectedAlbumDetail && (
          <div className="bg-[var(--surface-card)] neon-border-active rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b border-white/10">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="w-28 h-28 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black">
                  <CoverArtVisual
                    src={selectedAlbumDetail.coverUrl}
                    alt={selectedAlbumDetail.album}
                    title={selectedAlbumDetail.album}
                    artist={selectedAlbumDetail.artist}
                  />
                </div>
                <div>
                  <div className="text-xs font-mono-tabular neon-text mb-1">
                    INSPECTOR DE ÁLBUM Y METADATOS DE PISTAS
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {selectedAlbumDetail.album}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-mono-tabular mb-2">
                    <span className="font-semibold text-white">
                      {selectedAlbumDetail.artist}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      Lanzamiento:{' '}
                      {selectedAlbumDetail.releaseDate || selectedAlbumDetail.year}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedAlbumDetail.trackCount} pistas</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedAlbumDetail.genre}</span>
                  </div>
                  {selectedAlbumDetail.copyright && (
                    <p className="text-xs text-slate-400">
                      Sello / Copyright: {selectedAlbumDetail.copyright}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAlbumDetail(null)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cerrar ficha de álbum</span>
              </button>
            </div>

            <div className="pt-5">
              <h3 className="text-xs font-mono-tabular text-slate-400 mb-3">
                LISTADO DE PISTAS Y METADATOS TÉCNICOS
              </h3>

              {isLoadingAlbumTracks ? (
                <div className="py-8 text-center text-xs text-slate-400 font-mono-tabular">
                  Cargando lista de pistas del álbum...
                </div>
              ) : albumTracks.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No se encontraron pistas desglosadas para esta edición.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-xs text-slate-400 font-mono-tabular">
                        <th className="py-2 px-3">Pista</th>
                        <th className="py-2 px-3">Título (TIT2)</th>
                        <th className="py-2 px-3">Artista (TPE1)</th>
                        <th className="py-2 px-3">Género (TCON)</th>
                        <th className="py-2 px-3 text-right">Duración</th>
                        <th className="py-2 px-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {albumTracks.map((trk) => (
                        <tr key={trk.trackId} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3 font-mono-tabular text-slate-400">
                            {trk.trackNumber}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-white">
                            {trk.title}
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">{trk.artist}</td>
                          <td className="py-2.5 px-3 text-slate-400">{trk.genre}</td>
                          <td className="py-2.5 px-3 font-mono-tabular text-slate-300 text-right">
                            {formatDurationMs(trk.durationMs)}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleInspectTrackLyrics(trk)}
                                className="px-2 py-1 rounded bg-[#090C12] border border-white/10 hover:border-[var(--neon-primary)] text-xs text-slate-300 inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                              >
                                <FileText className="w-3 h-3 neon-text" />
                                <span>Letra</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleTransferToEditor(trk)}
                                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs neon-text font-medium inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                              >
                                <span>Usar en Editor</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Display Grid by Mode */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-44 rounded-xl bg-[var(--surface-card)] border border-white/5 animate-pulse p-5"
              />
            ))}
          </div>
        ) : searchMode === 'songs' ? (
          filteredSongs.length === 0 ? (
            <div className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-10 text-center">
              <p className="text-sm font-medium text-white mb-1">
                No se encontraron canciones con los filtros actuales para &quot;{query}&quot;
              </p>
              <p className="text-xs text-slate-400">
                Prueba desactivando los filtros contextuales o busca otro término.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSongs.map((track) => {
                const isPlaying =
                  playingTrack?.trackId === track.trackId && isPlayingAudio;
                const hasPreviewError = previewErrorId === track.trackId;
                return (
                  <div
                    key={track.trackId}
                    className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-5 flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black">
                        <CoverArtVisual
                          src={track.coverUrl}
                          alt={track.album}
                          title={track.title}
                          artist={track.artist}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-sm font-semibold text-white truncate">
                          {track.title}
                        </h2>
                        <p className="text-xs neon-text font-medium truncate mt-0.5">
                          {track.artist}
                        </p>
                        <p className="text-xs text-slate-300 truncate mt-1">
                          Álbum: {track.album}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400 font-mono-tabular mt-2">
                          <span>Año {track.year}</span>
                          <span aria-hidden="true">·</span>
                          <span>Pista {track.trackNumber}</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatDurationMs(track.durationMs)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <div className="text-xs text-slate-400 truncate">
                        <span>{track.genre}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {track.previewUrl && !hasPreviewError ? (
                          <button
                            type="button"
                            onClick={() => toggleTrackPreview(track)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#090C12] border border-white/10 hover:border-[var(--neon-primary)] text-xs text-slate-200 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                            title="Reproducir vista previa disponible"
                          >
                            {isPlaying ? (
                              <Pause className="w-3.5 h-3.5 neon-text" />
                            ) : (
                              <Play className="w-3.5 h-3.5 neon-text" />
                            )}
                            <span>{isPlaying ? 'Pausa' : 'Preview'}</span>
                          </button>
                        ) : (
                          <span
                            className="px-2 py-1.5 rounded-lg bg-[#090C12] border border-white/5 text-xs text-slate-500 flex items-center gap-1 whitespace-nowrap"
                            title="Esta edición no incluye vista previa de audio en la fuente"
                          >
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Sin preview</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleInspectTrackLyrics(track)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#090C12] border border-white/10 hover:border-[var(--neon-primary)] text-xs text-slate-200 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                        >
                          <FileText className="w-3.5 h-3.5 neon-text" />
                          <span>Letra</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTransferToEditor(track)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium text-white flex items-center gap-1 cursor-pointer whitespace-nowrap"
                        >
                          <span>Usar en Editor</span>
                          <ArrowUpRight className="w-3.5 h-3.5 neon-text" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : searchMode === 'artists' ? (
          <div className="space-y-6">
            {filteredArtists.length === 0 ? (
              <div className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-8 text-center text-sm text-slate-400">
                No se encontraron perfiles de artista para &quot;{query}&quot;.
              </div>
            ) : (
              filteredArtists.map((art) => (
                <div
                  key={art.artistId}
                  className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-white/10">
                    <div>
                      <h2 className="text-xl font-bold text-white">{art.artist}</h2>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-tabular mt-1">
                        <span>Género principal: {art.primaryGenre}</span>
                        <span aria-hidden="true">·</span>
                        <span>{art.topAlbums.length} álbumes indexados</span>
                      </div>
                    </div>
                  </div>

                  {/* Artist's Albums Grid */}
                  <div className="mb-6">
                    <h3 className="text-xs font-mono-tabular text-slate-400 mb-3">
                      ÁLBUMES Y DISCOGRAFÍA DEL ARTISTA
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {art.topAlbums.map((alb) => (
                        <div
                          key={alb.collectionId}
                          className="p-3.5 rounded-lg bg-[#090C12] border border-white/10 hover:border-[var(--neon-primary)] transition-colors flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-14 h-14 rounded overflow-hidden shrink-0 bg-black">
                              <CoverArtVisual
                                src={alb.coverUrl}
                                alt={alb.album}
                                title={alb.album}
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-white truncate">
                                {alb.album}
                              </div>
                              <div className="text-xs text-slate-400 font-mono-tabular mt-0.5">
                                {alb.year} · {alb.trackCount} pistas
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenAlbumInspector(alb)}
                            className="px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/15 text-xs neon-text font-medium shrink-0 cursor-pointer whitespace-nowrap"
                          >
                            Ver pistas
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Artist's Top Tracks */}
                  {art.topTracks.length > 0 && (
                    <div>
                      <h3 className="text-xs font-mono-tabular text-slate-400 mb-3">
                        CANCIONES DESTACADAS Y METADATOS ID3
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {art.topTracks.map((t) => (
                          <div
                            key={t.trackId}
                            className="px-3.5 py-2.5 rounded-lg bg-[#090C12] border border-white/5 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="min-w-0">
                              <span className="font-medium text-white">{t.title}</span>
                              <span className="text-slate-400"> · {t.album}</span>
                              <span className="text-slate-500 font-mono-tabular">
                                {' '}
                                ({t.year}, Pista {t.trackNumber})
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleInspectTrackLyrics(t)}
                                className="text-xs text-slate-300 hover:text-white cursor-pointer whitespace-nowrap"
                              >
                                Letra
                              </button>
                              <button
                                type="button"
                                onClick={() => handleTransferToEditor(t)}
                                className="text-xs neon-text hover:underline cursor-pointer whitespace-nowrap"
                              >
                                Usar en Editor
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : filteredAlbums.length === 0 ? (
          <div className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-8 text-center text-sm text-slate-400">
            No se encontraron álbumes para &quot;{query}&quot;.
          </div>
        ) : (
          /* Albums Grid Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAlbums.map((alb) => (
              <div
                key={alb.collectionId}
                className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black">
                    <CoverArtVisual
                      src={alb.coverUrl}
                      alt={alb.album}
                      title={alb.album}
                      artist={alb.artist}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold text-white truncate">
                      {alb.album}
                    </h2>
                    <p className="text-xs neon-text font-medium truncate mt-0.5">
                      {alb.artist}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400 font-mono-tabular mt-2">
                      <span>Lanzamiento {alb.releaseDate || alb.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{alb.trackCount} pistas</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 truncate">
                      {alb.genre} · {alb.country || 'Global'}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500 font-mono-tabular truncate">
                    {alb.copyright || `Catálogo #${alb.collectionId}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenAlbumInspector(alb)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium text-white flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <ListMusic className="w-3.5 h-3.5 neon-text" />
                    <span>Inspeccionar Álbum</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
