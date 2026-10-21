import React from 'react';
import { useLocation } from 'react-router-dom';
import { CatalogTrackResult } from '../types/music';
import { Mp3TaggerStudio } from '../components/Mp3TaggerStudio';

interface EditorPageProps {
  selectedCatalogTrack: CatalogTrackResult | null;
  onClearExternalTrack: () => void;
}

export const EditorPage: React.FC<EditorPageProps> = ({
  selectedCatalogTrack,
  onClearExternalTrack,
}) => {
  const location = useLocation();
  const routerStateTrack =
    (location.state as { prefilledTrack?: CatalogTrackResult } | null)
      ?.prefilledTrack || null;

  const activeTrack = selectedCatalogTrack || routerStateTrack;

  return (
    <Mp3TaggerStudio
      externalSelectedTrack={activeTrack}
      onClearExternalTrack={onClearExternalTrack}
    />
  );
};
