---
'@smooai/utils': patch
---

Migrate build tooling from tsup to tsdown — faster, oxc-based, drop-in replacement. The package now publishes `.cjs`/`.mjs`/`.d.cts`/`.d.mts` outputs (instead of `.js`/`.mjs`/`.d.ts`); the `exports` map is updated accordingly, so subpath imports continue to resolve transparently. No public API change.
