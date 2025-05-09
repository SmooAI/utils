import { readFileSync, writeFileSync } from 'node:fs';
import { Command, Flags } from '@oclif/core';
import { globSync } from 'glob';

export default class UpdateTsupConfig extends Command {
    static description = 'Update tsup.config.ts entry field and package.json exports based on provided patterns';

    static flags = {
        include: Flags.string({
            name: 'include',
            char: 'i',
            description: 'Glob pattern(s) to include',
            multiple: true,
            required: true,
        }),
        ignore: Flags.string({
            name: 'ignore',
            char: 'x',
            description: 'Glob pattern(s) to ignore',
            multiple: true,
            required: false,
        }),
    };

    private generateExportsConfig(files: string[]) {
        const exports: Record<string, unknown> = {};

        // Add root exports if src/index.ts exists
        if (files.includes('src/index.ts')) {
            exports['.'] = {
                types: './dist/index.d.ts',
                import: './dist/index.mjs',
                require: './dist/index.js',
                default: './dist/index.js',
            };
        }

        exports['./*'] = {
            types: './dist/*.d.ts',
            import: './dist/*.mjs',
            require: './dist/*.js',
        };

        return exports;
    }

    async run() {
        const { flags } = await this.parse(UpdateTsupConfig);
        const includePatterns = flags.include;
        const defaultIgnore = ['**/*.spec.ts', '**/*.test.ts', '**/*.d.ts'];
        const ignorePatterns = [...defaultIgnore, ...(flags.ignore || [])];

        try {
            const files = globSync(includePatterns, { ignore: ignorePatterns });

            // Update tsup.config.ts
            let tsupFile = readFileSync('tsup.config.ts', 'utf-8');
            tsupFile = tsupFile.replace(/entry: \[[^\]]*\],/, `entry: [${files.map((file) => `'${file}'`).join(',')}],`);
            writeFileSync('tsup.config.ts', tsupFile);
            this.log('Updated tsup.config.ts successfully.');

            // Update package.json
            const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
            const exports = this.generateExportsConfig(files);

            // If we have src/index.ts, set the main entry points
            if (files.includes('src/index.ts')) {
                packageJson.main = './dist/index.js';
                packageJson.module = './dist/index.mjs';
                packageJson.types = './dist/index.d.ts';
            }

            packageJson.exports = exports;
            writeFileSync('package.json', JSON.stringify(packageJson, null, 4) + '\n');
            this.log('Updated package.json exports successfully.');
        } catch (error) {
            this.error(`Error during update: ${error}`);
        }
    }
}

export { UpdateTsupConfig };

if (require.main === module) {
    UpdateTsupConfig.run();
} else {
    UpdateTsupConfig.run();
}
