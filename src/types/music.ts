export type NeonTheme = 'green' | 'red' | 'blue' | 'purple';

export interface Mp3Metadata {
  title: string;
  artist: string;
  album: string;
  year: string;
  trackNumber: string;
  genre: string;
  composer: string;
  publisher: string;
  comment: string;
  lyrics: string;
  coverUrl: string;
  coverMimeType?: string;
  coverBytes?: Uint8Array;
}

export interface Id3FrameSummary {
  frameId: string;
  description: string;
  valuePreview: string;
  byteSize: number;
}

export interface CatalogTrackResult {
  trackId: number;
  title: string;
  artist: string;
  album: string;
  collectionId?: number;
  artistId?: number;
  year: string;
  releaseDate: string;
  trackNumber: string;
  trackCount?: number;
  discNumber?: number;
  genre: string;
  durationMs: number;
  coverUrl: string;
  previewUrl?: string;
  publisher?: string;
  country?: string;
  lyrics?: string;
}

export interface CatalogAlbumResult {
  collectionId: number;
  album: string;
  artist: string;
  artistId?: number;
  year: string;
  releaseDate: string;
  trackCount: number;
  genre: string;
  coverUrl: string;
  copyright?: string;
  country?: string;
}

export interface CatalogArtistResult {
  artistId: number;
  artist: string;
  primaryGenre: string;
  artistLinkUrl?: string;
  topAlbums: CatalogAlbumResult[];
  topTracks: CatalogTrackResult[];
}
