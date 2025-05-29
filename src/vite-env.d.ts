/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_AUTH_TOKEN_EXPIRY: string;
  readonly VITE_PASSWORD_MIN_LENGTH: string;
  readonly VITE_PASSWORD_REGEX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
