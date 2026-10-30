import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Disc3,
  FileAudio,
  Search,
  Sparkles,
  Image,
  Download,
  Sliders,
} from 'lucide-react';
import { MetaPulseLogo } from '../components/MetaPulseLogo';
import { useLanguage } from '../i18n/LanguageContext';

const revealTransition = {
  duration: 0.42,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const HomePage: React.FC = () => {
  const { tr } = useLanguage();

  const capabilities = [
    {
      icon: Sliders,
      title: tr(
        'Edición ID3v2.3 en el navegador',
        'In-browser ID3v2.3 Editing',
        'Edição ID3v2.3 no navegador'
      ),
      desc: tr(
        'Modifica título (TIT2), artista (TPE1), álbum (TALB), año (TYER), pista (TRCK), género (TCON), compositor (TCOM) y sello (TPUB).',
        'Modify title (TIT2), artist (TPE1), album (TALB), year (TYER), track (TRCK), genre (TCON), composer (TCOM), and label (TPUB).',
        'Modifique título (TIT2), artista (TPE1), álbum (TALB), ano (TYER), faixa (TRCK), gênero (TCON), compositor (TCOM) e gravadora (TPUB).'
      ),
    },
    {
      icon: Image,
      title: tr(
        'Carátulas APIC y Letras USLT',
        'APIC Cover Art & USLT Lyrics',
        'Capas APIC e Letras USLT'
      ),
      desc: tr(
        'Incrusta portadas de álbumes o imágenes personalizadas junto con la transcripción de la letra en la trama estándar USLT.',
        'Embed album artwork or custom images along with the full lyrics transcription inside the standard USLT frame.',
        'Incorpore capas de álbuns ou imagens personalizadas junto com a transcrição da letra no frame padrão USLT.'
      ),
    },
    {
      icon: Search,
      title: tr(
        'Buscador de canciones, artistas y álbumes',
        'Song, Artist & Album Explorer',
        'Buscador de músicas, artistas e álbuns'
      ),
      desc: tr(
        'Consulta discografías, años de publicación y listados de pistas en una vista dedicada y envía metadatos al editor con un clic.',
        'Explore discographies, release years, and tracklists in a dedicated view and transfer metadata to the editor in one click.',
        'Consulte discografias, anos de lançamento e listas de faixas em uma visualização dedicada e envie metadados ao editor com um clique.'
      ),
    },
    {
      icon: Disc3,
      title: tr(
        'Vistas previas cuando están disponibles',
        'Audio Previews When Available',
        'Prévias de áudio quando disponíveis'
      ),
      desc: tr(
        'Escucha fragmentos de referencia entregados por el catálogo cuando la fuente lo permite, o consulta la ficha técnica completa.',
        'Listen to reference audio clips provided by the catalog when available, or inspect the complete technical datasheet.',
        'Ouça trechos de referência fornecidos pelo catálogo quando disponíveis, ou consulte a ficha técnica completa.'
      ),
    },
  ];

  const steps = [
    {
      step: tr(
        '01. Selección del archivo MP3',
        '01. MP3 File Selection',
        '01. Seleção do arquivo MP3'
      ),
      icon: FileAudio,
      body: tr(
        'Sube un archivo .mp3 desde tu dispositivo o utiliza uno de los contenedores de prueba incluidos en el Editor para explorar el flujo.',
        'Upload a .mp3 file from your device or use one of the built-in untagged sample containers in the Editor to test the workflow.',
        'Envie um arquivo .mp3 do seu dispositivo ou utilize um dos contêineres de teste incluídos no Editor para explorar o fluxo.'
      ),
    },
    {
      step: tr(
        '02. Búsqueda y revisión de etiquetas',
        '02. Tag Lookup & Review',
        '02. Busca e revisão de tags'
      ),
      icon: Sparkles,
      body: tr(
        'Compara las coincidencias sugeridas por nombre de archivo, transfiere datos desde el Buscador Musical o ajusta cualquier campo manualmente.',
        'Compare matches suggested by filename, transfer data from Music Search, or fine-tune any field manually.',
        'Compare as correspondências sugeridas pelo nome do arquivo, transfira dados do Buscador Musical ou ajuste qualquer campo manualmente.'
      ),
    },
    {
      step: tr(
        '03. Inyección binaria y descarga',
        '03. Binary Injection & Download',
        '03. Injeção binária e download'
      ),
      icon: Download,
      body: tr(
        'Verifica las tramas ID3v2.3 generadas y descarga el nuevo archivo .mp3 con sus metadatos, portada y letra incrustados.',
        'Verify the generated ID3v2.3 frames and download the new .mp3 file with its metadata, cover art, and lyrics embedded.',
        'Verifique os frames ID3v2.3 gerados e baixe o novo arquivo .mp3 com seus metadados, capa e letra incorporados.'
      ),
    },
  ];

  return (
    <div>
      {/* 1. Hero Principal Centrado con Fondo Negro, Burbuja Gradiente RGB Arcoíris y Ondas Pulsantes Suaves */}
      <section className="relative bg-black py-24 lg:py-32 border-b border-white/10 overflow-hidden">
        {/* Pure Black Backdrop + Rainbow RGB Morphing Bubble + Soft Pulsing Concentric Waves */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="rgb-hero-bubble" />
          <div className="rgb-hero-bubble-inner" />

          <div className="rgb-pulse-wave" />
          <div className="rgb-pulse-wave rgb-pulse-wave-delay-1" />
          <div className="rgb-pulse-wave rgb-pulse-wave-delay-2" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,#000000_78%)]" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6">
          {/* Centered Hero Titles & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={revealTransition}
            className="max-w-3xl mx-auto text-center flex flex-col items-center mb-16"
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-2.5 text-xs font-mono-tabular neon-text mb-5">
              <MetaPulseLogo className="w-5 h-5" />
              <span>METAPULSE AUDIO LAB</span>
              <span aria-hidden="true">·</span>
              <span>
                {tr(
                  'ESTÁNDAR ID3v2.3 + USLT + APIC',
                  'ID3v2.3 + USLT + APIC STANDARD',
                  'PADRÃO ID3v2.3 + USLT + APIC'
                )}
              </span>
            </div>

            <h1
              className="font-display font-bold tracking-tight text-white balance-text mb-6"
              style={{
                fontSize: 'clamp(2.35rem, 4.5vw, 4rem)',
                lineHeight: 1.08,
              }}
            >
              {tr(
                'Completa etiquetas, carátulas y letras de tus archivos MP3 en un entorno dedicado',
                'Complete tags, cover art, and lyrics for your MP3 files in a dedicated studio',
                'Complete tags, capas e letras dos seus arquivos MP3 em um ambiente dedicado'
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-[62ch] mb-9">
              {tr(
                'MetaPulse separa la edición binaria de archivos MP3 y la consulta discográfica en herramientas enfocadas. Carga un archivo como ',
                'MetaPulse separates binary MP3 tag editing and discography lookup into focused tools. Load a file like ',
                'O MetaPulse separa a edição binária de arquivos MP3 e a consulta discográfica em ferramentas focadas. Carregue um arquivo como '
              )}
              <span className="text-white font-mono-tabular">
                &quot;REM - Losing My Religion.mp3&quot;
              </span>
              {tr(
                ', recupera sus metadatos desde catálogos en línea y descárgalo con su nueva cabecera ID3v2.3 sin recodificar el audio.',
                ', retrieve its metadata from online catalogs, and download it with a new ID3v2.3 header without re-encoding the audio.',
                ', recupere seus metadados de catálogos online e baixe-o com seu novo cabeçalho ID3v2.3 sem recodificar o áudio.'
              )}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-7">
              <Link
                to="/editor"
                className="px-7 py-3.5 rounded-lg neon-btn-primary text-sm flex items-center gap-2 whitespace-nowrap"
              >
                <span>
                  {tr(
                    'Ir al Editor MP3',
                    'Go to MP3 Editor',
                    'Ir para o Editor MP3'
                  )}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/search"
                className="px-6 py-3.5 rounded-lg bg-[#090C12]/90 border border-white/20 hover:border-[var(--neon-primary)] text-sm font-medium text-white transition-colors whitespace-nowrap"
              >
                {tr(
                  'Abrir Buscador Musical',
                  'Open Music Search',
                  'Abrir Buscador Musical'
                )}
              </Link>

              <Link
                to="/about"
                className="px-4 py-3.5 text-sm font-medium text-slate-300 hover:text-white underline-offset-4 hover:underline whitespace-nowrap"
              >
                {tr(
                  'Conocer cómo funciona',
                  'Learn how it works',
                  'Saiba como funciona'
                )}
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-300 font-mono-tabular">
              <span>
                {tr(
                  'Lectura ID3v2.3 / ID3v2.4 / ID3v1',
                  'Reads ID3v2.3 / ID3v2.4 / ID3v1',
                  'Leitura ID3v2.3 / ID3v2.4 / ID3v1'
                )}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {tr(
                  'Escritura ID3v2.3 UTF-16LE',
                  'Writes ID3v2.3 UTF-16LE',
                  'Escrita ID3v2.3 UTF-16LE'
                )}
              </span>
              <span aria-hidden="true">·</span>
              <span className="neon-text">
                {tr(
                  'Iluminación Dinámica RGB',
                  'Dynamic RGB Lighting',
                  'Iluminação Dinâmica RGB'
                )}
              </span>
            </div>
          </motion.div>

          {/* 2. Demostración Visual Compacta del Flujo con Borde de Líneas RGB Animado */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...revealTransition, delay: 0.08 }}
            className="rgb-animated-border-card"
          >
            <div className="rgb-animated-border-inner p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 mb-6 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono-tabular neon-text block">
                    {tr(
                      'VISTA RÁPIDA DE TRANSFORMACIÓN DE METADATOS',
                      'METADATA TRANSFORMATION QUICK OVERVIEW',
                      'VISÃO RÁPIDA DE TRANSFORMAÇÃO DE METADADOS'
                    )}
                  </span>
                  <h2 className="text-lg font-semibold text-white mt-0.5">
                    {tr(
                      'De un archivo MP3 con solo nombre a un contenedor etiquetado',
                      'From a filename-only MP3 to a fully tagged container',
                      'De um arquivo MP3 apenas com nome para um contêiner etiquetado'
                    )}
                  </h2>
                </div>
                <Link
                  to="/editor"
                  className="text-xs font-medium neon-text hover:underline flex items-center gap-1 whitespace-nowrap"
                >
                  <span>
                    {tr(
                      'Probar con un archivo en el Editor',
                      'Try with a file in the Editor',
                      'Testar com um arquivo no Editor'
                    )}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                <div className="p-5 rounded-lg bg-[#06080D]/95 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono-tabular text-slate-400 mb-2">
                      {tr(
                        'ENTRADA · ARCHIVO LOCAL',
                        'INPUT · LOCAL FILE',
                        'ENTRADA · ARQUIVO LOCAL'
                      )}
                    </div>
                    <div className="text-sm font-mono-tabular font-semibold text-white mb-2">
                      REM - Losing My Religion.mp3
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {tr(
                        'Archivo MP3 válido sin etiquetas internas o con campos incompletos.',
                        'Valid MP3 file with no internal tags or incomplete metadata fields.',
                        'Arquivo MP3 válido sem tags internas ou com campos incompletos.'
                      )}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-white/5 text-xs font-mono-tabular text-slate-500">
                    {tr(
                      'Cabecera previa: 0 bytes ID3',
                      'Previous header: 0 bytes ID3',
                      'Cabeçalho anterior: 0 bytes ID3'
                    )}
                  </div>
                </div>

                <div className="p-5 rounded-lg bg-[#06080D]/95 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono-tabular neon-text mb-2">
                      {tr(
                        'PROCESO · BÚSQUEDA Y REVISIÓN',
                        'PROCESS · LOOKUP & REVIEW',
                        'PROCESSO · BUSCA E REVISÃO'
                      )}
                    </div>
                    <div className="text-sm font-semibold text-white mb-2">
                      {tr(
                        'Identificación por nombre o consulta manual',
                        'Filename identification or manual query',
                        'Identificação por nome ou consulta manual'
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {tr(
                        'Recupera candidatos desde catálogos en línea y permite editar cualquier etiqueta antes de escribir en el archivo.',
                        'Retrieves candidates from online catalogs and lets you edit any tag before writing to the file.',
                        'Recupera candidatos de catálogos online e permite editar qualquer tag antes de gravar no arquivo.'
                      )}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-white/5 text-xs font-mono-tabular text-slate-300">
                    {tr(
                      'R.E.M. · Out of Time · 1991 · Pista 4/11',
                      'R.E.M. · Out of Time · 1991 · Track 4/11',
                      'R.E.M. · Out of Time · 1991 · Faixa 4/11'
                    )}
                  </div>
                </div>

                <div className="p-5 rounded-lg bg-[#06080D]/95 border border-[var(--neon-primary)] flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono-tabular neon-text mb-2">
                      {tr(
                        'SALIDA · DESCARGA DIRECTA',
                        'OUTPUT · DIRECT DOWNLOAD',
                        'SAÍDA · DOWNLOAD DIRETO'
                      )}
                    </div>
                    <div className="text-sm font-semibold text-white mb-2">
                      {tr(
                        'Cabecera binaria ID3v2.3 inyectada',
                        'Injected ID3v2.3 binary header',
                        'Cabeçalho binário ID3v2.3 injetado'
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {tr(
                        'Incluye tramas de texto UTF-16LE, letra en trama USLT y carátula frontal APIC sin alterar los frames de audio MPEG.',
                        'Includes UTF-16LE text frames, lyrics in USLT frame, and APIC front cover without altering MPEG audio frames.',
                        'Inclui frames de texto UTF-16LE, letra no frame USLT e capa frontal APIC sem alterar os frames de áudio MPEG.'
                      )}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-white/5 text-xs font-mono-tabular neon-text">
                    TIT2 · TPE1 · TALB · TYER · USLT · APIC
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Características Principales — Fondo de Estudio de Grabación con Opacidad Oscura */}
      <section className="studio-section-console py-20 border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={revealTransition}
            className="mb-10"
          >
            <p className="text-xs font-mono-tabular neon-text tracking-wider mb-2">
              {tr(
                'CAPACIDADES DE LA PLATAFORMA',
                'PLATFORM CAPABILITIES',
                'CAPACIDADES DA PLATAFORMA'
              )}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white balance-text">
              {tr(
                'Herramientas especializadas para edición de etiquetas y consulta musical',
                'Specialized tools for tag editing and musical lookup',
                'Ferramentas especializadas para edição de tags e consulta musical'
              )}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((feat, idx) => {
              const IconComponent = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ ...revealTransition, delay: idx * 0.06 }}
                  className="bg-[#090C12]/90 backdrop-blur-md neon-border-subtle rounded-xl p-6 flex flex-col justify-between"
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

      {/* 4. Cómo Funciona — Fondo de Cabina Musical y Vinilos con Opacidad Oscura */}
      <section className="studio-section-vinyl py-20 border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={revealTransition}
            className="mb-10"
          >
            <p className="text-xs font-mono-tabular neon-text tracking-wider mb-2">
              {tr(
                'FLUJO DE TRABAJO PASO A PASO',
                'STEP-BY-STEP WORKFLOW',
                'FLUXO DE TRABALHO PASSO A PASSO'
              )}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white balance-text">
              {tr(
                'Cómo funciona el proceso en tres pasos',
                'How the three-step process works',
                'Como funciona o processo em três passos'
              )}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((item, idx) => {
              const StepIcon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ ...revealTransition, delay: idx * 0.08 }}
                  className="bg-[#090C12]/90 backdrop-blur-md neon-border-subtle rounded-xl p-6"
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

      {/* 5. Llamada a la Acción Final — Fondo de Consola de Estudio con Opacidad Oscura */}
      <section className="studio-section-console py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="bg-[#090C12]/92 backdrop-blur-md neon-border-active rounded-xl p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-mono-tabular neon-text mb-2">
                {tr(
                  'ACCESO DIRECTO A LAS HERRAMIENTAS',
                  'DIRECT ACCESS TO TOOLS',
                  'ACESSO DIRETO ÀS FERRAMENTAS'
                )}
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {tr(
                  'Elige tu entorno de trabajo en MetaPulse',
                  'Choose your workspace in MetaPulse',
                  'Escolha seu ambiente de trabalho no MetaPulse'
                )}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {tr(
                  'Accede al Editor MP3 para modificar y descargar archivos etiquetados, o abre el Buscador Musical para consultar información de canciones, artistas y álbumes.',
                  'Access the MP3 Editor to modify and download tagged files, or open Music Search to explore songs, artists, and albums.',
                  'Acesse o Editor MP3 para modificar e baixar arquivos etiquetados, ou abra o Buscador Musical para consultar informações de músicas, artistas e álbuns.'
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/editor"
                className="px-5 py-3 rounded-lg neon-btn-primary text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap"
              >
                <span>
                  {tr(
                    'Abrir Editor MP3',
                    'Open MP3 Editor',
                    'Abrir Editor MP3'
                  )}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/search"
                className="px-5 py-3 rounded-lg bg-[#090C12] border border-white/15 hover:border-[var(--neon-primary)] text-xs sm:text-sm font-medium text-white transition-colors whitespace-nowrap"
              >
                {tr(
                  'Ir al Buscador Musical',
                  'Go to Music Search',
                  'Ir para o Buscador Musical'
                )}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
