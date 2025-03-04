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

SmooAI is a platform for building and deploying AI-powered apps.

Learn more on [smoo.ai](https://smoo.ai)

This repository, among other things, contains parts that power:

-   [SmooAI Marketing Page](https://smoo.ai)
-   [SmooAI Apps](https://apps.smoo.ai)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

-   [![sst][sst]][sst-url]
-   [![next][next]][next-url]
-   [![aws][aws]][aws-url]
-   [![tailwindcss][tailwindcss]][tailwindcss-url]
-   [![zod][zod]][zod-url]
-   [![sanity][sanity]][sanity-url]
-   [![vitest][vitest]][vitest-url]
-   [![pnpm][pnpm]][pnpm-url]
-   [![turborepo][turborepo]][turborepo-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

SmooAI is powered by a monorepo built using [PNPM Workspaces](https://pnpm.io/workspaces) and [Turborepo](https://turbo.build/).

It contains [SST](https://sst.dev) apps hosted on AWS. It contains [Next.js](next-url) web apps.

### Getting AWS Access

Contact [Brent Rager](brent@smoo.ai)

### Install

```sh
pnpm install
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Using PNPM

We use [PNPM](https://pnpm.io/) as our package manager. It's a drop-in replacement for NPM/Yarn that provides a few benefits:

-   It's faster
-   It uses less disk space
-   It has better support for monorepos
-   It has better support for peer dependencies
-   It has better support for multiple versions of the same package
-   It has in-built patching support

#### Installing PNPM

(https://pnpm.io/installation)

#### Common PNPM Commands

-   `pnpm install` - Install dependencies (from lockfile if present)
-   `pnpm add <package>` - Add a new dependency
-   `pnpm remove <package>` - Remove a dependency
-   `pnpm --filter <package> <command>` - Run a command in a specific package
-   `pnpm add -w <package>` - Add a new dependency to root.
-   `pnpm add -D <package>` - Add a new dev dependency
-   `pnpm <script>` - Run a script from package.json
-   `pnpm dlx <package>` - Run a package without installing it (like npx)
-   `pnpm exec <command>` - Run a command in the context of the current workspace (including node_modules/.bin)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Using Turborepo

We use [Turborepo](https://turbo.build/) to manage our monorepo. It has the following benefits:

-   Caching: It caches the results of builds and tests, so that subsequent runs are faster
-   Generators: It provides a way to generate new packages and files from templates
-   Parallelism: It runs builds and tests in parallel, so that they are faster
-   Monorepo support: It provides a way to run builds and tests across multiple packages in parallel

#### Installing Turborepo

(https://turbo.build/repo/docs/installing)

Or, just run `pnpm dlx turbo <command>` to run a command without installing it.

#### Common Turborepo Commands

-   `turbo build` - Build all packages
-   `turborepo build --filter <package>` - Build a specific package
-   `turbo test` - Run all tests
-   `turbo test --filter <package>` - Run tests for a specific package
-   `turbo gen` to see a list of interactive generators

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### .envrc file

There is a .envrc file at the root that is preconfigured for you.

We use (https://direnv.net/). Install it and run the following in the root of the repo:

`direnv allow .`

###

### Linting

```sh
pnpm lint
```

### Testing

```sh
pnpm test
```

#### Running tests within a single package

```sh
# Example running tests in the @smooai/core package
pnpm --filter @smooai/core exec npx cross-env NODE_ENV=test vitest run -t "should generate schema with array"
```

### Running scripts within a single package

```
pnpm --filter frontend lint
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Running in Development

### Start Supabase

**Note**: You need to have [Docker](https://www.docker.com/) installed.

```
pnpm supabase
```

### Start SST Dev

```
pnpm dev
```

### Start Next.js

```
pnpm --filter @smooai/web dev
```

### Auth

-   Add users at to http://localhost:54323/project/default/auth/users
-   View emails in development at http://localhost:54324/monitor

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Configuration

This is meant to be a zero-config project. However, there are some configuration options available.

### .envrc file

There is a .envrc file at the root that is preconfigured for you.

We use (https://direnv.net/). Install it and run the following in the root of the repo:

`direnv allow .`

### Parameters and Secrets

Configuration of this project is done via a multi-layered approach based on [node-config](https://github.com/node-config/node-config).

The end result is a `config` object with the same interface for server-side and client-side code.

You can find the configuration files in the `packages/config/src/configByEnv` folder, named after the environment they are used for.

-   `default.ts` - Default configuration for all environments
-   `personal.ts` - Personal configuration for personal stage / local development
-   `dev.ts` - Configuration for dev stage
-   `prod.ts` - Configuration for prod stage

The environment is selected based on the `NODE_CONFIG_ENV` environment variable. If it is not set, the default environment is used.

When an environment is selected, the default configuration is merged with the environment specific configuration. The environment specific configuration overrides the default configuration.

The Config class in `packages/config/src/Config.ts` provides a run-time specific configuration object that can be used to access the configuration values.

This is typically used in two flavors:

1. `packages/config/src/serverConfig.ts` - This is used to access configuration values in server-side code. It uses a top-level await to ensure the configuration is loaded before the code is executed.
2. `packages/config/src/localConfig.ts` - This is used to access configuration values in client-side code. It uses only static configuration values and environment variables that are available at build time.

#### Server-side configuration

Server-side configuration attempts to retrieve the configuration from the following sources in order:

1. SST Parameters or Secrets [SST Config](https://docs.sst.dev/config). This is where dynamic configuration is stored.
2. `node-config` style environment configurationi files (as discussed above). This is where static configuration is stored.
3. Environment variables, if the configuration value is not found in the previous sources.

#### Client-side configuration

Client-side configuration (NextJS) relies on [NextJS Environmental Variable Config](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables) to provide configuration values to the client.

At build time, or set in the deployment environment, the environment specific configuration is pulled in order from:

1. SST Parameters or Secrets [SST Config](https://docs.sst.dev/config). This is where dynamic configuration is stored.
2. `node-config` style environment configurationi files (as discussed above). This is where static configuration is stored.

These values are then injected into the client-side code as environment variables, notably the `NEXT_PUBLIC_CONFIG` environment variable which uses [compress-json](https://www.npmjs.com/package/compress-json) to compress the json representation of the environment configuration. This allows us to work within the 4kb limit of environment variables in deploying the site (limitation from [AWS Lambda](https://repost.aws/knowledge-center/lambda-environment-variable-size)).

The `Config` class decompresses the `NEXT_PUBLIC_CONFIG` environment variable and provides a run-time specific configuration object that can be used to access the configuration values.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
<!-- Database -->

## Database

We use [Supabase](https://supabase.com/) for our database.

Supabase is an open-source Firebase alternative. It provides a suite of tools for building apps with authentication, real-time data, and file storage. Mainly, we use it for its PostgreSQL database, real-time data, and Auth.

### Start Supabase

```
pnpm supabase
```

### View Local Supabase Information

```
npx supabase status
```

### Migrations

#### To create a new migration on a branch

1. Go to the local Supabase project: http://localhost:54323/project/default/
2. Create a new table
3. Go to the console and run `pnpm supabase:diff -f add_table_name_table`
4. Run `npx supabase db reset` to verify that a new migration does not generate errors

cameron was here

#### To update a column in the existing table

1. Go to the local Supabase project: http://localhost:54323/project/default/
2. Apply changes
3. Go to the console and run `pnpm supabase:diff -f update_field_name_in_table_name_table`
4. Run `npx supabase db reset` to verify that a new migration does not generate errors

<p align="right">(<a href="#readme-top">back to top</a>)</p>
<!-- CONTRIBUTING -->

## Contributing

1. Create a branch. Reference a jira ticket in the branch name. (`git checkout -b smoodev-1234-fix-thing`)
1. Commit your Changes. Reference a jira ticket in your commit message. (`git commit -m 'SMOODEV-1234: Add some AmazingFeature'`)
1. Push to the Branch (`git push`)
1. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Brent Rager - [Email](mailto:brent@smoo.ai)
[Instagram](https://www.instagram.com/brentragertech/)
[LinkedIn](https://www.linkedin.com/in/brentrager/)
[Threads](https://www.threads.net/@brentragertech)

Project Link: [https://github.com/SmooAI/smooai](https://bitbucket.org/smooai/smooai/src/main/)

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
