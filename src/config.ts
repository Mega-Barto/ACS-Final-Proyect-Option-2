// API configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Other app constants
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Product Management System';

// Validation constants
export const PASSWORD_MIN_LENGTH = Number(import.meta.env.VITE_PASSWORD_MIN_LENGTH) || 8;
export const PASSWORD_REGEX = new RegExp(import.meta.env.VITE_PASSWORD_REGEX);
export const PASSWORD_REQUIREMENTS = 'Password must be at least 8 characters long and include at least one uppercase letter and one number.';