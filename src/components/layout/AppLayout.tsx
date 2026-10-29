import React, { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { MetaPulseLogo } from '../MetaPulseLogo';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'MetaPulse — Estudio Cyberpunk de Metadatos MP3',
  '/about': 'Acerca de MetaPulse — Arquitectura ID3v2.3 y Capacidades',
  '/editor': 'Editor MP3 — Etiquetas ID3v2.3, Letras USLT y Carátulas | MetaPulse',
  '/search': 'Buscador Musical — Canciones, Artistas y Álbumes | MetaPulse',
};

export const AppLayout: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    document.title =
      ROUTE_TITLES[location.pathname] ||
      'Página no encontrada (404) | MetaPulse';
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Inicio', end: true },
    { to: '/editor', label: 'Editor MP3' },
    { to: '/search', label: 'Buscador Musical' },
    { to: '/about', label: 'Acerca de' },
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
            aria-label="Navegación principal"
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

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <Link
              to="/editor"
              className="px-4 py-2 text-xs font-semibold rounded-lg neon-btn-primary whitespace-nowrap shrink-0"
            >
              Abrir Editor MP3
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Bar (visible only on small viewports) */}
      <div className="md:hidden border-b border-white/10 bg-[#080B12]/90">
        <div className="max-w-[1280px] mx-auto px-6 py-2.5">
          <nav
            aria-label="Navegación móvil"
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
              Estudio Cyberpunk de Metadatos MP3 e Inspector Musical
            </span>
          </div>

          <nav
            aria-label="Enlaces del pie de página"
            className="flex flex-wrap items-center gap-6 text-xs text-slate-400"
          >
            <Link to="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <Link to="/editor" className="hover:text-white transition-colors">
              Editor MP3
            </Link>
            <Link to="/search" className="hover:text-white transition-colors">
              Buscador Musical
            </Link>
            <Link to="/about" className="hover:text-white transition-colors">
              Acerca de
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
