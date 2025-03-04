import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// Use dynamic import for ESM compatibility
export default defineConfig(async () => ({
    plugins: [await tsconfigPaths()],
}));
