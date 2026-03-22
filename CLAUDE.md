# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`zod-openapi-share` is a TypeScript npm package that extends `@hono/zod-openapi` to centralize and reuse response definitions across endpoints. It is structured as a pnpm monorepo.

## Common Commands

All commands are run from the repository root unless noted.

### Package (library)
```bash
pnpm package:build       # Build the library (tsup → dist/)
pnpm package:test        # Run tests with type checking
pnpm package:coverage    # Run tests with coverage report
pnpm package:ui          # Run tests with Vitest UI
pnpm package:typedoc     # Generate TypeDoc documentation
```

### Examples
```bash
pnpm examples:nodejs:dev                    # Start Node.js example in watch mode
pnpm examples:cloudflare-workers:dev        # Start Cloudflare Workers example
```

### Running a single test file
```bash
cd package && pnpm exec vitest run --typecheck src/lib/schema.test.ts
```

## Architecture

The monorepo has three workspaces: `package/` (the published library), `examples/nodejs/`, and `examples/cloudflare-workers/`.

### Core Library (`package/src/`)

- **`lib/types.ts`** — All TypeScript types. Key types:
  - `StatusCode` — union of all HTTP status codes + `-1`
  - `ResponsesConfig` — maps status codes to `@hono/zod-openapi` response definitions
  - `MergeRouteResponses<>` — merges shared responses into a per-route config at the type level
  - `UniqueTuple<>` / `NeverWrapper<>` — compile-time guards preventing duplicate status codes

- **`lib/schema.ts`** — `ZodOpenAPISchema` class. Constructor takes a `ResponsesConfig`, and `createSchema()` merges shared responses into a route's config object. Has overloads for with/without `statusCodes` argument.

- **`index.ts`** — Re-exports `ZodOpenAPISchema` and all public types.

### Build Output

`tsup` produces dual ESM (`.mjs`) and CJS (`.js`) bundles plus `.d.ts` declarations in `dist/`. Build target is ES2024.

### Testing

Vitest with `--typecheck` flag; coverage via `@vitest/coverage-v8`. Tests live alongside source (`*.test.ts`).

### Code Style

Prettier is configured: 120-char line width, 2-space indent, single quotes, trailing commas (ES5), semicolons.
