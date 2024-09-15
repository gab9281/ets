import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import pluginChecker from 'vite-plugin-checker';
import EnvironmentPlugin from 'vite-plugin-environment';

// https://vitejs.dev/config/
export default defineConfig({
    base: "/",
    plugins: [
        react(),
        pluginChecker({ typescript: true }),
        EnvironmentPlugin('all'),
    ],
    preview: {
        port: 5173,
        strictPort: true
    },
    server: {
     port: 5173,
     strictPort: true,
     host: true,
     origin: "http://0.0.0.0:5173",
    },
});
