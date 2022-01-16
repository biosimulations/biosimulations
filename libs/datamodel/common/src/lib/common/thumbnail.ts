export const IMAGE_FORMAT_URIS = [
  'http://purl.org/NET/mediatypes/image/gif',
  'http://purl.org/NET/mediatypes/image/jpeg',
  'http://purl.org/NET/mediatypes/image/png',
  'http://purl.org/NET/mediatypes/image/webp',
];

export enum Thumbnail {
  view = 'view',
  browse = 'browse',
}

export type ThumbnailUrls = { [key in Thumbnail]?: string };
// typescript 4.2 feature to get union type from enum
export type ThumbnailType = `${Thumbnail}`;
export type ThumbnailWidth = {
  [key in Thumbnail]: number;
};
export const THUMBNAIL_TYPES: ThumbnailType[] = Object.values(Thumbnail);
export const THUMBNAIL_WIDTH: ThumbnailWidth = {
  view: 1280 - 2 * 2 * 16,
  browse: 552,
};
