import { defineConfig, loadEnv, type HttpProxy, type ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'
import type * as http from 'node:http'

/**
 * A proxy is needed to make requests to the digitransit API.
 *
 * The API requires an authentication token, which we do not want to
 * expose in the frontend code. Also CORS typically prevents us from making
 * requests directly to other domains from the browser, why a local proxy
 * is needed.
 *
 * See https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/middlewares/proxy.ts
 *
 * @param apiKey The digitransit subscription key
 * @returns A proxy configuration object
 */
const digitransitProxy = (apiKey: string): ProxyOptions => ({
    target: 'https://api.digitransit.fi',
    changeOrigin: true,

    configure: (proxy: HttpProxy.ProxyServer) => {
        // adds the authentication headers to proxied requests
        proxy.on('proxyReq', (proxyReq: http.ClientRequest) => {
            // Add authentication header
            proxyReq.setHeader('digitransit-subscription-key', apiKey);
        });
    }
});

// See https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    if (!env.VITE_DIGITRANSIT_SUBSCRIPTION_KEY) {
        throw new Error('Missing VITE_DIGITRANSIT_SUBSCRIPTION_KEY environment variable');
    }

    return {
        plugins: [react()],

        server: {
            proxy: {
                '/routing': digitransitProxy(env.VITE_DIGITRANSIT_SUBSCRIPTION_KEY),
                '/geocoding': digitransitProxy(env.VITE_DIGITRANSIT_SUBSCRIPTION_KEY)
            }
        }
    }
});

