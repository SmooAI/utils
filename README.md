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

**The foundation that eliminates boilerplate** - Battle-tested utilities that handle the repetitive tasks so you can focus on building features, not infrastructure.

![NPM Version](https://img.shields.io/npm/v/%40smooai%2Futils?style=for-the-badge)
![NPM Downloads](https://img.shields.io/npm/dw/%40smooai%2Futils?style=for-the-badge)
![NPM Last Update](https://img.shields.io/npm/last-update/%40smooai%2Futils?style=for-the-badge)

![GitHub License](https://img.shields.io/github/license/SmooAI/utils?style=for-the-badge)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/SmooAI/utils/release.yml?style=for-the-badge)
![GitHub Repo stars](https://img.shields.io/github/stars/SmooAI/utils?style=for-the-badge)

### Why @smooai/utils?

Ever found yourself writing the same error handler for the 50th time? Debugging Lambda functions without proper request tracking? Wrestling with phone number validation that works everywhere except production? You're not alone.

**We built @smooai/utils because we were tired of:**

- 🔁 Copy-pasting the same utility functions across projects
- 🐛 Inconsistent error handling breaking production deploys
- 🔍 Losing request context across AWS services
- 📱 Phone numbers failing validation in different formats
- 🗺️ HTTP headers losing their case-sensitivity battles
- 🎯 Writing custom validators for every data type

**Now, with one package, you get:**

- ✅ Production-tested utilities used across all SmooAI services
- ✅ Type-safe implementations with full TypeScript support
- ✅ AWS Lambda integration that just works
- ✅ Human-readable error messages your team will thank you for
- ✅ Zero configuration needed - sensible defaults out of the box

### Install

```sh
pnpm add @smooai/utils
```

## Real-World Solutions

### 🚀 Lambda Error Handling That Actually Works

Stop writing try-catch blocks in every Lambda function. Our battle-tested `apiHandler` does it all:

```typescript
import { apiHandler } from '@smooai/utils';

// Before: Boilerplate everywhere
export const handler = async (event, context) => {
    try {
        // Parse body
        // Validate input
        // Handle errors
        // Format response
        // Log everything
    } catch (error) {
        // More error handling
    }
};

// After: Focus on your logic
export const handler = apiHandler(async (event, context) => {
    const user = await createUser(event.body);
    return { statusCode: 201, body: user };
});
// Automatic error handling, logging, and response formatting ✨
```

### 🎯 Validation With Human-Readable Errors

Your users (and your support team) deserve better than "ValidationError at path[0].nested.field":

```typescript
import { handleSchemaValidation, HumanReadableSchemaError } from '@smooai/utils';

const userSchema = z.object({
    email: z.string().email(),
    phone: validateAndTransformPhoneNumber,
    age: z.number().min(18),
});

try {
    const user = handleSchemaValidation(userSchema, data);
    // user.phone is guaranteed to be E.164 format: +12125551234
} catch (error) {
    if (error instanceof HumanReadableSchemaError) {
        console.log(error.humanReadableMessage);
        // "Email must be a valid email address. Phone must be a valid phone number. Age must be at least 18."
    }
}
```

### 🔍 Case-Insensitive Collections for HTTP Headers

Because `Content-Type`, `content-type`, and `CONTENT-TYPE` should all just work:

```typescript
import { CaseInsensitiveMap } from '@smooai/utils';

const headers = new CaseInsensitiveMap([
    ['Content-Type', 'application/json'],
    ['X-API-KEY', 'secret'],
]);

headers.get('content-type'); // 'application/json' ✅
headers.has('X-Api-Key'); // true ✅
headers.get('CONTENT-TYPE'); // 'application/json' ✅
```

### 🏭 Production-Ready Hono Apps for Lambda

Set up a fully-configured API with one line:

```typescript
import { createAwsLambdaHonoApp } from '@smooai/utils';

const app = createAwsLambdaHonoApp();

app.get('/health', (c) => c.json({ status: 'healthy' }));

app.post('/users', async (c) => {
    // Automatic request ID tracking
    // Built-in error handling
    // Pretty JSON in development
    const user = await createUser(await c.req.json());
    return c.json(user, 201);
});

export const handler = handle(app);
```

### 📁 Smart File Discovery

Find configuration files without hardcoding paths:

```typescript
import { findFile } from '@smooai/utils';

// Searches up the directory tree until it finds the file
const configPath = await findFile('smoo.config.json');
const packageJson = await findFile('package.json');

// Perfect for:
// - Finding project root
// - Loading environment-specific configs
// - Locating test fixtures
```

### 🌍 Environment Detection Made Simple

```typescript
import { isRunningInProd, isRunningLocally } from '@smooai/utils';

if (isRunningLocally()) {
    // Enable debug logging
    // Use local database
    // Show detailed errors
}

if (isRunningInProd()) {
    // Use production services
    // Enable monitoring
    // Sanitize error messages
}
```

## More Powerful Examples

### 🛡️ Type-Safe Error Handling

Transform cryptic errors into actionable messages:

```typescript
import { ApiError, errorHandler } from '@smooai/utils';

const processPayment = errorHandler(
    async (orderId: string) => {
        // Throws ApiError with 404 status
        if (!order) throw new ApiError('Order not found', 404);

        // Validation errors become 400s with details
        const validated = handleSchemaValidation(schema, data);

        // Unexpected errors are logged and sanitized
        return await chargeCard(order);
    },
    {
        logger: console,
        onError: (error) => notifyOps(error),
    },
);
```

### ⏱️ Smart Async Utilities

```typescript
import { sleep } from '@smooai/utils';

// Rate limiting made easy
for (const batch of batches) {
    await processBatch(batch);
    await sleep(1000); // Wait 1 second between batches
}

// Retry with exponential backoff
async function retryWithBackoff(fn, attempts = 3) {
    for (let i = 0; i < attempts; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === attempts - 1) throw error;
            await sleep(Math.pow(2, i) * 1000);
        }
    }
}
```

### 📞 Phone Number Validation That Works Globally

```typescript
import { validateAndTransformPhoneNumber } from '@smooai/utils';

// Accepts multiple formats, outputs E.164
const phoneSchema = z.object({
    phone: validateAndTransformPhoneNumber,
});

phoneSchema.parse({ phone: '(212) 555-1234' });
// ✅ { phone: '+12125551234' }

phoneSchema.parse({ phone: '+44 20 7946 0958' });
// ✅ { phone: '+442079460958' }

phoneSchema.parse({ phone: '555-1234' });
// ❌ Throws: "Phone must be a valid phone number"
```

## Built for Production

Every utility in this package is:

- 🔒 **Type-safe** - Full TypeScript support with strict types
- ⚡ **Performance tested** - Optimized for real-world usage
- 📊 **Battle-tested** - Used in production at SmooAI
- 📚 **Well-documented** - Clear examples and use cases
- 🔄 **Maintained** - Regular updates and improvements

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

Brent Rager

- [Email](mailto:brent@smoo.ai)
- [LinkedIn](https://www.linkedin.com/in/brentrager/)
- [BlueSky](https://bsky.app/profile/brentragertech.bsky.social)
- [TikTok](https://www.tiktok.com/@brentragertech)
- [Instagram](https://www.instagram.com/brentragertech/)

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
