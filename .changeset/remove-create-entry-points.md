---
'@smooai/utils': major
---

BREAKING: Remove `create-entry-points` CLI. Repos that depended on it should freeze their entry list manually in `tsdown.config.ts` + `package.json` exports. `@smooai/file` migrated in its own PR. Other SmooAI repos never used it.

Also drops the `@oclif/core`, `@oclif/plugin-help`, `@oclif/plugin-plugins`, and `glob` dependencies, which were only used by `create-entry-points`.
