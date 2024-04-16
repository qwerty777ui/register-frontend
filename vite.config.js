import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { fileURLToPath } from "node:url";

const url = new URL('./src', import.meta.url);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        svgr({
            svgrOptions: {
                // svgr options
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(url)
        }
    }
})
