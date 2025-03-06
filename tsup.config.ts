import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
    entry: ['src/sleep.ts','src/phoneNumber.ts','src/hono.ts','src/findFile.ts','src/errorHandler.ts','src/env.ts','src/apiHandler.ts','src/CaseInsensitiveSet.ts','src/CaseInsensitiveMap.ts','src/ApiError.ts','src/scripts/createEntryPoints.ts'],
    clean: true,
    dts: false, // Turned off due to issues with @supabase/supabase-js/lib/types because of tyepof fetch and an error about it being private.
    format: ['cjs'],
    sourcemap: true,
    target: 'es2022',
    treeShaking: true,
    ...options,
}));
