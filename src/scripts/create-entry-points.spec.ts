import { readFileSync, writeFileSync } from 'node:fs';
import { Config } from '@oclif/core';
import { globSync } from 'glob';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UpdateTsupConfig } from './create-entry-points';

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
        it('should generate correct exports with wildcard pattern', () => {
            const files = ['src/example.ts'];
            const exports = command['generateExportsConfig'](files);

            expect(exports).toEqual({
                './*': {
                    types: './dist/*.d.ts',
                    import: './dist/*.mjs',
                    require: './dist/*.js',
                },
            });
        });

        it('should include root exports when index.ts exists', () => {
            const files = ['src/index.ts', 'src/utils/helpers.ts'];
            const exports = command['generateExportsConfig'](files);

            expect(exports).toEqual({
                '.': {
                    types: './dist/index.d.ts',
                    import: './dist/index.mjs',
                    require: './dist/index.js',
                    default: './dist/index.js',
                },
                './*': {
                    types: './dist/*.d.ts',
                    import: './dist/*.mjs',
                    require: './dist/*.js',
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
            const packageJsonCall = (writeFileSync as unknown as ReturnType<typeof vi.fn>).mock.calls[1][1];
            const updatedPackageJson = JSON.parse(packageJsonCall);

            expect(updatedPackageJson).toEqual({
                name: 'test',
                exports: {
                    './*': {
                        types: './dist/*.d.ts',
                        import: './dist/*.mjs',
                        require: './dist/*.js',
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
                    './*': {
                        types: './dist/*.d.ts',
                        import: './dist/*.mjs',
                        require: './dist/*.js',
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
