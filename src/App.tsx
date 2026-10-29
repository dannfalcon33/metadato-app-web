import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CatalogTrackResult } from './types/music';
import { AppLayout } from './components/layout/AppLayout';
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
  const [selectedCatalogTrack, setSelectedCatalogTrack] =
    useState<CatalogTrackResult | null>(null);

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#05070B] flex items-center justify-center text-xs font-mono-tabular text-slate-400">
            Cargando vista de MetaPulse...
          </div>
        }
      >
        <Routes>
          <Route element={<AppLayout />}>
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
