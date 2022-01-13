export const SNACK_BAR_DURATION = 2000;

export type ThumbnailType = 'view' | 'browse';
export type ThumbnailWidth = {
  [key in ThumbnailType]: number;
};
export const THUMBNAIL_WIDTH: ThumbnailWidth = {
  view: 1280 - 2 * 2 * 16,
  browse: 552,
};
