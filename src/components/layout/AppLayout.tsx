import React, { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { MetaPulseLogo } from '../MetaPulseLogo';
import { AppLanguage, useLanguage } from '../../i18n/LanguageContext';

const LANGUAGE_OPTIONS: { code: AppLanguage; label: string; name: string }[] = [
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'pt', label: 'PT', name: 'Português' },
];

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const { lang, setLang, tr } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    const titles: Record<string, string> = {
      '/': tr(
        'MetaPulse — Estudio Cyberpunk de Metadatos MP3',
        'MetaPulse — Cyberpunk MP3 Metadata Studio',
        'MetaPulse — Estúdio Cyberpunk de Metadados MP3'
      ),
      '/about': tr(
        'Acerca de MetaPulse — Arquitectura ID3v2.3 y Capacidades',
        'About MetaPulse — ID3v2.3 Architecture & Capabilities',
        'Sobre o MetaPulse — Arquitetura ID3v2.3 e Capacidades'
      ),
      '/editor': tr(
        'Editor MP3 — Etiquetas ID3v2.3, Letras USLT y Carátulas | MetaPulse',
        'MP3 Editor — ID3v2.3 Tags, USLT Lyrics & Cover Art | MetaPulse',
        'Editor MP3 — Tags ID3v2.3, Letras USLT e Capas | MetaPulse'
      ),
      '/search': tr(
        'Buscador Musical — Canciones, Artistas y Álbumes | MetaPulse',
        'Music Search — Songs, Artists & Albums | MetaPulse',
        'Buscador Musical — Músicas, Artistas e Álbuns | MetaPulse'
      ),
    };

    document.title =
      titles[location.pathname] ||
      tr(
        'Página no encontrada (404) | MetaPulse',
        'Page not found (404) | MetaPulse',
        'Página não encontrada (404) | MetaPulse'
      );
  }, [location.pathname, lang, tr]);

  const navLinks = [
    { to: '/', label: tr('Inicio', 'Home', 'Início'), end: true },
    { to: '/editor', label: tr('Editor MP3', 'MP3 Editor', 'Editor MP3') },
    {
      to: '/search',
      label: tr('Buscador Musical', 'Music Search', 'Buscador Musical'),
    },
    { to: '/about', label: tr('Acerca de', 'About', 'Sobre') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-canvas)] text-[#F1F5F9] cyber-grid-bg">
      {/* Top Bar Contract: Strictly 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#05070B]/90 border-b border-white/10">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Brand Lockup */}
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0"
          >
            <MetaPulseLogo className="w-8 h-8" />
            <span>MetaPulse</span>
          </Link>

          {/* Zone 2: 4 concise single-line React Router navigation links */}
          <nav
            aria-label={tr(
              'Navegación principal',
              'Main navigation',
              'Navegação principal'
            )}
            className="hidden md:flex items-center gap-7 text-sm font-medium"
          >
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                    isActive
                      ? 'neon-text border-[var(--neon-primary)] font-semibold'
                      : 'text-slate-300 border-transparent hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Language Switcher (ES | EN | PT) + Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              role="group"
              aria-label={tr(
                'Seleccionar idioma',
                'Select language',
                'Selecionar idioma'
              )}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#090C12] border border-white/15"
            >
              <Globe className="w-3.5 h-3.5 neon-text mr-0.5 shrink-0" />
              {LANGUAGE_OPTIONS.map((option) => {
                const isActive = lang === option.code;
                return (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => setLang(option.code)}
                    title={option.name}
                    aria-pressed={isActive}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono-tabular font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'neon-bg-soft neon-text border border-[var(--neon-primary)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <Link
              to="/editor"
              className="px-4 py-2 text-xs font-semibold rounded-lg neon-btn-primary whitespace-nowrap shrink-0"
            >
              {tr('Abrir Editor MP3', 'Open MP3 Editor', 'Abrir Editor MP3')}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Bar (visible only on small viewports) */}
      <div className="md:hidden border-b border-white/10 bg-[#080B12]/90">
        <div className="max-w-[1280px] mx-auto px-6 py-2.5">
          <nav
            aria-label={tr(
              'Navegación móvil',
              'Mobile navigation',
              'Navegação móvel'
            )}
            className="flex items-center gap-2 overflow-x-auto"
          >
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'neon-bg-soft neon-text border border-[var(--neon-primary)]'
                      : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Active Route Viewport */}
      <main id="contenido-principal" className="flex-1">
        <Outlet />
      </main>

      {/* Shared Footer */}
      <footer className="py-10 bg-[#04060A] border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <MetaPulseLogo className="w-7 h-7" />
            <span className="font-display font-bold text-white text-base">
              MetaPulse
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">
              {tr(
                'Estudio Cyberpunk de Metadatos MP3 e Inspector Musical',
                'Cyberpunk MP3 Metadata Studio & Music Inspector',
                'Estúdio Cyberpunk de Metadados MP3 e Inspetor Musical'
              )}
            </span>
          </div>

          <nav
            aria-label={tr(
              'Enlaces del pie de página',
              'Footer links',
              'Links do rodapé'
            )}
            className="flex flex-wrap items-center gap-6 text-xs text-slate-400"
          >
            <Link to="/" className="hover:text-white transition-colors">
              {tr('Inicio', 'Home', 'Início')}
            </Link>
            <Link to="/editor" className="hover:text-white transition-colors">
              {tr('Editor MP3', 'MP3 Editor', 'Editor MP3')}
            </Link>
            <Link to="/search" className="hover:text-white transition-colors">
              {tr('Buscador Musical', 'Music Search', 'Buscador Musical')}
            </Link>
            <Link to="/about" className="hover:text-white transition-colors">
              {tr('Acerca de', 'About', 'Sobre')}
            </Link>
            <span className="font-mono-tabular neon-text">
              ID3v2.3 RGB Engine
            </span>
          </nav>
        </div>
      </footer>
    </div>
  );
};
