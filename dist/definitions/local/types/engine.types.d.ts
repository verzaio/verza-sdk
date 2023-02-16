export type EngineParams = {
    name?: string;
    webServer?: string;
    accessToken?: string;
    environment?: 'prod' | 'dev';
    apiEndpoint?: string;
    syncPlayers?: boolean;
    syncPlayerUpdatesPriority?: boolean;
    syncPlayerUpdates?: boolean;
    syncPlayerControls?: boolean;
    syncCameraPosition?: boolean;
};
