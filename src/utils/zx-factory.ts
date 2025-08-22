import { $ } from 'zx';

// Base zx instance with configuration
export const $$ = $({
    verbose: false,
});

// Quiet zx instance for silent operations
export const $$quiet = $({ quiet: true });

// Factory function to create zx instances with custom options
export function createZxInstance(options: { cwd?: string; quiet?: boolean; verbose?: boolean } = {}) {
    return $({
        verbose: options.verbose ?? false,
        quiet: options.quiet ?? false,
        ...options,
    });
}

// Common patterns
export const $$cwd = (cwd: string) => createZxInstance({ cwd });
export const $$quietCwd = (cwd: string) => createZxInstance({ cwd, quiet: true });
