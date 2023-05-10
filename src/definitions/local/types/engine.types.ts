export type EngineParams = {
  name?: string;

  webServer?: string;

  accessToken?: string;

  environment?: 'prod' | 'dev';

  apiEndpoint?: string;

  /* client side only */
  syncPlayers?: boolean;

  syncPlayerUpdates?: boolean;

  syncPlayerControls?: boolean;

  syncCameraPosition?: boolean;
};
