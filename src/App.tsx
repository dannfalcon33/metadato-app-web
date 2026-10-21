import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CatalogTrackResult, NeonTheme } from './types/music';
import { AppLayout, NEON_THEMES } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';

const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const EditorPage = lazy(() =>
  import('./pages/EditorPage').then((m) => ({ default: m.EditorPage }))
);
const SearchPage = lazy(() =>
  import('./pages/SearchPage').then((m) => ({ default: m.SearchPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

export default function App() {
  const [activeTheme, setActiveTheme] = useState<NeonTheme>('green');
  const [selectedCatalogTrack, setSelectedCatalogTrack] =
    useState<CatalogTrackResult | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-neon-theme', activeTheme);
    const currentThemeObj = NEON_THEMES.find((t) => t.id === activeTheme);
    const metaThemeColor = document.getElementById('meta-theme-color');
    if (metaThemeColor && currentThemeObj) {
      metaThemeColor.setAttribute('content', currentThemeObj.hex);
    }
  }, [activeTheme]);

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#080B10] flex items-center justify-center text-xs font-mono-tabular text-slate-400">
            Cargando vista de MetaPulse...
          </div>
        }
      >
        <Routes>
          <Route
            element={
              <AppLayout
                activeTheme={activeTheme}
                onSelectTheme={(theme) => setActiveTheme(theme)}
              />
            }
          >
            <Route index element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/editor"
              element={
                <EditorPage
                  selectedCatalogTrack={selectedCatalogTrack}
                  onClearExternalTrack={() => setSelectedCatalogTrack(null)}
                />
              }
            />
            <Route
              path="/search"
              element={
                <SearchPage
                  onSendTrackToEditor={(track) =>
                    setSelectedCatalogTrack(track)
                  }
                />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
