import React, { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Palette } from 'lucide-react';
import { NeonTheme } from '../../types/music';
import { MetaPulseLogo } from '../MetaPulseLogo';

interface AppLayoutProps {
  activeTheme: NeonTheme;
  onSelectTheme: (theme: NeonTheme) => void;
}

export const NEON_THEMES: Array<{
  id: NeonTheme;
  label: string;
  hex: string;
}> = [
  { id: 'green', label: 'Verde Neón', hex: '#00FF66' },
  { id: 'red', label: 'Rojo Carmesí', hex: '#FF2A54' },
  { id: 'blue', label: 'Azul Cian', hex: '#00D4FF' },
  { id: 'purple', label: 'Morado Cyber', hex: '#B855FF' },
];

const ROUTE_TITLES: Record<string, string> = {
  '/': 'MetaPulse — Estudio Cyberpunk de Metadatos MP3',
  '/about': 'Acerca de MetaPulse — Arquitectura ID3v2.3 y Capacidades',
  '/editor': 'Editor MP3 — Etiquetas ID3v2.3, Letras USLT y Carátulas | MetaPulse',
  '/search': 'Buscador Musical — Canciones, Artistas y Álbumes | MetaPulse',
};

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeTheme,
  onSelectTheme,
}) => {
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
    <div
      data-neon-theme={activeTheme}
      className="min-h-screen flex flex-col bg-[var(--surface-canvas)] text-[#F1F5F9] cyber-grid-bg transition-colors duration-200"
    >
      {/* Top Bar Contract: Strictly 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#080B10]/90 border-b border-white/10">
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

      {/* Secondary Workspace Bar: Mobile Nav + Global Cyberpunk Neon Theme Selector */}
      <div className="border-b border-white/10 bg-[#0B0F17]/90">
        <div className="max-w-[1280px] mx-auto px-6 py-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Mobile Navigation Links */}
          <nav
            aria-label="Navegación móvil"
            className="flex md:hidden items-center gap-2 overflow-x-auto pb-1 border-b border-white/10"
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

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-300">
            <Palette className="w-4 h-4 neon-text shrink-0" />
            <span className="font-medium">
              Tema Cyberpunk Global (aplicado a todas las vistas):
            </span>
          </div>

          <div
            role="group"
            aria-label="Selector de tema neón"
            className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-[#07090E] border border-white/10 self-start md:self-auto"
          >
            {NEON_THEMES.map((themeItem) => {
              const isSelected = activeTheme === themeItem.id;
              return (
                <button
                  key={themeItem.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelectTheme(themeItem.id)}
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

      {/* Active Route Viewport */}
      <main id="contenido-principal" className="flex-1">
        <Outlet />
      </main>

      {/* Shared Footer */}
      <footer className="py-10 bg-[#06080C] border-t border-white/10">
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
            <span className="font-mono-tabular text-slate-500">
              ID3v2.3 Binary Engine
            </span>
          </nav>
        </div>
      </footer>
    </div>
  );
};
