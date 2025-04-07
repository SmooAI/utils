import { readFileSync, writeFileSync } from 'node:fs';
import { Config } from '@oclif/core';
import { globSync } from 'glob';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UpdateTsupConfig } from './createEntryPoints';

// Mock the node:fs module
vi.mock('node:fs', () => ({
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
}));

// Mock the glob module
vi.mock('glob', () => ({
    globSync: vi.fn(),
}));

// Mock @oclif/core Config
vi.mock('@oclif/core', () => ({
    Command: class {
        static run = vi.fn();
        static flags = {};
        async run() {}
        parse() {
            return Promise.resolve({ flags: { include: [], ignore: [] } });
        }
        error(message: string) {
            throw new Error(message);
        }
        log(message: string) {
            console.log(message);
        }
    },
    Flags: {
        string: () => ({}),
    },
    Config: {
        load: () =>
            Promise.resolve({
                root: '/path/to/root',
                pjson: {
                    name: 'test-cli',
                    version: '1.0.0',
                },
            }),
    },
}));

describe('UpdateTsupConfig', () => {
    let command: UpdateTsupConfig;

    beforeEach(async () => {
        command = new UpdateTsupConfig([], await Config.load());
        vi.clearAllMocks();
    });

    describe('generateExportsConfig', () => {
        it('should generate correct exports for root-level files', () => {
            const files = ['src/example.ts'];
            const exports = command['generateExportsConfig'](files);

            expect(exports).toEqual({
                './example': {
                    types: './dist/example.d.ts',
                    import: './dist/example.mjs',
                    require: './dist/example.js',
                    default: './dist/example.js',
                },
            });
        });

        it('should generate correct exports for nested folder files', () => {
            const files = ['src/utils/helpers.ts'];
            const exports = command['generateExportsConfig'](files);

            expect(exports).toEqual({
                './utils/helpers': {
                    types: './dist/utils/helpers.d.ts',
                    import: './dist/utils/helpers.mjs',
                    require: './dist/utils/helpers.js',
                    default: './dist/utils/helpers.js',
                },
            });
        });

        it('should handle multiple files in different locations', () => {
            const files = ['src/index.ts', 'src/utils/helpers.ts', 'src/components/Button.ts'];
            const exports = command['generateExportsConfig'](files);

            expect(exports).toEqual({
                '.': {
                    types: './dist/index.d.ts',
                    import: './dist/index.mjs',
                    require: './dist/index.js',
                    default: './dist/index.js',
                },
                './utils/helpers': {
                    types: './dist/utils/helpers.d.ts',
                    import: './dist/utils/helpers.mjs',
                    require: './dist/utils/helpers.js',
                    default: './dist/utils/helpers.js',
                },
                './components/Button': {
                    types: './dist/components/Button.d.ts',
                    import: './dist/components/Button.mjs',
                    require: './dist/components/Button.js',
                    default: './dist/components/Button.js',
                },
            });
        });

        it('should include root exports for index files', () => {
            const files = ['src/index.ts', 'src/utils/index.ts'];
            const exports = command['generateExportsConfig'](files);

            expect(exports).toEqual({
                '.': {
                    types: './dist/index.d.ts',
                    import: './dist/index.mjs',
                    require: './dist/index.js',
                    default: './dist/index.js',
                },
            });
        });

        it('should handle deeply nested files', () => {
            const files = ['src/components/forms/validation/rules.ts'];
            const exports = command['generateExportsConfig'](files);

            expect(exports).toEqual({
                './components/forms/validation/rules': {
                    types: './dist/components/forms/validation/rules.d.ts',
                    import: './dist/components/forms/validation/rules.mjs',
                    require: './dist/components/forms/validation/rules.js',
                    default: './dist/components/forms/validation/rules.js',
                },
            });
        });
    });

    describe('run', () => {
        it('should update tsup.config.ts and package.json', async () => {
            const mockFiles = ['src/example.ts', 'src/utils/helpers.ts'];
            const mockTsupConfig = 'export default { entry: [], }';
            const mockPackageJson = '{"name": "test", "exports": {}}';

            (globSync as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockFiles);
            (readFileSync as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce(mockTsupConfig).mockReturnValueOnce(mockPackageJson);

            await command.run();

            expect(writeFileSync).toHaveBeenCalledTimes(2);

            // Verify tsup.config.ts update
            expect(writeFileSync).toHaveBeenCalledWith('tsup.config.ts', expect.stringContaining("entry: ['src/example.ts','src/utils/helpers.ts']"));

            // Verify package.json update
            expect(writeFileSync).toHaveBeenCalledWith('package.json', expect.stringContaining('"exports"'));
        });

        it('should handle entry points all in src/ directory', async () => {
            const mockFiles = ['src/component1.ts', 'src/component2.ts', 'src/component3.ts'];
            const mockTsupConfig = 'export default { entry: [], }';
            const mockPackageJson = '{"name": "test", "exports": {}}';

            (globSync as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockFiles);
            (readFileSync as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce(mockTsupConfig).mockReturnValueOnce(mockPackageJson);

            await command.run();

            expect(writeFileSync).toHaveBeenCalledTimes(2);

            // Verify tsup.config.ts update
            expect(writeFileSync).toHaveBeenCalledWith(
                'tsup.config.ts',
                expect.stringContaining("entry: ['src/component1.ts','src/component2.ts','src/component3.ts']"),
            );

            // Verify package.json update
            const packageJsonCall = (writeFileSync as unknown as ReturnType<typeof vi.fn>).mock.calls[1][1];
            const updatedPackageJson = JSON.parse(packageJsonCall);

            expect(updatedPackageJson).toEqual({
                name: 'test',
                exports: {
                    './component1': {
                        types: './dist/component1.d.ts',
                        import: './dist/component1.mjs',
                        require: './dist/component1.js',
                        default: './dist/component1.js',
                    },
                    './component2': {
                        types: './dist/component2.d.ts',
                        import: './dist/component2.mjs',
                        require: './dist/component2.js',
                        default: './dist/component2.js',
                    },
                    './component3': {
                        types: './dist/component3.d.ts',
                        import: './dist/component3.mjs',
                        require: './dist/component3.js',
                        default: './dist/component3.js',
                    },
                },
            });
        });

        it('should set main entry points when src/index.ts exists', async () => {
            const mockFiles = ['src/index.ts', 'src/utils/helpers.ts'];
            const mockTsupConfig = 'export default { entry: [], }';
            const mockPackageJson = '{"name": "test", "exports": {}}';

            (globSync as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockFiles);
            (readFileSync as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce(mockTsupConfig).mockReturnValueOnce(mockPackageJson);

            await command.run();

            // Verify package.json update with main entry points
            const packageJsonCall = (writeFileSync as unknown as ReturnType<typeof vi.fn>).mock.calls[1][1];
            const updatedPackageJson = JSON.parse(packageJsonCall);

            expect(updatedPackageJson).toEqual({
                name: 'test',
                main: './dist/index.js',
                module: './dist/index.mjs',
                types: './dist/index.d.ts',
                exports: {
                    '.': {
                        types: './dist/index.d.ts',
                        import: './dist/index.mjs',
                        require: './dist/index.js',
                        default: './dist/index.js',
                    },
                    './utils/helpers': {
                        types: './dist/utils/helpers.d.ts',
                        import: './dist/utils/helpers.mjs',
                        require: './dist/utils/helpers.js',
                        default: './dist/utils/helpers.js',
                    },
                },
            });
        });

        it('should handle errors gracefully', async () => {
            const error = new Error('Test error');
            (globSync as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
                throw error;
            });

            await expect(command.run()).rejects.toThrow('Error during update: Error: Test error');
        });
    });
});
