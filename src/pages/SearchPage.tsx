import React from 'react';
import { CatalogTrackResult } from '../types/music';
import { CatalogExplorer } from '../components/CatalogExplorer';

interface SearchPageProps {
  onSendTrackToEditor: (track: CatalogTrackResult) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  onSendTrackToEditor,
}) => {
  return (
    <div className="studio-section-vinyl min-h-[calc(100vh-4rem)]">
      <CatalogExplorer onSendTrackToEditor={onSendTrackToEditor} />
    </div>
  );
};
