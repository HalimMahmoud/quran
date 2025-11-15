/// <reference types="vite/client" />

declare module "virtual:pwa-register" {
  export interface RegisterSWOptions {
    onNeedRefresh?: (updateSW: (reloadPage?: boolean) => void) => void;
    onOfflineReady?: () => void;
  }

  export function registerSW(
    options?: RegisterSWOptions
  ): (reloadPage?: boolean) => void;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}
