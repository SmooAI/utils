<a name="readme-top"></a>

<p align="center">
  <a href="https://smoo.ai"><img src="https://smoo.ai/images/logo/logo.svg" alt="Smoo AI" width="220" /></a>
</p>

<h1 align="center">@smooai/utils</h1>

<p align="center">
  <strong>Battle-tested TypeScript utilities that eliminate the boilerplate — Lambda handlers, human-readable validation, case-insensitive collections, and more.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@smooai/utils"><img src="https://img.shields.io/npm/v/@smooai/utils?style=flat-square&color=00A6A6&label=npm" alt="npm"></a>
  <a href="https://www.npmjs.com/package/@smooai/utils"><img src="https://img.shields.io/npm/dw/@smooai/utils?style=flat-square&color=F49F0A&label=downloads" alt="downloads"></a>
  <img src="https://img.shields.io/badge/Smoo_AI-platform-00A6A6?style=flat-square" alt="Smoo AI">
  <img src="https://img.shields.io/badge/license-MIT-F49F0A?style=flat-square" alt="license">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#install">Install</a> ·
  <a href="#usage">Usage</a> ·
  <a href="#part-of-smoo-ai">Platform</a>
</p>

---

> The foundation utilities that power every Smoo AI service. They handle the repetitive infrastructure work — error handling, request tracking, validation, environment detection — so you focus on features. Type-safe, production-tested, zero configuration.

## ✨ Features <a name="features"></a>

Stop copy-pasting the same utility functions across projects. One package gives you:

- ✅ Production-tested utilities used across every Smoo AI service
- ✅ Type-safe implementations with full TypeScript support
- ✅ AWS Lambda integration that just works
- ✅ Human-readable error messages your support team will thank you for
- ✅ Sensible defaults out of the box — no configuration required

Concretely, that means a battle-tested Lambda `apiHandler`, schema validation that produces human-readable errors, case-insensitive collections for HTTP headers, production-ready Hono apps for Lambda, file discovery, environment detection, type-safe error handling, async helpers, and global phone-number validation.

## 📦 Install <a name="install"></a>

```sh
pnpm add @smooai/utils
```

## 🚀 Usage <a name="usage"></a>

#### 🚀 Lambda error handling

Stop writing try-catch blocks in every Lambda function. The `apiHandler` wrapper handles parsing, validation, error handling, logging, and response formatting:

```typescript
import { apiHandler } from '@smooai/utils';

// Before: boilerplate everywhere
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

// After: focus on your logic
export const handler = apiHandler(async (event, context) => {
    const user = await createUser(event.body);
    return { statusCode: 201, body: user };
});
// Automatic error handling, logging, and response formatting
```

#### 🎯 Validation with human-readable errors

Your users — and your support team — deserve better than `ValidationError at path[0].nested.field`:

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

#### 🔍 Case-insensitive collections for HTTP headers

Because `Content-Type`, `content-type`, and `CONTENT-TYPE` should all just work:

```typescript
import { CaseInsensitiveMap } from '@smooai/utils';

const headers = new CaseInsensitiveMap([
    ['Content-Type', 'application/json'],
    ['X-API-KEY', 'secret'],
]);

headers.get('content-type'); // 'application/json'
headers.has('X-Api-Key'); // true
headers.get('CONTENT-TYPE'); // 'application/json'
```

#### 🏭 Production-ready Hono apps for Lambda

Set up a fully configured API in one line:

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

#### 📁 Smart file discovery

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

#### 🌍 Environment detection

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

#### 🛡️ Type-safe error handling

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

#### ⏱️ Async utilities

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

#### 📞 Global phone-number validation

```typescript
import { validateAndTransformPhoneNumber } from '@smooai/utils';

// Accepts multiple formats, outputs E.164
const phoneSchema = z.object({
    phone: validateAndTransformPhoneNumber,
});

phoneSchema.parse({ phone: '(212) 555-1234' });
// { phone: '+12125551234' }

phoneSchema.parse({ phone: '+44 20 7946 0958' });
// { phone: '+442079460958' }

phoneSchema.parse({ phone: '555-1234' });
// Throws: "Phone must be a valid phone number"
```

## 🔧 Built for production

Every utility in this package is:

- 🔒 **Type-safe** — full TypeScript support with strict types
- ⚡ **Performance tested** — optimized for real-world usage
- 📊 **Battle-tested** — used in production at Smoo AI
- 📚 **Well-documented** — clear examples and use cases
- 🔄 **Maintained** — regular updates and improvements

#### Testing

```sh
pnpm test
```

#### Linting

```sh
pnpm lint
```

## 🧩 Part of Smoo AI <a name="part-of-smoo-ai"></a>

@smooai/utils is part of the [Smoo AI](https://smoo.ai) platform — an AI-powered business platform with AI built into every product. It's the shared foundation under our open-source packages.

- [@smooai/logger](https://github.com/SmooAI/logger) — contextual structured logging
- [@smooai/fetch](https://github.com/SmooAI/fetch) — typed HTTP with retries
- [@smooai/file](https://github.com/SmooAI/file) — stream-first file ops with magic-byte validation
- [@smooai/config](https://github.com/SmooAI/config) — typed config, secrets, and feature flags

Browse the rest at [npmjs.com/org/smooai](https://www.npmjs.com/org/smooai) and [github.com/SmooAI](https://github.com/SmooAI).

## 🤝 Contributing <a name="contributing"></a>

We're still developing our contribution processes. If you'd like to contribute or have questions, reach out through the contact information below.

## 📄 License <a name="license"></a>

MIT — see [LICENSE](./LICENSE).

## 📬 Contact

Brent Rager

- [Email](mailto:brent@smoo.ai)
- [LinkedIn](https://www.linkedin.com/in/brentrager/)
- [BlueSky](https://bsky.app/profile/brentragertech.bsky.social)
- [TikTok](https://www.tiktok.com/@brentragertech)
- [Instagram](https://www.instagram.com/brentragertech/)

Smoo GitHub: [https://github.com/SmooAI](https://github.com/SmooAI)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<p align="center">
  Built by <a href="https://smoo.ai"><strong>Smoo AI</strong></a> — AI built into every product.
</p>
