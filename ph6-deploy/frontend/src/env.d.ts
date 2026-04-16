// src/env.d.ts
// Vite environment variable types — tech contract 1.4

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ImportMeta {
  readonly env: ImportMetaEnv
}
