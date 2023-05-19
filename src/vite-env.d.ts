/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly SimplePeer: any;
  }
}
