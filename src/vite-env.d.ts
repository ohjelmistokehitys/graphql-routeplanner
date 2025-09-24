/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DIGITRANSIT_SUBSCRIPTION_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
