import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Disc3,
  FileAudio,
  Search,
  Sparkles,
  FileText,
  Image,
  Download,
  Sliders,
} from 'lucide-react';
import { MetaPulseLogo } from '../components/MetaPulseLogo';

const revealTransition = {
  duration: 0.42,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const HomePage: React.FC = () => {
  return (
    <div>
      {/* 1. Hero Principal con Ambiente Visual de Estudio */}
      <section className="relative py-16 lg:py-22 border-b border-white/10 overflow-hidden">
        {/* Ambient Studio SVG Backdrop (Static-friendly & Reduced-Motion Safe) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-25"
        >
          <svg
            viewBox="0 0 1440 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full object-cover"
          >
            <circle
              cx="1180"
              cy="260"
              r="260"
              stroke="var(--neon-primary)"
              strokeWidth="1.2"
              strokeDasharray="8 8"
            />
            <circle
              cx="1180"
              cy="260"
              r="190"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
            <circle
              cx="1180"
              cy="260"
              r="120"
              stroke="var(--neon-primary)"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <path
              d="M0 420 Q 360 340, 720 420 T 1440 390"
              stroke="var(--neon-primary)"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-canvas)] via-transparent to-[var(--surface-canvas)]" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={revealTransition}
            className="max-w-3xl mb-12"
          >
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono-tabular neon-text mb-4">
              <MetaPulseLogo className="w-5 h-5" />
              <span>METAPULSE AUDIO LAB</span>
              <span aria-hidden="true">·</span>
              <span>ESTÁNDAR ID3v2.3 + USLT + APIC</span>
            </div>

            <h1
              className="font-display font-bold tracking-tight text-white balance-text mb-6"
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3.75rem)',
                lineHeight: 1.08,
              }}
            >
              Completa etiquetas, carátulas y letras de tus archivos MP3 en un entorno dedicado
            </h1>

            <p className="text-base text-slate-300 leading-relaxed max-w-[66ch] mb-8">
              MetaPulse separa la edición binaria de archivos MP3 y la consulta
              discográfica en herramientas enfocadas. Carga un archivo como{' '}
              <span className="text-white font-mono-tabular">
                &quot;REM - Losing My Religion.mp3&quot;
              </span>
              , recupera sus metadatos desde catálogos en línea y descárgalo con su
              nueva cabecera ID3v2.3 sin recodificar el audio.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Link
                to="/editor"
                className="px-6 py-3.5 rounded-lg neon-btn-primary text-sm flex items-center gap-2 whitespace-nowrap"
              >
                <span>Ir al Editor MP3</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/search"
                className="px-5 py-3.5 rounded-lg bg-[var(--surface-card)] border border-white/15 hover:border-[var(--neon-primary)] text-sm font-medium text-slate-200 transition-colors whitespace-nowrap"
              >
                Abrir Buscador Musical
              </Link>

              <Link
                to="/about"
                className="px-4 py-3.5 text-sm font-medium text-slate-300 hover:text-white underline-offset-4 hover:underline whitespace-nowrap"
              >
                Conocer cómo funciona
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 font-mono-tabular">
              <span>Lectura ID3v2.3 / ID3v2.4 / ID3v1</span>
              <span aria-hidden="true">·</span>
              <span>Escritura ID3v2.3 UTF-16LE</span>
              <span aria-hidden="true">·</span>
              <span>4 Temas Cyberpunk Neón</span>
            </div>
          </motion.div>

          {/* 2. Demostración Visual Compacta del Flujo */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...revealTransition, delay: 0.08 }}
            className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6 lg:p-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 mb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-mono-tabular neon-text block">
                  VISTA RÁPIDA DE TRANSFORMACIÓN DE METADATOS
                </span>
                <h2 className="text-lg font-semibold text-white mt-0.5">
                  De un archivo MP3 con solo nombre a un contenedor etiquetado
                </h2>
              </div>
              <Link
                to="/editor"
                className="text-xs font-medium neon-text hover:underline flex items-center gap-1 whitespace-nowrap"
              >
                <span>Probar con un archivo en el Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              <div className="p-5 rounded-lg bg-[#090C12] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono-tabular text-slate-400 mb-2">
                    ENTRADA · ARCHIVO LOCAL
                  </div>
                  <div className="text-sm font-mono-tabular font-semibold text-white mb-2">
                    REM - Losing My Religion.mp3
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Archivo MP3 válido sin etiquetas internas o con campos
                    incompletos.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/5 text-xs font-mono-tabular text-slate-500">
                  Cabecera previa: 0 bytes ID3
                </div>
              </div>

              <div className="p-5 rounded-lg bg-[#090C12] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono-tabular neon-text mb-2">
                    PROCESO · BÚSQUEDA Y REVISIÓN
                  </div>
                  <div className="text-sm font-semibold text-white mb-2">
                    Identificación por nombre o consulta manual
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Recupera candidatos desde catálogos en línea y permite editar
                    cualquier etiqueta antes de escribir en el archivo.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/5 text-xs font-mono-tabular text-slate-300">
                  R.E.M. · Out of Time · 1991 · Pista 4/11
                </div>
              </div>

              <div className="p-5 rounded-lg bg-[#090C12] border border-[var(--neon-border)] flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono-tabular neon-text mb-2">
                    SALIDA · DESCARGA DIRECTA
                  </div>
                  <div className="text-sm font-semibold text-white mb-2">
                    Cabecera binaria ID3v2.3 inyectada
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Incluye tramas de texto UTF-16LE, letra en trama USLT y
                    carátula frontal APIC sin alterar los frames de audio MPEG.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/5 text-xs font-mono-tabular neon-text">
                  TIT2 · TPE1 · TALB · TYER · USLT · APIC
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Características Principales */}
      <section className="py-16 border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={revealTransition}
            className="mb-10"
          >
            <p className="text-xs font-mono-tabular neon-text tracking-wider mb-2">
              CAPACIDADES DE LA PLATAFORMA
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white balance-text">
              Herramientas especializadas para edición de etiquetas y consulta musical
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Sliders,
                title: 'Edición ID3v2.3 en el navegador',
                desc: 'Modifica título (TIT2), artista (TPE1), álbum (TALB), año (TYER), pista (TRCK), género (TCON), compositor (TCOM) y sello (TPUB).',
              },
              {
                icon: Image,
                title: 'Carátulas APIC y Letras USLT',
                desc: 'Incrusta portadas de álbumes o imágenes personalizadas junto con la transcripción de la letra en la trama estándar USLT.',
              },
              {
                icon: Search,
                title: 'Buscador de canciones, artistas y álbumes',
                desc: 'Consulta discografías, años de publicación y listados de pistas en una vista dedicada y envía metadatos al editor con un clic.',
              },
              {
                icon: Disc3,
                title: 'Vistas previas cuando están disponibles',
                desc: 'Escucha fragmentos de referencia entregados por el catálogo cuando la fuente lo permite, o consulta la ficha técnica completa.',
              },
            ].map((feat, idx) => {
              const IconComponent = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ ...revealTransition, delay: idx * 0.06 }}
                  className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <IconComponent className="w-5 h-5 neon-text mb-4" />
                    <h3 className="text-base font-semibold text-white mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Cómo Funciona */}
      <section className="py-16 border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={revealTransition}
            className="mb-10"
          >
            <p className="text-xs font-mono-tabular neon-text tracking-wider mb-2">
              FLUJO DE TRABAJO PASO A PASO
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white balance-text">
              Cómo funciona el proceso en tres pasos
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01. Selección del archivo MP3',
                icon: FileAudio,
                body: 'Sube un archivo .mp3 desde tu dispositivo o utiliza uno de los contenedores de prueba incluidos en el Editor para explorar el flujo.',
              },
              {
                step: '02. Búsqueda y revisión de etiquetas',
                icon: Sparkles,
                body: 'Compara las coincidencias sugeridas por nombre de archivo, transfiere datos desde el Buscador Musical o ajusta cualquier campo manualmente.',
              },
              {
                step: '03. Inyección binaria y descarga',
                icon: Download,
                body: 'Verifica las tramas ID3v2.3 generadas y descarga el nuevo archivo .mp3 con sus metadatos, portada y letra incrustados.',
              },
            ].map((item, idx) => {
              const StepIcon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ ...revealTransition, delay: idx * 0.08 }}
                  className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-white">
                      {item.step}
                    </h3>
                    <StepIcon className="w-4 h-4 neon-text shrink-0" />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Llamada a la Acción Final */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="bg-[var(--surface-card)] neon-border-active rounded-xl p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-mono-tabular neon-text mb-2">
                ACCESO DIRECTO A LAS HERRAMIENTAS
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Elige tu entorno de trabajo en MetaPulse
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Accede al Editor MP3 para modificar y descargar archivos etiquetados,
                o abre el Buscador Musical para consultar información de canciones,
                artistas y álbumes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/editor"
                className="px-5 py-3 rounded-lg neon-btn-primary text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap"
              >
                <span>Abrir Editor MP3</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/search"
                className="px-5 py-3 rounded-lg bg-[#090C12] border border-white/15 hover:border-[var(--neon-primary)] text-xs sm:text-sm font-medium text-white transition-colors whitespace-nowrap"
              >
                Ir al Buscador Musical
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
