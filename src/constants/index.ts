// Storage keys for localStorage
export const STORAGE_KEYS = {
  HIDDEN_THOUGHTS: 'mindtrace-hide-hidden-thoughts'
} as const;

// Pagination settings
export const PAGINATION = {
  DAYS_PER_LOAD: 2,
  THOUGHTS_PREVIEW_LENGTH: 500
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please try again.',
  EXPORT_FAILED: 'Export failed. Please try again.',
  ADD_THOUGHT_FAILED: 'Failed to add thought',
  UPDATE_THOUGHT_FAILED: 'Failed to update thought',
  DELETE_THOUGHT_FAILED: 'Failed to delete thought',
  TOGGLE_HIDDEN_FAILED: 'Failed to toggle thought visibility',
  LOAD_THOUGHTS_FAILED: 'Failed to load thoughts',
  UPDATE_PROFILE_FAILED: 'Failed to update profile',
  LOAD_PROFILE_FAILED: 'Failed to load profile',
  AUTH_FAILED: 'Authentication failed'
} as const;

// UI configuration
export const UI_CONFIG = {
  HEADER_HEIGHT: 64, // h-16 = 64px
  MODAL_Z_INDEX: 50,
  SIDEBAR_WIDTH: 224, // w-56 = 224px
  MOBILE_SIDEBAR_WIDTH: 256, // w-64 = 256px
  COPY_STATUS_TIMEOUT: 2000,
  ERROR_STATUS_TIMEOUT: 3000
} as const;

// Export settings
export const EXPORT = {
  FILENAME_PREFIX: 'thoughts',
  MARKDOWN_MIME_TYPE: 'text/markdown',
  DATE_RANGE_OPTIONS: [3, 7, 14, 30, 90] as const
} as const;

// Theme configuration
export const THEME = {
  COLORS: {
    PRIMARY: 'gray-900',
    SECONDARY: 'gray-600',
    SUCCESS: 'green-600',
    WARNING: 'orange-600',
    DANGER: 'red-600'
  }
} as const;