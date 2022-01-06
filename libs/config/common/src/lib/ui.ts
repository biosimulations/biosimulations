export const SNACK_BAR_DURATION = 2000;

export const THUMBNAIL_WIDTH = {
  'view': 1280 - 2 * 2 * 16,
  'browse': 552,
};
export type ThumbnailType = keyof typeof THUMBNAIL_WIDTH;
