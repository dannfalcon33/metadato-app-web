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
import { useLanguage } from '../i18n/LanguageContext';

const revealTransition = {
  duration: 0.42,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const AboutPage: React.FC = () => {
  const { tr } = useLanguage();

  return (
    <div className="studio-section-console py-12 min-h-[calc(100vh-4rem)]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition}
          className="max-w-3xl mb-12"
        >
          <p className="text-xs font-mono-tabular neon-text tracking-wider mb-2">
            {tr(
              'ACERCA DE METAPULSE · DOCUMENTACIÓN TÉCNICA Y USO',
              'ABOUT METAPULSE · TECHNICAL DOCUMENTATION & USAGE',
              'SOBRE O METAPULSE · DOCUMENTAÇÃO TÉCNICA E USO'
            )}
          </p>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white balance-text mb-4">
            {tr(
              'Qué es MetaPulse y cómo procesa los metadatos de tus archivos MP3',
              'What MetaPulse is and how it processes your MP3 metadata',
              'O que é o MetaPulse e como ele processa os metadados dos seus arquivos MP3'
            )}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {tr(
              'MetaPulse es una aplicación web enfocada en dos tareas complementarias: completar y editar etiquetas ID3 en archivos MP3 locales, y consultar información técnica de canciones, artistas y álbumes mediante fuentes públicas en línea.',
              'MetaPulse is a web application focused on two complementary tasks: completing and editing ID3 tags on local MP3 files, and querying technical information for songs, artists, and albums via public online sources.',
              'O MetaPulse é uma aplicação web focada em duas tarefas complementares: completar e editar tags ID3 em arquivos MP3 locais, e consultar informações técnicas de músicas, artistas e álbuns por meio de fontes públicas online.'
            )}
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
                {tr(
                  '01. Lectura y escritura binaria de archivos MP3',
                  '01. Binary reading and writing of MP3 files',
                  '01. Leitura e escrita binária de arquivos MP3'
                )}
              </h2>
              <Cpu className="w-5 h-5 neon-text shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {tr(
                'Cuando seleccionas un archivo ',
                'When you select a ',
                'Quando você seleciona um arquivo '
              )}
              <span className="font-mono-tabular text-white">.mp3</span>
              {tr(' en el ', ' file in the ', ' no ')}
              <Link to="/editor" className="neon-text hover:underline">
                {tr('Editor MP3', 'MP3 Editor', 'Editor MP3')}
              </Link>
              {tr(
                ', la lectura y el empaquetado del archivo se ejecutan directamente en la memoria del navegador mediante ',
                ', reading and packaging run directly in browser memory via ',
                ', a leitura e o empacotamento do arquivo são executados diretamente na memória do navegador via '
              )}
              <span className="font-mono-tabular text-white">ArrayBuffer</span>{' '}
              &amp;{' '}
              <span className="font-mono-tabular text-white">Uint8Array</span>.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {tr(
                'Al descargar el archivo resultante, MetaPulse construye una cabecera ID3v2.3 codificada en UTF-16LE con BOM y la antepone a los bytes de audio MPEG originales, evitando recodificar el sonido.',
                'When downloading the resulting file, MetaPulse builds a UTF-16LE with BOM encoded ID3v2.3 header and prepends it to the original MPEG audio bytes, avoiding any audio re-encoding.',
                'Ao baixar o arquivo resultante, o MetaPulse constrói um cabeçalho ID3v2.3 codificado em UTF-16LE com BOM e o antepõe aos bytes de áudio MPEG originais, evitando recodificar o som.'
              )}
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
                {tr(
                  '02. Consulta a servicios externos de catálogo y letras',
                  '02. Querying external catalog and lyrics services',
                  '02. Consulta a serviços externos de catálogo e letras'
                )}
              </h2>
              <Database className="w-5 h-5 neon-text shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {tr(
                'Para autocompletar metadatos a partir del nombre del archivo o realizar consultas en el ',
                'To autocomplete metadata from the filename or run queries in ',
                'Para autocompletar metadados a partir do nome do arquivo ou realizar consultas no '
              )}
              <Link to="/search" className="neon-text hover:underline">
                {tr('Buscador Musical', 'Music Search', 'Buscador Musical')}
              </Link>
              {tr(
                ', el navegador realiza peticiones HTTP de texto (nombre de canción, artista o álbum) hacia APIs públicas de catálogo musical (iTunes Search API) y bases públicas de letras (LRCLIB / Lyrics.ovh).',
                ', the browser sends text HTTP requests (song title, artist, or album) to public music catalog APIs (iTunes Search API) and public lyrics databases (LRCLIB / Lyrics.ovh).',
                ', o navegador realiza requisições HTTP de texto (nome da música, artista ou álbum) para APIs públicas de catálogo musical (iTunes Search API) e bases públicas de letras (LRCLIB / Lyrics.ovh).'
              )}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {tr(
                'El contenido de audio de tu archivo MP3 no se sube a dichos servicios; únicamente se envía el término de búsqueda textual y, si eliges una coincidencia, se descarga la imagen de carátula correspondiente para incrustarla localmente.',
                'The audio content of your MP3 file is never uploaded to these services; only the text search query is sent and, when you select a match, the corresponding cover art image is downloaded for local embedding.',
                'O conteúdo de áudio do seu arquivo MP3 nunca é enviado a esses serviços; apenas o termo de busca textual é enviado e, ao escolher uma correspondência, a imagem da capa correspondente é baixada para incorporação local.'
              )}
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
                {tr(
                  'ESPECIFICACIÓN TÉCNICA SOPORTADA',
                  'SUPPORTED TECHNICAL SPECIFICATION',
                  'ESPECIFICAÇÃO TÉCNICA SUPORTADA'
                )}
              </p>
              <h2 className="text-lg font-semibold text-white">
                {tr(
                  'Versiones ID3 y tramas admitidas por el motor actual',
                  'ID3 versions and frames supported by the current engine',
                  'Versões ID3 e frames suportados pelo motor atual'
                )}
              </h2>
            </div>
            <FileCheck2 className="w-5 h-5 neon-text shrink-0" />
          </div>

          <p className="text-xs text-slate-300 mb-5">
            {tr(
              'El lector reconoce etiquetas existentes en formatos ID3v2.3, ID3v2.4 e ID3v1. El escritor genera cabeceras estándar ID3v2.3 con las siguientes tramas:',
              'The reader recognizes existing tags in ID3v2.3, ID3v2.4, and ID3v1 formats. The writer generates standard ID3v2.3 headers with the following frames:',
              'O leitor reconhece tags existentes nos formatos ID3v2.3, ID3v2.4 e ID3v1. O gravador gera cabeçalhos padrão ID3v2.3 com os seguintes frames:'
            )}
          </p>

          <div className="overflow-x-auto border border-white/10 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-[#090C12] text-slate-400 font-mono-tabular">
                  <th className="py-2.5 px-4">
                    {tr('Trama ID3', 'ID3 Frame', 'Frame ID3')}
                  </th>
                  <th className="py-2.5 px-4">
                    {tr(
                      'Campo en MetaPulse',
                      'Field in MetaPulse',
                      'Campo no MetaPulse'
                    )}
                  </th>
                  <th className="py-2.5 px-4">
                    {tr(
                      'Codificación de salida',
                      'Output Encoding',
                      'Codificação de saída'
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">TIT2</td>
                  <td className="py-2.5 px-4">
                    {tr('Título de la canción', 'Song Title', 'Título da música')}
                  </td>
                  <td className="py-2.5 px-4 font-mono-tabular">UTF-16LE + BOM</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">TPE1</td>
                  <td className="py-2.5 px-4">
                    {tr('Artista principal', 'Lead Artist', 'Artista principal')}
                  </td>
                  <td className="py-2.5 px-4 font-mono-tabular">UTF-16LE + BOM</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">TALB</td>
                  <td className="py-2.5 px-4">
                    {tr('Álbum / Colección', 'Album / Collection', 'Álbum / Coleção')}
                  </td>
                  <td className="py-2.5 px-4 font-mono-tabular">UTF-16LE + BOM</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">TYER</td>
                  <td className="py-2.5 px-4">
                    {tr(
                      'Año de lanzamiento (4 dígitos)',
                      'Release Year (4 digits)',
                      'Ano de lançamento (4 dígitos)'
                    )}
                  </td>
                  <td className="py-2.5 px-4 font-mono-tabular">UTF-16LE + BOM</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">TRCK</td>
                  <td className="py-2.5 px-4">
                    {tr(
                      'Número de pista (ej. 4/11)',
                      'Track Number (e.g. 4/11)',
                      'Número da faixa (ex. 4/11)'
                    )}
                  </td>
                  <td className="py-2.5 px-4 font-mono-tabular">UTF-16LE + BOM</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">TCON</td>
                  <td className="py-2.5 px-4">
                    {tr('Género musical', 'Musical Genre', 'Gênero musical')}
                  </td>
                  <td className="py-2.5 px-4 font-mono-tabular">UTF-16LE + BOM</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">
                    TCOM / TPUB
                  </td>
                  <td className="py-2.5 px-4">
                    {tr(
                      'Compositor y Sello discográfico',
                      'Composer & Record Label',
                      'Compositor e Gravadora'
                    )}
                  </td>
                  <td className="py-2.5 px-4 font-mono-tabular">UTF-16LE + BOM</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">USLT</td>
                  <td className="py-2.5 px-4">
                    {tr(
                      'Letra no sincronizada del tema',
                      'Unsynchronized song lyrics',
                      'Letra não sincronizada da música'
                    )}
                  </td>
                  <td className="py-2.5 px-4 font-mono-tabular">
                    UTF-16LE + Lang Descriptor
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">COMM</td>
                  <td className="py-2.5 px-4">
                    {tr('Comentario embebido', 'Embedded comment', 'Comentário embutido')}
                  </td>
                  <td className="py-2.5 px-4 font-mono-tabular">
                    UTF-16LE + Lang Descriptor
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono-tabular neon-text">APIC</td>
                  <td className="py-2.5 px-4">
                    {tr(
                      'Carátula frontal (0x03 Front Cover)',
                      'Front Cover Art (0x03 Front Cover)',
                      'Capa frontal (0x03 Front Cover)'
                    )}
                  </td>
                  <td className="py-2.5 px-4 font-mono-tabular">
                    Binary JPEG / PNG / WebP
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
            <h2 className="text-xl font-bold text-white">
              {tr(
                'Preguntas frecuentes',
                'Frequently Asked Questions',
                'Perguntas frequentes'
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-2">
                {tr(
                  '¿El Buscador Musical descarga canciones comerciales?',
                  'Does Music Search download commercial songs?',
                  'O Buscador Musical baixa músicas comerciais?'
                )}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {tr(
                  'No. El Buscador Musical es una herramienta de consulta de metadatos para ver años de lanzamiento, pistas de un álbum, letras y escuchar vistas previas cuando el proveedor las facilita. Su función es ayudarte a consultar datos o precompletar el formulario del Editor MP3.',
                  'No. Music Search is a metadata lookup tool to inspect release years, album tracklists, lyrics, and listen to short audio previews when provided by the catalog. Its purpose is to help you look up data or prefill the MP3 Editor form.',
                  'Não. O Buscador Musical é uma ferramenta de consulta de metadados para ver anos de lançamento, faixas de um álbum, letras e ouvir prévias quando fornecidas pelo provedor. Sua função é ajudar na consulta de dados ou preencher previamente o formulário do Editor MP3.'
                )}
              </p>
            </div>

            <div className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-2">
                {tr(
                  '¿Por qué algunas canciones tienen preview de audio y otras no?',
                  'Why do some songs have an audio preview while others do not?',
                  'Por que algumas músicas têm prévia de áudio e outras não?'
                )}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {tr(
                  'La disponibilidad de fragmentos de vista previa depende de la fuente de catálogo consultada y de los permisos regionales de cada edición discográfica. Cuando no existe preview, todos los metadatos siguen disponibles para consulta y uso en el editor.',
                  'Preview clip availability depends on the catalog source and regional licensing for each release. When no preview is available, all metadata remains available for inspection and use in the editor.',
                  'A disponibilidade de trechos de prévia depende da fonte do catálogo consultada e das permissões regionais de cada edição. Quando não há prévia, todos os metadados continuam disponíveis para consulta e uso no editor.'
                )}
              </p>
            </div>

            <div className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-2">
                {tr(
                  '¿Se modifica mi archivo MP3 original automáticamente?',
                  'Is my original MP3 file modified automatically?',
                  'Meu arquivo MP3 original é modificado automaticamente?'
                )}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {tr(
                  'No. Tu archivo original permanece intacto en tu dispositivo. Solo cuando revisas los campos y pulsas «Descargar MP3 con Metadatos» el navegador genera un nuevo archivo con las etiquetas actualizadas.',
                  'No. Your original file remains untouched on your device. Only when you review the fields and click "Download Tagged MP3" does the browser generate a new file with the updated tags.',
                  'Não. Seu arquivo original permanece intacto no seu dispositivo. Somente quando você revisa os campos e clica em «Baixar MP3 com Metadados» o navegador gera um novo arquivo com as tags atualizadas.'
                )}
              </p>
            </div>

            <div className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-2">
                {tr(
                  '¿Qué ocurre si mi archivo ya tenía otras tramas ID3 avanzadas?',
                  'What happens if my file already had other advanced ID3 frames?',
                  'O que acontece se meu arquivo já tiver outros frames ID3 avançados?'
                )}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {tr(
                  'El motor lee las tramas principales admitidas (título, artista, álbum, año, pista, género, compositor, sello, comentario, letra USLT y carátula APIC) y construye una cabecera ID3v2.3 limpia con los valores visibles en el formulario del editor.',
                  'The engine reads the supported core frames (title, artist, album, year, track, genre, composer, label, comment, USLT lyrics, and APIC cover art) and builds a clean ID3v2.3 header with the values visible in the editor form.',
                  'O motor lê os principais frames suportados (título, artista, álbum, ano, faixa, gênero, compositor, gravadora, comentário, letra USLT e capa APIC) e constrói um cabeçalho ID3v2.3 limpo com os valores visíveis no formulário do editor.'
                )}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <div className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 neon-text shrink-0" />
            <span className="text-xs sm:text-sm text-slate-200">
              {tr(
                '¿Listo para editar un archivo MP3 o consultar una discografía?',
                'Ready to edit an MP3 file or explore a discography?',
                'Pronto para editar um arquivo MP3 ou consultar uma discografia?'
              )}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/editor"
              className="px-4 py-2 rounded-lg neon-btn-primary text-xs flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>
                {tr('Abrir Editor MP3', 'Open MP3 Editor', 'Abrir Editor MP3')}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/search"
              className="px-4 py-2 rounded-lg bg-[#090C12] border border-white/15 hover:border-[var(--neon-primary)] text-xs font-medium text-white transition-colors whitespace-nowrap"
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
    </div>
  );
};
