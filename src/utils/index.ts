export const APP_NAMES = [
  'Calendar',
  'Watch',
  'Weather',
  'AppStore',
  'Wallet',
  'Notes',
  'Reminder',
  'Camera',
  'Calculator',
  'Maps',
  'Photos',
  'Messages',
  'Email',
  'Safari'
];

/**
 * Generate random number from 0 up to max.
 * @param max maximum number.
 */
export const random = (max = 1): number =>
  Math.floor(Math.random() * max);

/**
 * Get random name from {@link APP_NAMES}.
 */
export const randomName = (): string =>
  APP_NAMES[random(APP_NAMES.length)];

/**
 * Generate random rgb() color.
 */
export const randomColor = (): string =>
  `rgb(${random(256)},${random(256)},${random(256)})`;
