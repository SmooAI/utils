import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
    entry: [
        'src/validation/phoneNumber.ts',
        'src/utils/sleep.ts',
        'src/scripts/createEntryPoints.ts',
        'src/file/findFile.ts',
        'src/error/errorHandler.ts',
        'src/env/env.ts',
        'src/collections/CaseInsensitiveSet.ts',
        'src/collections/CaseInsensitiveMap.ts',
        'src/api/hono.ts',
        'src/api/apiHandler.ts',
        'src/api/ApiError.ts',
    ],
    clean: true,
    dts: false, // Turned off due to issues with @supabase/supabase-js/lib/types because of tyepof fetch and an error about it being private.
    format: ['cjs'],
    sourcemap: true,
    target: 'es2022',
    treeShaking: true,
    ...options,
}));
