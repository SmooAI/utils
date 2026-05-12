---
'@smooai/utils': patch
---

SMOODEV-928: Bump `@smooai/logger` to `^4.1.4` to pick up the ESM `__filename` TDZ fix. Prior runtime range pulled logger 3.x, which crashed under tsx-run consumers in the smooai monorepo due to const TDZ on `__dirname`/`__filename`.
