<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://smoo.ai">
    <img src="images/logo.png" alt="SmooAI Logo" />
  </a>
</div>

<!-- ABOUT THE PROJECT -->

## About SmooAI

SmooAI is an AI-powered platform for helping businesses multiply their customer, employee, and developer experience.

Learn more on [smoo.ai](https://smoo.ai)

## SmooAI Packages

Check out other SmooAI packages at [npmjs.com/org/smooai](https://www.npmjs.com/org/smooai)

## About @smooai/utils

A collection of shared utilities and tools used across SmooAI projects. This package provides common functionality to standardize and simplify development across all SmooAI repositories.

![NPM Version](https://img.shields.io/npm/v/%40smooai%2Futils?style=for-the-badge)
![NPM Downloads](https://img.shields.io/npm/dw/%40smooai%2Futils?style=for-the-badge)
![NPM Last Update](https://img.shields.io/npm/last-update/%40smooai%2Futils?style=for-the-badge)

![GitHub License](https://img.shields.io/github/license/SmooAI/utils?style=for-the-badge)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/SmooAI/utils/release.yml?style=for-the-badge)
![GitHub Repo stars](https://img.shields.io/github/stars/SmooAI/utils?style=for-the-badge)

### Installation

```sh
pnpm add @smooai/utils
```

### Available Utilities

#### API Handling

- `ApiError` - Custom error class for handling API-specific errors with status codes
- `apiHandler` - Lambda function wrapper for standardized API error handling and responses
- `createAwsLambdaHonoApp` - Factory for creating Hono apps configured for AWS Lambda

#### Collections

- `CaseInsensitiveMap` - Map implementation with case-insensitive string keys
- `CaseInsensitiveSet` - Set implementation with case-insensitive string values

#### Error Handling

- `errorHandler` - Generic error handler with logging and type-specific error processing

#### File Operations

- `findFile` - Async utility to find files in parent directories
- `findFileSync` - Synchronous version of findFile

#### Environment

- `isRunningLocally` - Check if code is running in local development
- `isRunningInProd` - Check if code is running in production

#### Data Validation

- `validateAndTransformPhoneNumber` - Zod validator for phone numbers with E.164 formatting
- `handleSchemaValidation` - Type-safe validator for Standard Schema with human-readable error messages
- `formatStandardSchemaErrorToHumanReadable` - Formats Standard Schema validation issues into readable messages
- `HumanReadableSchemaError` - Error class that wraps Standard Schema validation errors with human-readable messages

#### Utilities

- `sleep` - Promise-based delay function

### Features

- AWS Lambda integration
- Standardized error handling
- Case-insensitive collections
- File system utilities
- Environment detection
- Data validation tools
- HTTP request handling with Hono

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Testing

```sh
pnpm test
```

### Linting

```sh
pnpm lint
```

## Contributing

We're currently developing our contribution processes. If you're interested in contributing to this package or have questions, please reach out to us through the contact information below.

<!-- CONTACT -->

## Contact

Brent Rager - [Email](mailto:brent@smoo.ai)
[Instagram](https://www.instagram.com/brentragertech/)
[LinkedIn](https://www.linkedin.com/in/brentrager/)
[Threads](https://www.threads.net/@brentragertech)

Smoo Github: [https://github.com/SmooAI](https://github.com/SmooAI)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[sst.dev-url]: https://reactjs.org/
[sst]: https://img.shields.io/badge/sst-EDE1DA?style=for-the-badge&logo=sst&logoColor=E27152
[sst-url]: https://sst.dev/
[next]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[aws]: https://img.shields.io/badge/aws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white
[aws-url]: https://tailwindcss.com/
[tailwindcss]: https://img.shields.io/badge/tailwind%20css-0B1120?style=for-the-badge&logo=tailwindcss&logoColor=#06B6D4
[tailwindcss-url]: https://tailwindcss.com/
[zod]: https://img.shields.io/badge/zod-3E67B1?style=for-the-badge&logoColor=3E67B1
[zod-url]: https://zod.dev/
[sanity]: https://img.shields.io/badge/sanity-F36458?style=for-the-badge
[sanity-url]: https://www.sanity.io/
[vitest]: https://img.shields.io/badge/vitest-1E1E20?style=for-the-badge&logo=vitest&logoColor=#6E9F18
[vitest-url]: https://vitest.dev/
[pnpm]: https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white
[pnpm-url]: https://pnpm.io/
[turborepo]: https://img.shields.io/badge/turborepo-000000?style=for-the-badge&logo=turborepo&logoColor=#EF4444
[turborepo-url]: https://turbo.build/
