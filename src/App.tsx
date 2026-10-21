import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Disc3,
  ArrowDownRight,
  Cpu,
  FileCheck2,
  Palette,
} from 'lucide-react';
import { CatalogTrackResult, NeonTheme } from './types/music';
import { Mp3TaggerStudio } from './components/Mp3TaggerStudio';
import { CatalogExplorer } from './components/CatalogExplorer';

const NEON_THEMES: Array<{
  id: NeonTheme;
  label: string;
  hex: string;
  code: string;
}> = [
  { id: 'green', label: 'Verde Neón', hex: '#00FF66', code: '520nm' },
  { id: 'red', label: 'Rojo Carmesí', hex: '#FF2A54', code: '645nm' },
  { id: 'blue', label: 'Azul Cian', hex: '#00D4FF', code: '485nm' },
  { id: 'purple', label: 'Morado Cyber', hex: '#B855FF', code: '415nm' },
];

const revealTransition = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1] as const,
};

export default function App() {
  const [activeTheme, setActiveTheme] = useState<NeonTheme>('green');
  const [selectedCatalogTrack, setSelectedCatalogTrack] =
    useState<CatalogTrackResult | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-neon-theme', activeTheme);
  }, [activeTheme]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      data-neon-theme={activeTheme}
      className="min-h-screen bg-[var(--surface-canvas)] text-[#F1F5F9] cyber-grid-bg transition-colors duration-200"
    >
      {/* Top Bar Contract: Strictly 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#080B10]/85 border-b border-white/10">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#inicio"
            className="text-xl font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0"
          >
            MetaPulse
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a
              href="#estudio-mp3"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Estudio MP3
            </a>
            <a
              href="#explorador-musical"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Buscador Musical
            </a>
            <a
              href="#arquitectura-id3"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Arquitectura ID3
            </a>
            <a
              href="#casos-de-uso"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Casos de Uso
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('estudio-mp3')}
              className="px-4 py-2 text-xs font-semibold rounded-lg neon-btn-primary whitespace-nowrap shrink-0 cursor-pointer"
            >
              Cargar Archivo MP3
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="inicio">
        {/* Workspace Theme Switcher Toolbar (Below Header per Top Bar Contract) */}
        <div className="border-b border-white/10 bg-[#0B0F17]/90">
          <div className="max-w-[1280px] mx-auto px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Palette className="w-4 h-4 neon-text shrink-0" />
              <span className="font-medium">
                Tema Cyberpunk Global (afecta toda la web y el estudio de metadatos):
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-[#07090E] border border-white/10">
              {NEON_THEMES.map((themeItem) => {
                const isSelected = activeTheme === themeItem.id;
                return (
                  <button
                    key={themeItem.id}
                    type="button"
                    onClick={() => setActiveTheme(themeItem.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'neon-btn-primary'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: themeItem.hex }}
                      aria-hidden="true"
                    />
                    <span>{themeItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hero Section: 2-Column Split + Full-Width KPI Strip Below */}
        <section className="py-16 lg:py-20 border-b border-white/10">
          <div className="max-w-[1280px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={revealTransition}
              className="max-w-4xl mb-12"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular neon-text mb-4">
                <span>MOTOR DE RECONOCIMIENTO Y ETIQUETADO BINARIO MP3</span>
                <span aria-hidden="true">·</span>
                <span>ID3v2.3 + USLT + APIC 600×600</span>
              </div>

              <h1
                className="font-display font-bold tracking-tight text-white balance-text mb-6"
                style={{
                  fontSize: 'clamp(2.25rem, 4vw, 3.75rem)',
                  lineHeight: 1.08,
                }}
              >
                Transforma archivos MP3 sin etiquetas en colecciones completas con letra y carátula oficial
              </h1>

              <p className="text-base text-slate-300 leading-relaxed max-w-[68ch] mb-8">
                Carga cualquier pista desde tu ordenador o analiza un archivo sin
                metadatos como{' '}
                <span className="text-white font-mono-tabular">
                  &quot;REM - Losing My Religion.mp3&quot;
                </span>
                . El sistema consulta catálogos globales en tiempo real, recupera el
                álbum, año, número de pista, la letra completa del tema (trama USLT) y
                portada en alta resolución, y empaqueta el nuevo archivo MP3 listo para
                descargar.
              </p>

              <div className="pt-2">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => scrollToSection('estudio-mp3')}
                    className="px-6 py-3.5 rounded-lg neon-btn-primary text-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <span>Abrir Estudio de Metadatos MP3</span>
                    <ArrowDownRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection('explorador-musical')}
                    className="px-5 py-3.5 rounded-lg bg-[var(--surface-card)] border border-white/15 hover:border-[var(--neon-primary)] text-sm font-medium text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Explorar Artistas, Álbumes y Letras
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 font-mono-tabular">
                  <span>Procesamiento 100% en navegador</span>
                  <span aria-hidden="true">·</span>
                  <span>Codificación Unicode UTF-16LE</span>
                  <span aria-hidden="true">·</span>
                  <span>Incrustación de letras USLT</span>
                </div>
              </div>
            </motion.div>

            {/* Full-Width 4-Column Technical Specification Strip Below Hero Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-white/10">
              {[
                {
                  metric: 'ID3v2.3 + USLT',
                  accent: false,
                  desc: 'Inyección binaria directa en tramas TIT2, TPE1, TALB, TYER, TRCK, USLT (letras) y APIC',
                },
                {
                  metric: '600 × 600 px',
                  accent: true,
                  desc: 'Descarga e incrustación automática de carátulas oficiales en alta resolución',
                },
                {
                  metric: '4 Temas Neón',
                  accent: false,
                  desc: 'Interfaz adaptable en Verde, Rojo, Azul y Morado en tiempo real',
                },
                {
                  metric: '0% Recodificación',
                  accent: false,
                  desc: 'El flujo de audio MPEG original se conserva intacto byte por byte al exportar',
                },
              ].map((kpi, idx) => (
                <motion.div
                  key={kpi.metric}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...revealTransition, delay: idx * 0.06 }}
                  className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-5"
                >
                  <div
                    className={`text-2xl font-bold font-mono-tabular mb-1 ${
                      kpi.accent ? 'neon-text' : 'text-white'
                    }`}
                  >
                    {kpi.metric}
                  </div>
                  <div className="text-xs text-slate-400">{kpi.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 01: Interactive MP3 Metadata Tagger Studio */}
        <Mp3TaggerStudio
          externalSelectedTrack={selectedCatalogTrack}
          onClearExternalTrack={() => setSelectedCatalogTrack(null)}
        />

        {/* Section 02: Mini Buscador de Canciones, Artistas y Álbumes */}
        <CatalogExplorer
          onSendTrackToEditor={(track) => setSelectedCatalogTrack(track)}
        />

        {/* Section 03: Arquitectura ID3 & Casos de Uso (Asymmetric Bento Grid + Proof) */}
        <section id="arquitectura-id3" className="py-16 border-b border-white/10">
          <div className="max-w-[1280px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={revealTransition}
              className="mb-10"
            >
              <p className="text-xs font-mono-tabular neon-text tracking-wider mb-2">
                03. ARQUITECTURA DE ETIQUETADO Y FLUJO DE TRABAJO
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white balance-text">
                Ingeniería de metadatos diseñada para DJs, coleccionistas y archivos de audio
              </h2>
            </motion.div>

            {/* Asymmetric Bento Grid (col-span-2 alongside col-span-1) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ ...revealTransition, delay: 0.04 }}
                className="lg:col-span-2 bg-[var(--surface-card)] neon-border-subtle rounded-xl p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      01. Reconocimiento heurístico y recuperación de letras (USLT)
                    </h3>
                    <Cpu className="w-5 h-5 neon-text shrink-0" />
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    Cuando descargas o digitalizas grabaciones antiguas cuyos metadatos
                    internos están vacíos, nuestro analizador limpia sufijos como{' '}
                    <span className="font-mono-tabular text-slate-200">
                      [Official Audio]
                    </span>{' '}
                    o numeraciones sueltas, separa el intérprete del título de la pista y
                    consulta catálogos discográficos y bases de letras en vivo para poblar
                    todos los campos automáticamente.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-white/10 text-xs font-mono-tabular">
                  <div>
                    <div className="text-slate-400">Entrada bruta</div>
                    <div className="text-white mt-0.5 truncate">
                      04_REM - Losing My Religion.mp3
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Consulta limpia</div>
                    <div className="neon-text mt-0.5">R.E.M. Losing My Religion</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Resultado inyectado</div>
                    <div className="text-white mt-0.5">Out of Time (1991) + USLT</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ ...revealTransition, delay: 0.12 }}
                className="lg:col-span-1 bg-[var(--surface-card)] neon-border-subtle rounded-xl p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      02. Empaquetado binario UTF-16
                    </h3>
                    <FileCheck2 className="w-5 h-5 neon-text shrink-0" />
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Escribe cabeceras ID3v2.3 con codificación Unicode UTF-16LE con BOM y
                    enteros synchsafe de 28 bits, asegurando que letras de canciones (USLT),
                    tildes, eñes y caracteres especiales se lean correctamente en Rekordbox,
                    Serato, VLC y Apple Music.
                  </p>
                </div>
                <div className="pt-5 mt-6 border-t border-white/10 text-xs text-slate-400 font-mono-tabular">
                  Compatibilidad verificada · Estándar ISO/IEC 11172-3
                </div>
              </motion.div>
            </div>

            {/* Proof of Impact / Case Studies Section */}
            <div id="casos-de-uso" className="pt-4">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={revealTransition}
                className="text-lg font-semibold text-white mb-5"
              >
                03. Casos de uso verificados en catalogación musical
              </motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    kicker: 'COLECCIONES DJ Y CABINAS',
                    title: 'Normalización de bibliotecas locales en segundos',
                    body: 'Archivos MP3 promocionales sin carátula ni año pasan a tener portada 600×600 px, género y numeración de pista exacta para lectura inmediata en pantallas CDJ.',
                    foot: 'Tiempo medio por pista: < 2.5 segundos',
                  },
                  {
                    kicker: 'LETRAS USLT Y CARÁTULAS APIC',
                    title: 'Incrustación de letras completas y portadas',
                    body: 'Permite combinar letras obtenidas automáticamente desde la red en el frame binario USLT con imágenes JPEG o PNG embebidas dentro del archivo MP3.',
                    foot: 'Soporte nativo: USLT UTF-16 + APIC',
                  },
                  {
                    kicker: 'INVESTIGACIÓN DISCOGRÁFICA',
                    title: 'Explorador de discografías sin descargas intrusivas',
                    body: 'El buscador inferior permite consultar años de edición, letras, sellos discográficos, duración por pista y álbumes completos de cualquier artista en modo de lectura técnica.',
                    foot: 'Consulta directa · Catálogo global en vivo',
                  },
                ].map((card, idx) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ ...revealTransition, delay: idx * 0.08 }}
                    className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6"
                  >
                    <div className="text-xs font-mono-tabular neon-text mb-2">
                      {card.kicker}
                    </div>
                    <h4 className="text-base font-semibold text-white mb-2">
                      {card.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {card.body}
                    </p>
                    <div className="text-xs text-slate-400 font-mono-tabular pt-3 border-t border-white/10">
                      {card.foot}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="py-10 bg-[#06080C]">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-white text-base">
              MetaPulse
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">
              Estudio Cyberpunk de Metadatos MP3 e Inspector Discográfico
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <a href="#estudio-mp3" className="hover:text-white transition-colors">
              Estudio MP3
            </a>
            <a href="#explorador-musical" className="hover:text-white transition-colors">
              Buscador Musical
            </a>
            <a href="#arquitectura-id3" className="hover:text-white transition-colors">
              Arquitectura ID3
            </a>
            <span className="font-mono-tabular text-slate-500">
              ID3v2.3 Binary Engine
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
