---
'@smooai/utils': patch
---

Add Standard Schema validation utilities

- Introduced `handleSchemaValidation` for type-safe validation with human-readable error messages.
- Added `formatStandardSchemaErrorToHumanReadable` to format validation issues.
- Created `HumanReadableSchemaError` class to wrap schema errors with user-friendly messages.
- Updated `README.md` to document new validation functions.
- Added tests for the new validation utilities in `standardSchema.spec.ts`.
