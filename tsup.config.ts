import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
    entry: [
        'src/index.ts',
        'src/validation/standardSchema.ts',
        'src/validation/phoneNumber.ts',
        'src/utils/sleep.ts',
        'src/scripts/createEntryPoints.ts',
        'src/file/findFile.ts',
        'src/error/errorHandler.ts',
        'src/env/index.ts',
        'src/collections/CaseInsensitiveSet.ts',
        'src/collections/CaseInsensitiveMap.ts',
        'src/api/sqsHandler.ts',
        'src/api/hono.ts',
        'src/api/apiHandler.ts',
        'src/api/ApiError.ts',
    ],
    clean: true,
    dts: true,
    format: ['cjs', 'esm'],
    sourcemap: true,
    target: 'es2022',
    treeshake: true,
    ...options,
}));
