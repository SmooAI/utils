import { Command, Flags } from '@oclif/core';
import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'glob';
import path from 'path';

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

        files.forEach((file) => {
            const dirname = path.dirname(file).replace('src/', '');
            const basename = path.basename(file, '.ts');

            // Skip index files as they'll be handled separately
            if (basename === 'index') return;

            const exportPath = dirname === '.' ? `./${basename}` : `./${dirname}/${basename}`;

            exports[exportPath] = {
                types: `./dist/${dirname}/${basename}.d.ts`,
                import: `./dist/${dirname}/${basename}.mjs`,
                require: `./dist/${dirname}/${basename}.js`,
                default: `./dist/${dirname}/${basename}.js`,
            };
        });

        return exports;
    }

    async run() {
        const { flags } = await this.parse(UpdateTsupConfig);
        const includePatterns = flags.include;
        const defaultIgnore = ['**/*.spec.ts', '**/*.test.ts', '**/*.d.ts'];
        const ignorePatterns = [...defaultIgnore, ...(flags.ignore || [])];

        try {
            const files = globSync(includePatterns, { ignore: ignorePatterns });
            console.log('Found files:', files);

            // Update tsup.config.ts
            let tsupFile = readFileSync('tsup.config.ts', 'utf-8');
            tsupFile = tsupFile.replace(/entry: \[[^\]]*\],/, `entry: [${files.map((file) => `'${file}'`).join(',')}],`);
            writeFileSync('tsup.config.ts', tsupFile);
            this.log('Updated tsup.config.ts successfully.');

            // Update package.json
            const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
            packageJson.exports = this.generateExportsConfig(files);
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
