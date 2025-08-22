# @smooai/utils

## 1.2.25

### Patch Changes

- cc5c62f: Update smoo logger.
- 918a5ad: Improve response and duration logging.

## 1.2.24

### Patch Changes

- 277c20c: Fix namespace in hono app.

## 1.2.23

### Patch Changes

- 64192bf: Add generate-jira-git-branch.
- 64192bf: Update smoo logger.

## 1.2.22

### Patch Changes

- d532d91: Remove generate-git-branch hashbang.

## 1.2.21

### Patch Changes

- 724afde: Fix generate-git-branch pulling from main.

## 1.2.20

### Patch Changes

- 71969f6: Fix generate-git-branch bin.

## 1.2.19

### Patch Changes

- f5b0249: Fix hono logger to have more context.
- f5b0249: Add utility for using AI to generate branch name, and improve hono logging.
- f5b0249: Fix generate-git-branch bin.

## 1.2.18

### Patch Changes

- 7bb8625: Fix hono logger to have more context.
- 7bb8625: Add utility for using AI to generate branch name, and improve hono logging.

## 1.2.17

### Patch Changes

- df71a28: Fix hono logger to have more context.

## 1.2.16

### Patch Changes

- 7d42720: Fix hono error handler.

## 1.2.15

### Patch Changes

- 59f43bc: Fixed sqsHandler so it is itself not async.

## 1.2.14

### Patch Changes

- 73a1151: Fixed addHonoMiddleware.

## 1.2.13

### Patch Changes

- 36ba26f: Fix createHonoAwsLambdaHandler.

## 1.2.12

### Patch Changes

- 42bb4fd: Making it easier type wise to accept Hono apps.

## 1.2.11

### Patch Changes

- 02136e9: Updated readme and improved hono app handling.

## 1.2.10

### Patch Changes

- 429ada4: Update dependencies.

## 1.2.9

### Patch Changes

- 444f6c0: Update smoo dependencies.

## 1.2.8

### Patch Changes

- 7d6e6d9: Fix false local environment.

## 1.2.7

### Patch Changes

- 18e0148: Return string from validateAndTransformPhoneNumber instead of E164Number from libphonenumber-js.

## 1.2.6

### Patch Changes

- a0bf296: Fix tree shaking.

## 1.2.5

### Patch Changes

- a86cd4b: Change env export to index.ts so we don't have to import env/env.

## 1.2.4

### Patch Changes

- 7fca148: Updated dependency.
- 7fca148: Added handleSchemaValidationSync.

## 1.2.3

### Patch Changes

- f34c98c: Updated dependency.

## 1.2.2

### Patch Changes

- c581cb3: Add isRunningInBrowser.

## 1.2.1

### Patch Changes

- 132d299: Fixed sqsHandler and updated createEntryPoints to have wildcard exports intead of discrete as well as adding typesVersions to package.json.

## 1.2.0

### Minor Changes

- a9f0f2b: Add root index.ts.
- a9f0f2b: Added sqsHandler and fixed env.ts.

## 1.1.0

### Minor Changes

- 38b73ed: Add root index.ts.

## 1.0.21

### Patch Changes

- 36a4545: Update prettier plugins.

## 1.0.20

### Patch Changes

- f6407cb: Updated all vite dependencies.

## 1.0.19

### Patch Changes

- 3d2006b: Add Standard Schema validation utilities

    - Introduced `handleSchemaValidation` for type-safe validation with human-readable error messages.
    - Added `formatStandardSchemaErrorToHumanReadable` to format validation issues.
    - Created `HumanReadableSchemaError` class to wrap schema errors with user-friendly messages.
    - Updated `README.md` to document new validation functions.
    - Added tests for the new validation utilities in `standardSchema.spec.ts`.

- 3d2006b: Fix createEntryPoints to export index correctly.

## 1.0.18

### Patch Changes

- 476cbf6: Fix createEntryPoints to export index correctly.

## 1.0.17

### Patch Changes

- b57b012: Upgrade node types to v22.

## 1.0.16

### Patch Changes

- 09c5d63: Upgraded to Node 22.

## 1.0.15

### Patch Changes

- 529410b: Update dependencies.
- 529410b: Update to working @smooai/logger.

## 1.0.14

### Patch Changes

- 98abe00: Fixed createEntryPoints for certain edge cases and added support for src/index.ts.
- 36d3fea: Fix chicken and egg build issue.

## 1.0.13

### Patch Changes

- 36a54ca: Fix createEntryPoints for files directly in src/.

## 1.0.12

### Patch Changes

- e671f67: Remove logging in createEntryPoints.

## 1.0.11

### Patch Changes

- 6e075cf: Change to using changeset publish.

## 1.0.10

### Patch Changes

- 8e1ead4: Fix github releases.

## 1.0.9

### Patch Changes

- 5bc4784: Adjust changeset access.

## 1.0.8

### Patch Changes

- 488da3e: Fix pnpm publish.

## 1.0.7

### Patch Changes

- 40ff3ee: Add permissions to kickoff GitHub action again.

## 1.0.6

### Patch Changes

- 91f7433: Add permissions for github release to release action.

## 1.0.5

### Patch Changes

- f6cc058: Fix github releases on changeset release.

## 1.0.4

### Patch Changes

- 828e873: Fixed createEntryPoints for this package.

## 1.0.3

### Patch Changes

- 2e9a19f: Updated createEntryPoints so it points import to .mjs.

## 1.0.2

### Patch Changes

- e787995: Update author / bugs / homepage.

## 1.0.1

### Patch Changes

- a3e04ff: Added create-entry-points bin script and changed that script to set package.jsone export entry points.
- f9d4712: Fix lockfile.

## 0.0.1

### Patch Changes

- 9fbb1eb: Update @smooai/logger.
- 36288e1: Update to be similar to @smooai/logger.
- 66f3035: Add proper package exports.
- 6c19d9b: Fix git hooks and typings.
- 66f3035: Update @smooai/logger.
- fa96ced: Fix CI.
