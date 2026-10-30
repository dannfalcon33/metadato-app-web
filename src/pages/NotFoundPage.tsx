import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, FileAudio, Search } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const NotFoundPage: React.FC = () => {
  const { tr } = useLanguage();

  return (
    <section className="studio-section-console py-20 min-h-[calc(100vh-4rem)]">
      <div className="max-w-[760px] mx-auto px-6 text-center">
        <div className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-8 sm:p-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl neon-bg-soft border border-[var(--neon-primary)] mb-5">
            <Compass className="w-6 h-6 neon-text" />
          </div>

          <p className="text-xs font-mono-tabular neon-text mb-2">
            {tr(
              'CÓDIGO DE ESTADO 404 · RUTA NO ENCONTRADA',
              'STATUS CODE 404 · ROUTE NOT FOUND',
              'CÓDIGO DE STATUS 404 · ROTA NÃO ENCONTRADA'
            )}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {tr(
              'La dirección solicitada no existe en MetaPulse',
              'The requested address does not exist in MetaPulse',
              'O endereço solicitado não existe no MetaPulse'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto mb-8">
            {tr(
              'Verifica la URL introducida o utiliza cualquiera de los accesos directos inferiores para volver a la página de presentación o abrir las herramientas de metadatos.',
              'Check the entered URL or use any of the shortcuts below to return to the home page or open the metadata tools.',
              'Verifique a URL inserida ou utilize qualquer um dos atalhos abaixo para voltar à página inicial ou abrir as ferramentas de metadados.'
            )}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-lg neon-btn-primary text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                {tr('Volver al Inicio', 'Back to Home', 'Voltar ao Início')}
              </span>
            </Link>

            <Link
              to="/editor"
              className="px-4 py-2.5 rounded-lg bg-[#090C12] border border-white/15 hover:border-[var(--neon-primary)] text-xs sm:text-sm font-medium text-white flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <FileAudio className="w-4 h-4 neon-text" />
              <span>
                {tr('Abrir Editor MP3', 'Open MP3 Editor', 'Abrir Editor MP3')}
              </span>
            </Link>

            <Link
              to="/search"
              className="px-4 py-2.5 rounded-lg bg-[#090C12] border border-white/15 hover:border-[var(--neon-primary)] text-xs sm:text-sm font-medium text-white flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Search className="w-4 h-4 neon-text" />
              <span>
                {tr(
                  'Ir al Buscador Musical',
                  'Go to Music Search',
                  'Ir para o Buscador Musical'
                )}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
