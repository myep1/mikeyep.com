// src/env.d.ts  (add this file for Vite env typing)
interface ImportMetaEnv {
  readonly VITE_DEPLOY_TIMESTAMP?: string;
  readonly VITE_DEPLOY_TYPE?: string;
  readonly VITE_HACKER_TYPER?: string; // "true" | "false"
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
