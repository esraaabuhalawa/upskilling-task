/**
 * Application-wide constants
 * Centralize magic numbers and hardcoded strings here
 */

export const APP_CONFIG = {
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 0,
    DEFAULT_ROWS: 2,
    DEFAULT_LIMIT: 10,
    INITIAL_FETCH_LIMIT: 50,
    MAX_ROWS_OPTIONS: [5, 10, 20, 50],
  },

  // Search
  SEARCH: {
    MIN_SEARCH_LENGTH: 1,
    DEBOUNCE_TIME: 300,
    PLACEHOLDER: 'Search by name...',
  },

  // Images
  IMAGES: {
    PLACEHOLDER_URL: 'https://placehold.co/600x400',
    AVATAR_SIZE: { width: 48, height: 48 },
    PROFILE_UPLOAD: 'https://placehold.co/400x400/e2e8f0/64748b?text=Upload+Image',
  },

  // Messages
  MESSAGES: {
    SUCCESS: {
      USER_CREATED: 'User created successfully',
      USER_UPDATED: 'User updated successfully',
      USER_DELETED: 'User deleted successfully',
    },
    ERROR: {
      FETCH_FAILED: 'Failed to fetch users',
      CREATE_FAILED: 'Failed to create user',
      UPDATE_FAILED: 'Failed to update user',
      DELETE_FAILED: 'Failed to delete user',
      INVALID_DATA: 'Invalid data provided',
    },
    CONFIRM: {
      DELETE_USER: 'Are you sure you want to delete this user?',
      UNSAVED_CHANGES: 'You have unsaved changes. Do you want to leave?',
    },
  },

  // UI Labels & Buttons
  UI: {
    BUTTONS: {
      ADD_USER: 'Add User',
      EDIT_USER: 'Edit User',
      BACK: 'Back',
      CANCEL: 'Cancel',
      SAVE: 'Save',
    },
    LABELS: {
      FIRST_NAME: 'First name',
      LAST_NAME: 'Last name',
      EMAIL: 'Email address',
      PHONE: 'Phone number',
      UPLOAD_IMAGE: 'Upload Image',
    },
    PLACEHOLDERS: {
      FIRST_NAME: 'John',
      LAST_NAME: 'Doe',
      EMAIL: 'john.doe@company.com',
      PHONE: '1234567890',
    },
    VALIDATION_MESSAGES: {
      REQUIRED: 'is required',
      MIN_LENGTH: 'must be at least',
      CHARACTERS: 'characters',
      VALID_EMAIL: 'Please enter a valid email address',
      PHONE_DIGITS: 'Phone number must be 10-15 digits',
    },
  },

  // Images
  FORM_IMAGES: {
    PLACEHOLDER_PROFILE: 'https://placehold.co/400x400/e2e8f0/64748b?text=Upload+Image',
  },

  // API
  API: {
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
  },
};

export const ROUTE_MODES = {
  ADD: 'add',
  EDIT: 'edit',
  VIEW: 'view',
} as const;

export type RouteMode = (typeof ROUTE_MODES)[keyof typeof ROUTE_MODES];
