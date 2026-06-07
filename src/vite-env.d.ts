/// <reference types="vite/client" />

// Environment variables type definitions
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// CSS modules - using unique export names to avoid conflicts
declare module '*.module.css' {
  const cssClasses: { readonly [key: string]: string };
  export default cssClasses;
}

declare module '*.module.scss' {
  const scssClasses: { readonly [key: string]: string };
  export default scssClasses;
}

// Image declarations - using different variable names
declare module '*.svg' {
  const svgContent: string;
  export default svgContent;
}

declare module '*.png' {
  const pngContent: string;
  export default pngContent;
}

declare module '*.jpg' {
  const jpgContent: string;
  export default jpgContent;
}

declare module '*.jpeg' {
  const jpegContent: string;
  export default jpegContent;
}

declare module '*.gif' {
  const gifContent: string;
  export default gifContent;
}

declare module '*.webp' {
  const webpContent: string;
  export default webpContent;
}

// Audio declarations
declare module '*.mp3' {
  const mp3Content: string;
  export default mp3Content;
}

declare module '*.wav' {
  const wavContent: string;
  export default wavContent;
}

// Global window interface
interface Window {
  __INITIAL_STATE__?: unknown;
  gtag?: (...args: unknown[]) => void;
}