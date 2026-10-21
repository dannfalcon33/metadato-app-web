import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, FileAudio, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <section className="py-20">
      <div className="max-w-[760px] mx-auto px-6 text-center">
        <div className="bg-[var(--surface-card)] neon-border-subtle rounded-xl p-8 sm:p-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl neon-bg-soft border border-[var(--neon-primary)] mb-5">
            <Compass className="w-6 h-6 neon-text" />
          </div>

          <p className="text-xs font-mono-tabular neon-text mb-2">
            CÓDIGO DE ESTADO 404 · RUTA NO ENCONTRADA
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            La dirección solicitada no existe en MetaPulse
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto mb-8">
            Verifica la URL introducida o utiliza cualquiera de los accesos
            directos inferiores para volver a la página de presentación o abrir las
            herramientas de metadatos.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-lg neon-btn-primary text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Inicio</span>
            </Link>

            <Link
              to="/editor"
              className="px-4 py-2.5 rounded-lg bg-[#090C12] border border-white/15 hover:border-[var(--neon-primary)] text-xs sm:text-sm font-medium text-white flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <FileAudio className="w-4 h-4 neon-text" />
              <span>Abrir Editor MP3</span>
            </Link>

            <Link
              to="/search"
              className="px-4 py-2.5 rounded-lg bg-[#090C12] border border-white/15 hover:border-[var(--neon-primary)] text-xs sm:text-sm font-medium text-white flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Search className="w-4 h-4 neon-text" />
              <span>Ir al Buscador Musical</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
