import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Cpu,
  FileCheck2,
  Database,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

const revealTransition = {
  duration: 0.42,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition}
          className="max-w-3xl mb-12"
        >
          <p className="text-xs font-mono-tabular neon-text tracking-wider mb-2">
            ACERCA DE METAPULSE · DOCUMENTACIÓN TÉCNICA Y USO
          </p>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white balance-text mb-4">
            Qué es MetaPulse y cómo procesa los metadatos de tus archivos MP3
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            MetaPulse es una aplicación web enfocada en dos tareas complementarias:
            completar y editar etiquetas ID3 en archivos MP3 locales, y consultar
            información técnica de canciones, artistas y álbumes mediante fuentes
            públicas en línea.
          </p>
        </motion.div>

        {/* Core Explanation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ ...revealTransition, delay: 0.04 }}
            className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-7"
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-white">
                01. Lectura y escritura binaria de archivos MP3
              </h2>
              <Cpu className="w-5 h-5 neon-text shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Cuando seleccionas un archivo <span className="font-mono-tabular text-white">.mp3</span> en el{' '}
              <Link to="/editor" className="neon-text hover:underline">
                Editor MP3
              </Link>
              , la lectura y el empaquetado del archivo se ejecutan directamente en
              la memoria del navegador mediante <span className="font-mono-tabular text-white">ArrayBuffer</span> y{' '}
              <span className="font-mono-tabular text-white">Uint8Array</span>.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Al descargar el archivo resultante, MetaPulse construye una cabecera{' '}
              <span className="font-mono-tabular text-white">ID3v2.3</span> codificada en{' '}
              <span className="font-mono-tabular text-white">UTF-16LE</span> con BOM y la
              antepone a los bytes de audio MPEG originales, evitando recodificar el
              sonido.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ ...revealTransition, delay: 0.08 }}
            className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-7"
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-white">
                02. Consulta a servicios externos de catálogo y letras
              </h2>
              <Database className="w-5 h-5 neon-text shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Para autocompletar metadatos a partir del nombre del archivo o realizar
              consultas en el{' '}
              <Link to="/search" className="neon-text hover:underline">
                Buscador Musical
              </Link>
              , el navegador realiza peticiones HTTP de texto (nombre de canción,
              artista o álbum) hacia APIs públicas de catálogo musical (iTunes Search
              API) y bases públicas de letras (LRCLIB / Lyrics.ovh).
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              El contenido de audio de tu archivo MP3 no se sube a dichos servicios;
              únicamente se envía el término de búsqueda textual y, si eliges una
              coincidencia, se descarga la imagen de carátula correspondiente para
              incrustarla localmente.
            </p>
          </motion.div>
        </div>

        {/* Supported ID3 Frames Specification Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={revealTransition}
          className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-7 mb-12"
        >
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <p className="text-xs font-mono-tabular neon-text mb-1">
                ESPECIFICACIÓN TÉCNICA SOPORTADA
              </p>
              <h2 className="text-lg font-semibold text-white">
                Versiones ID3 y tramas admitidas por el motor actual
              </h2>
            </div>
            <FileCheck2 className="w-5 h-5 neon-text shrink-0" />
          </div>

          <p className="text-xs text-slate-300 mb-5">
            El lector reconoce etiquetas existentes en formatos{' '}
            <span className="font-mono-tabular text-white">ID3v2.3</span>,{' '}
            <span className="font-mono-tabular text-white">ID3v2.4</span> e{' '}
            <span className="font-mono-tabular text-white">ID3v1</span>. El escritor
            genera cabeceras estándar <span className="font-mono-tabular text-white">ID3v2.3</span> con las
            siguientes tramas:
          </p>

          <div className="overflow-x-auto border border-white/10 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-[#090C12] text-slate-400 font-mono-tabular">
                  <th className="py-2.5 px-4">Trama ID3</th>
                  <th className="py-2.5 px-4">Campo en MetaPulse</th>
                  <th className="py-2.5 px-4">Codificación de salida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">TIT2</td>
                  <td className="py-2.5 px-4">Título de la canción</td>
                  <td className="py-2.5 px-4 font-mono-tabular">UTF-16LE con BOM</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">TPE1</td>
                  <td className="py-2.5 px-4">Artista principal</td>
                  <td className="py-2.5 px-4 font-mono-tabular">UTF-16LE con BOM</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">TALB</td>
                  <td className="py-2.5 px-4">Álbum / Colección</td>
                  <td className="py-2.5 px-4 font-mono-tabular">UTF-16LE con BOM</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">TYER</td>
                  <td className="py-2.5 px-4">Año de lanzamiento (4 dígitos)</td>
                  <td className="py-2.5 px-4 font-mono-tabular">UTF-16LE con BOM</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">TRCK</td>
                  <td className="py-2.5 px-4">Número de pista (ej. 4/11)</td>
                  <td className="py-2.5 px-4 font-mono-tabular">UTF-16LE con BOM</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">TCON</td>
                  <td className="py-2.5 px-4">Género musical</td>
                  <td className="py-2.5 px-4 font-mono-tabular">UTF-16LE con BOM</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">TCOM / TPUB</td>
                  <td className="py-2.5 px-4">Compositor y Sello discográfico</td>
                  <td className="py-2.5 px-4 font-mono-tabular">UTF-16LE con BOM</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">USLT</td>
                  <td className="py-2.5 px-4">Letra no sincronizada del tema</td>
                  <td className="py-2.5 px-4 font-mono-tabular">
                    UTF-16LE + Descriptor de idioma
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">COMM</td>
                  <td className="py-2.5 px-4">Comentario embebido</td>
                  <td className="py-2.5 px-4 font-mono-tabular">
                    UTF-16LE + Descriptor de idioma
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">APIC</td>
                  <td className="py-2.5 px-4">Carátula frontal (0x03 Front Cover)</td>
                  <td className="py-2.5 px-4 font-mono-tabular">
                    Binario JPEG / PNG / WebP
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={revealTransition}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 neon-text" />
            <h2 className="text-xl font-bold text-white">Preguntas frecuentes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-2">
                ¿El Buscador Musical descarga canciones comerciales?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                No. El Buscador Musical es una herramienta de consulta de metadatos
                para ver años de lanzamiento, pistas de un álbum, letras y escuchar
                vistas previas cuando el proveedor las facilita. Su función es
                ayudarte a consultar datos o precompletar el formulario del Editor MP3.
              </p>
            </div>

            <div className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-2">
                ¿Por qué algunas canciones tienen preview de audio y otras no?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                La disponibilidad de fragmentos de vista previa depende de la fuente
                de catálogo consultada y de los permisos regionales de cada edición
                discográfica. Cuando no existe preview, todos los metadatos siguen
                disponibles para consulta y uso en el editor.
              </p>
            </div>

            <div className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-2">
                ¿Se modifica mi archivo MP3 original automáticamente?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                No. Tu archivo original permanece intacto en tu dispositivo. Solo
                cuando revisas los campos y pulsas «Descargar MP3 con Metadatos» el
                navegador genera un nuevo archivo con las etiquetas actualizadas.
              </p>
            </div>

            <div className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-2">
                ¿Qué ocurre si mi archivo ya tenía otras tramas ID3 avanzadas?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                El motor lee las tramas principales admitidas (título, artista,
                álbum, año, pista, género, compositor, sello, comentario, letra USLT y
                carátula APIC) y construye una cabecera ID3v2.3 limpia con los valores
                visibles en el formulario del editor.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <div className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 neon-text shrink-0" />
            <span className="text-xs sm:text-sm text-slate-200">
              ¿Listo para editar un archivo MP3 o consultar una discografía?
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/editor"
              className="px-4 py-2 rounded-lg neon-btn-primary text-xs flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Abrir Editor MP3</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/search"
              className="px-4 py-2 rounded-lg bg-[#090C12] border border-white/15 hover:border-[var(--neon-primary)] text-xs font-medium text-white transition-colors whitespace-nowrap"
            >
              Ir al Buscador Musical
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
