// src/global.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL?: string; // add your vars
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
declare global {
  interface Window {
    __G?: { moves: unknown[]; boardSize: number };
  }
}
export {};
