import React, { useState, useEffect, useRef } from 'react';
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
  duration: 0.42,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const CatalogExplorer: React.FC<CatalogExplorerProps> = ({
  onSendTrackToEditor,
}) => {
  const [searchMode, setSearchMode] = useState<SearchMode>('songs');
  const [query, setQuery] = useState<string>('R.E.M.');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [songResults, setSongResults] = useState<CatalogTrackResult[]>([]);
  const [artistResults, setArtistResults] = useState<CatalogArtistResult[]>([]);
  const [albumResults, setAlbumResults] = useState<CatalogAlbumResult[]>([]);

  // Detailed Album Tracklist Drawer State
  const [selectedAlbumDetail, setSelectedAlbumDetail] =
    useState<CatalogAlbumResult | null>(null);
  const [albumTracks, setAlbumTracks] = useState<CatalogTrackResult[]>([]);
  const [isLoadingAlbumTracks, setIsLoadingAlbumTracks] = useState<boolean>(false);

  // Lyrics Inspector State in Catalog Explorer
  const [inspectedLyricsTrack, setInspectedLyricsTrack] =
    useState<CatalogTrackResult | null>(null);
  const [inspectedLyricsText, setInspectedLyricsText] = useState<string>('');
  const [isLoadingLyrics, setIsLoadingLyrics] = useState<boolean>(false);

  // Audio preview state (30s stream only, no audio download)
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    executeCatalogSearch('R.E.M.', 'songs');
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const stopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingTrackId(null);
  };

  const toggleTrackPreview = (track: CatalogTrackResult) => {
    if (!track.previewUrl) return;
    if (playingTrackId === track.trackId) {
      stopPreview();
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(track.previewUrl);
      audioRef.current.onended = () => setPlayingTrackId(null);
    } else {
      audioRef.current.pause();
      audioRef.current.src = track.previewUrl;
    }

    audioRef.current.play().catch(() => setPlayingTrackId(null));
    setPlayingTrackId(track.trackId);
  };

  const executeCatalogSearch = async (
    searchTerm: string,
    mode: SearchMode = searchMode
  ) => {
    const clean = searchTerm.trim();
    if (!clean) return;
    stopPreview();
    setIsLoading(true);

    try {
      if (mode === 'songs') {
        const tracks = await searchTracksOnline(clean, 12);
        setSongResults(tracks);
      } else if (mode === 'artists') {
        const artists = await searchArtistProfileOnline(clean);
        setArtistResults(artists);
      } else if (mode === 'albums') {
        const albums = await searchAlbumsOnline(clean, 12);
        setAlbumResults(albums);
      }
    } finally {
      setIsLoading(false);
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
    const text = track.lyrics
      ? track.lyrics
      : await fetchTrackLyricsOnline(track.artist, track.title);
    setInspectedLyricsText(text);
    setIsLoadingLyrics(false);
  };

  return (
    <section id="explorador-musical" className="py-16 border-b border-white/10">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={revealTransition}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8"
        >
          <div>
            <p className="text-xs font-mono-tabular neon-text tracking-wider mb-2">
              02. BUSCADOR DE METADATOS DE CANCIONES, ARTISTAS Y ÁLBUMES
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white balance-text">
              Consulta fichas técnicas, letras USLT, discografías y numeración de pistas
            </h2>
          </div>

          <p className="text-xs text-slate-400 max-w-md">
            Modo de consulta e inspección de metadatos musicales. Explora datos de
            artistas, letras y álbumes o envía sus etiquetas ID3 al editor superior.
          </p>
        </motion.div>

        {/* Search & Mode Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ ...revealTransition, delay: 0.05 }}
          className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-5 mb-8"
        >
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-4">
            {/* Segmented Mode Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#090C12] rounded-lg border border-white/10 shrink-0">
              <button
                type="button"
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

          {/* Quick Search Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/10">
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
        </motion.div>

        {/* Lyrics Inspector Panel (when user clicks "Letra" on any song) */}
        {inspectedLyricsTrack && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={revealTransition}
            className="bg-[var(--surface-card)] neon-border-active rounded-xl p-6 mb-8"
          >
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
                    VISOR DE LETRA EMBEBIDA (FRAME USLT)
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {inspectedLyricsTrack.artist} — {inspectedLyricsTrack.title}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono-tabular">
                    {inspectedLyricsTrack.album} · {inspectedLyricsTrack.year}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onSendTrackToEditor({
                      ...inspectedLyricsTrack,
                      lyrics: inspectedLyricsText,
                    });
                    document
                      .getElementById('estudio-mp3')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-lg neon-btn-primary text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <span>Enviar letra y etiquetas al Editor</span>
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
          </motion.div>
        )}

        {/* Selected Album Tracklist Inspector Panel */}
        {selectedAlbumDetail && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={revealTransition}
            className="bg-[var(--surface-card)] neon-border-active rounded-xl p-6 mb-8"
          >
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
                  <h3 className="text-xl font-bold text-white mb-1">
                    {selectedAlbumDetail.album}
                  </h3>
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
                    {selectedAlbumDetail.country && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>País: {selectedAlbumDetail.country}</span>
                      </>
                    )}
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
              <h4 className="text-xs font-mono-tabular text-slate-400 mb-3">
                LISTADO DE PISTAS Y METADATOS TÉCNICOS (SOLO CONSULTA)
              </h4>

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
                      <tr className="border-b border-white/10 text-[11px] text-slate-400 font-mono-tabular">
                        <th className="py-2 px-3">Pista</th>
                        <th className="py-2 px-3">Título (TIT2)</th>
                        <th className="py-2 px-3">Artista (TPE1)</th>
                        <th className="py-2 px-3">Género (TCON)</th>
                        <th className="py-2 px-3 text-right">Duración</th>
                        <th className="py-2 px-3 text-right">Acciones de Metadatos</th>
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
                                className="px-2 py-1 rounded bg-[#090C12] border border-white/10 hover:border-[var(--neon-primary)] text-[11px] text-slate-300 inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                              >
                                <FileText className="w-3 h-3 neon-text" />
                                <span>Letra</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onSendTrackToEditor(trk);
                                  document
                                    .getElementById('estudio-mp3')
                                    ?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] neon-text font-medium inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
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
          </motion.div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {songResults.map((track, idx) => {
              const isPlaying = playingTrackId === track.trackId;
              return (
                <motion.div
                  key={track.trackId}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{
                    ...revealTransition,
                    delay: Math.min(idx * 0.04, 0.2),
                  }}
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
                      <h3 className="text-sm font-semibold text-white truncate">
                        {track.title}
                      </h3>
                      <p className="text-xs neon-text font-medium truncate mt-0.5">
                        {track.artist}
                      </p>
                      <p className="text-xs text-slate-300 truncate mt-1">
                        Álbum: {track.album}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400 font-mono-tabular mt-2">
                        <span>Año {track.year}</span>
                        <span aria-hidden="true">·</span>
                        <span>Pista {track.trackNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatDurationMs(track.durationMs)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-400 truncate">
                      <span>{track.genre}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {track.previewUrl && (
                        <button
                          type="button"
                          onClick={() => toggleTrackPreview(track)}
                          className="px-2 py-1.5 rounded-lg bg-[#090C12] border border-white/10 hover:border-[var(--neon-primary)] text-xs text-slate-200 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                          title="Escuchar muestra de referencia de 30s"
                        >
                          {isPlaying ? (
                            <Pause className="w-3.5 h-3.5 neon-text" />
                          ) : (
                            <Play className="w-3.5 h-3.5 neon-text" />
                          )}
                          <span>30s</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleInspectTrackLyrics(track)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#090C12] border border-white/10 hover:border-[var(--neon-primary)] text-xs text-slate-200 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                        title="Consultar letra de la canción (USLT)"
                      >
                        <FileText className="w-3.5 h-3.5 neon-text" />
                        <span>Letra</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSendTrackToEditor(track);
                          document
                            .getElementById('estudio-mp3')
                            ?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium text-white flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <span>Cargar etiquetas</span>
                        <ArrowUpRight className="w-3.5 h-3.5 neon-text" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : searchMode === 'artists' ? (
          <div className="space-y-6">
            {artistResults.length === 0 ? (
              <div className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-8 text-center text-sm text-slate-400">
                No se encontraron perfiles de artista para esta búsqueda.
              </div>
            ) : (
              artistResults.map((art, idx) => (
                <motion.div
                  key={art.artistId}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{
                    ...revealTransition,
                    delay: Math.min(idx * 0.06, 0.18),
                  }}
                  className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-white/10">
                    <div>
                      <h3 className="text-xl font-bold text-white">{art.artist}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-tabular mt-1">
                        <span>Género principal: {art.primaryGenre}</span>
                        <span aria-hidden="true">·</span>
                        <span>{art.topAlbums.length} álbumes indexados</span>
                        <span aria-hidden="true">·</span>
                        <span>Artista ID {art.artistId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Artist's Albums Grid */}
                  <div className="mb-6">
                    <h4 className="text-xs font-mono-tabular text-slate-400 mb-3">
                      ÁLBUMES Y DISCOGRAFÍA DEL ARTISTA (HAZ CLIC PARA VER TRACKLIST)
                    </h4>
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
                              <div className="text-[11px] text-slate-400 font-mono-tabular mt-0.5">
                                {alb.year} · {alb.trackCount} pistas · {alb.genre}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenAlbumInspector(alb)}
                            className="px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/15 text-[11px] neon-text font-medium shrink-0 cursor-pointer whitespace-nowrap"
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
                      <h4 className="text-xs font-mono-tabular text-slate-400 mb-3">
                        CANCIONES DESTACADAS Y METADATOS ID3 + LETRA
                      </h4>
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
                                className="text-[11px] text-slate-300 hover:text-white cursor-pointer whitespace-nowrap"
                              >
                                Letra
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onSendTrackToEditor(t);
                                  document
                                    .getElementById('estudio-mp3')
                                    ?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="text-[11px] neon-text hover:underline cursor-pointer whitespace-nowrap"
                              >
                                Enviar al editor
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        ) : (
          /* Albums Grid Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {albumResults.map((alb, idx) => (
              <motion.div
                key={alb.collectionId}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{
                  ...revealTransition,
                  delay: Math.min(idx * 0.04, 0.2),
                }}
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
                    <h3 className="text-sm font-semibold text-white truncate">
                      {alb.album}
                    </h3>
                    <p className="text-xs neon-text font-medium truncate mt-0.5">
                      {alb.artist}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400 font-mono-tabular mt-2">
                      <span>Lanzamiento {alb.releaseDate || alb.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{alb.trackCount} pistas</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 truncate">
                      {alb.genre} · {alb.country || 'Global'}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 font-mono-tabular truncate">
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
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
