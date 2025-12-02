# zod-openapi-share

[![Test](https://github.com/Myxogastria0808/zod-openapi-share/actions/workflows/test.yaml/badge.svg)](https://github.com/Myxogastria0808/zod-openapi-share/actions/workflows/test.yaml)
[![Docs](https://github.com/Myxogastria0808/zod-openapi-share/actions/workflows/docs.yaml/badge.svg)](https://github.com/Myxogastria0808/zod-openapi-share/actions/workflows/docs.yaml)
[![NPM Version](https://img.shields.io/npm/v/zod-openapi-share.svg)](https://www.npmjs.com/package/zod-openapi-share)
![GitHub Release](https://img.shields.io/github/v/release/Myxogastria0808/zod-openapi-share)
![NPM Type Definitions](https://img.shields.io/npm/types/zod-openapi-share)
[![Download NPM](https://img.shields.io/npm/dm/zod-openapi-share.svg?style=flat)](https://www.npmjs.com/package/zod-openapi-share)
[![NPM Downloads All Time](https://badgen.net/npm/dt/zod-openapi-share?label=downloads%20all%20time&color=cyan)](https://www.npmjs.com/package/zod-openapi-share)
![GitHub License](https://img.shields.io/github/license/Myxogastria0808/zod-openapi-share)
![Vitest](https://img.shields.io/badge/-vitest-6e9f18?style=flat&logo=vitest&logoColor=ffffff)
![Typedoc](https://img.shields.io/badge/docs-typedoc-blue?style=flat-square&logo=typescript&logoColor=white)
[![RenovateBot](https://img.shields.io/badge/RenovateBot-1A1F6C?logo=renovate&logoColor=fff)](#)

`zod-openapi-share` is an extension package for `@hono/zod-openapi` that lets you centralize and reuse response definitions across endpoints.
Normally, `@hono/zod-openapi` requires you to redefine the same responses (e.g., error schemas) for every endpoint, but with `zod-openapi-share`, you can avoid repetition and prevent definition drift, making your backend development using `hono` + `@hono/zod-openapi` cleaner and more consistent.

> [!IMPORTANT]
> Be sure to use the latest version.

## What is `zod-openapi-share`?

In projects using `hono`, you may have opportunities to use a convenient package called `@hono/zod-openapi` as middleware for generating OpenAPI schemas.
This package allows you to define both OpenAPI schemas and Zod-based validation at the same time.

However, it has a major drawback: you must repeatedly write out the `responses` definitions for every single status code across all endpoints.
In many cases, error responses share the exact same structure across endpoints — yet, even if they are identical, you still have to duplicate those definitions.

To solve this, `zod-openapi-share` provides a way to centralize and reuse response definitions by wrapping around `@hono/zod-openapi`.
Think of `zod-openapi-share` as an extension package for `@hono/zod-openapi`.
When using it, you’ll need three packages together: `hono`, `@hono/zod-openapi`, and `zod-openapi-share`.

By unifying response definitions, you can develop without worrying about unintended inconsistencies between endpoints.
If you’re using hono and @hono/zod-openapi, be sure to try `zod-openapi-share`!

<details>
<summary>before (`hono` + `@hono/zod-openapi`)</summary>

### before (`hono` + `@hono/zod-openapi`)

```ts
import { z, createRoute } from '@hono/zod-openapi';

// Commonly Used Response Schema
const ContentlyStatusCodeArray = [
  100, 102, 103, 200, 201, 202, 203, 206, 207, 208, 226, 300, 301, 302, 303, 305, 306, 307, 308, 400, 401, 402, 403,
  404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429,
  431, 451, 500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511, -1,
] as const;

export const errorResponseSchema = z.object({
  status: z.union(ContentlyStatusCodeArray.map((code) => z.literal(code))).meta({
    example: 400,
    description: 'HTTP Status Code',
  }),
  message: z.string().min(1).meta({
    example: 'Bad Request',
    description: 'Error Message',
  }),
});

// Get Request Sample
const rootGetResponseBodySchema = z.object({
  result: z.string().meta({
    example: 'Hello, World!',
    description: 'Root Endpoint Get Response',
  }),
});

const rootGetRoute = createRoute({
  path: '/',
  method: 'get',
  description: 'Sample Endpoint',
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: rootGetResponseBodySchema,
        },
      },
    },
    //** Despite having the same definition, it must be defined repeatedly for each endpoint! */
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
    400: {
      description: 'Bad Request',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    500: {
      description: 'Internal Server Error',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
  },
});

// Post Request Sample
const rootPostRequestBodySchema = z.object({
  input: z.string().min(1).max(100).meta({
    example: 'Hello, World!',
    description: 'Root Endpoint Post Request',
  }),
});

const rootPostResponseBodySchema = z.object({
  result: z.string().meta({
    example: 'Hello, World!',
    description: 'Root Endpoint Post Response',
  }),
});

const rootPostRoute = createRoute({
  path: '/',
  method: 'post',
  description: 'Sample Endpoint',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: rootPostRequestBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: rootPostResponseBodySchema,
        },
      },
    },
    //** Despite having the same definition, it must be defined repeatedly for each endpoint! */
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
    400: {
      description: 'Bad Request',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    500: {
      description: 'Internal Server Error',
      content: { 'application/json': { schema: errorResponseSchema } },
    },
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
  },
});

```
</details>

<details>
<summary>after (`hono` + `@hono/zod-openapi` + `zod-openapi-share`)</summary>

### after (`hono` + `@hono/zod-openapi` + `zod-openapi-share`)

```ts
import { z } from '@hono/zod-openapi';
import { ZodOpenAPISchema } from 'zod-openapi-share';

// Commonly Used Response Schema
const ContentlyStatusCodeArray = [
  100, 102, 103, 200, 201, 202, 203, 206, 207, 208, 226, 300, 301, 302, 303, 305, 306, 307, 308, 400, 401, 402, 403,
  404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429,
  431, 451, 500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511, -1,
] as const;

export const errorResponseSchema = z.object({
  status: z.union(ContentlyStatusCodeArray.map((code) => z.literal(code))).meta({
    example: 400,
    description: 'HTTP Status Code',
  }),
  message: z.string().min(1).meta({
    example: 'Bad Request',
    description: 'Error Message',
  }),
});

// Shared Responses Using ZodOpenAPISchema
const route = new ZodOpenAPISchema({
  400: {
    description: 'Bad Request',
    content: { 'application/json': { schema: errorResponseSchema } },
  },
  500: {
    description: 'Internal Server Error',
    content: { 'application/json': { schema: errorResponseSchema } },
  },
} as const);

// Get Request Sample
const rootGetResponseBodySchema = z.object({
  result: z.string().meta({
    example: 'Hello, World!',
    description: 'Root Endpoint Get Response',
  }),
});

const rootGetRoute = route.createSchema(
  {
    path: '/',
    method: 'get',
    description: 'Sample Endpoint',
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: rootGetResponseBodySchema,
          },
        },
      },
    },
  },
  // You only need to describe the status codes of the response definitions shared in the array as the second argument!
  [400, 500]
);

// Post Request Sample
const rootPostRequestBodySchema = z.object({
  input: z.string().min(1).max(100).meta({
    example: 'Hello, World!',
    description: 'Root Endpoint Post Request',
  }),
});

const rootPostResponseBodySchema = z.object({
  result: z.string().meta({
    example: 'Hello, World!',
    description: 'Root Endpoint Post Response',
  }),
});

const rootPostRoute = route.createSchema(
  {
    path: '/',
    method: 'post',
    description: 'Sample Endpoint',
    request: {
      body: {
        required: true,
        content: {
          'application/json': {
            schema: rootPostRequestBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: rootPostResponseBodySchema,
          },
        },
      },
    },
  }, // You only need to describe the status codes of the response definitions shared in the array as the second argument!
  [400, 500]
);
```
</details>

## How to Use

**Examples Here**

- cloudflare workers example
  - https://github.com/Myxogastria0808/zod-openapi-share/tree/main/examples/cloudflare-workers/

- nodejs example
  - https://github.com/Myxogastria0808/zod-openapi-share/tree/main/examples/nodejs/

1. Install Packages

```sh
npm install hono @hono/zod-openapi zod-openapi-share
```

2. Create `Zod` Schema and `ZodOpenAPISchema` Class Instance

- Example

https://github.com/Myxogastria0808/zod-openapi-share/tree/main/examples/nodejs/src/app/share.ts

```ts
import { z } from '@hono/zod-openapi';
import { ZodOpenAPISchema } from 'zod-openapi-share';

const ContentlyStatusCodeArray = [
  100, 102, 103, 200, 201, 202, 203, 206, 207, 208, 226, 300, 301, 302, 303, 305, 306, 307, 308, 400, 401, 402, 403,
  404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429,
  431, 451, 500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511, -1,
] as const;

// Zod Schema for Error Response
export const errorResponseSchema = z.object({
  status: z.union(ContentlyStatusCodeArray.map((code) => z.literal(code))).meta({
    example: 400,
    description: 'HTTP Status Code',
  }),
  message: z.string().min(1).meta({
    example: 'Bad Request',
    description: 'Error Message',
  }),
});

export type ErrorResponseSchemaType = z.infer<typeof errorResponseSchema>;

// ZodOpenAPISchema Instance
/**
 * Define Shared Responses Here
 */
export const route = new ZodOpenAPISchema({
  400: {
    description: 'Bad Request',
    content: { 'application/json': { schema: errorResponseSchema } },
  },
  500: {
    description: 'Internal Server Error',
    content: { 'application/json': { schema: errorResponseSchema } },
  },
} as const);

```

3. Create RouteConfig Type Object

- `createSchema` Method

When you want to learn how to use `createRoute`,
please refer to the [@hono/zod-openapi](https://hono.dev/examples/zod-openapi).

```ts
zodOpenAPISchemaInstance.createSchema(
    createRoute object (@hono/zod-openapi RouteConfig type object),
    StatusCode[] (Array of status codes to be shared from ZodOpenAPISchema instance)
);
```

- Example

https://github.com/Myxogastria0808/zod-openapi-share/tree/main/examples/nodejs/src/app/route.ts

```ts
import { z } from '@hono/zod-openapi';
import { route } from './share.js';

const responseBodySchema = z.object({
  result: z.string().meta({
    example: 'Hello World!',
    description: 'Sample Endpoint Response',
  }),
});

export const rootRoute = route.createSchema(
  {
    path: '/',
    method: 'get',
    description: 'Sample Endpoint',
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: responseBodySchema,
          },
        },
      },
    },
  },
  [400, 500]
);

```

4. Insert `root` Variable Into Hono `app` Instance

- Example

https://github.com/Myxogastria0808/zod-openapi-share/tree/main/examples/nodejs/src/app/index.ts

```typescript
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { type ErrorResponseSchemaType } from './share.js';
import { rootRoute } from './route.js';
import { Scalar } from '@scalar/hono-api-reference';

export const api = () => {
  const app = new OpenAPIHono({
    // Zod Validation Error Hook
    defaultHook: (result) => {
      if (!result.success) {
        console.error(result.error);
        throw new HTTPException(400, {
          message: 'Zod Validation Error',
        });
      }
    },
  });

  // 404 Not Found Handler
  app.notFound((c) => {
    console.error(`Not Found: ${c.req.url}`);
    return c.json({ status: 404, message: 'Not Found' } satisfies ErrorResponseSchemaType, 404);
  });
  // Other Error Handler
  app.onError((error, c) => {
    if (error instanceof HTTPException) {
      return c.json(
        {
          status: error.status,
          message: error.message,
        } satisfies ErrorResponseSchemaType,
        error.status
      );
    }
    return c.json(
      {
        status: 500,
        message: 'Internal Server Error',
      } satisfies ErrorResponseSchemaType,
      500
    );
  });

  // Settings of CORS
  app.use('*', cors());

  // OpenAPI Document Endpoint
  app.doc('/openapi', {
    openapi: '3.1.0',
    info: {
      title: 'Echo API',
      version: '1.0.0',
      description: 'An example of OpenAPI with hono, @hono/zod-openapi, and zod-openapi-share.',
    },
  });

  // Scalar Web UI Endpoint
  // References
  // https://guides.scalar.com/scalar/scalar-api-references/integrations/hono
  app.get('/scalar', Scalar({ url: '/openapi' }));

  /**
   * Add route to app instance
   */
  app.openapi(rootRoute, (c) => {
    return c.json({ result: 'Hello World!' });
  });

  return app;
};

```

5. Define `serve` (Define Entry Point)

- Example

https://github.com/Myxogastria0808/zod-openapi-share/tree/main/examples/nodejs/src/index.ts

```ts
import { serve } from '@hono/node-server';
import { api } from './app/index.js';

serve(
  {
    fetch: api().fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

```

6. Define Generate OpenAPI Document Program

- Example

https://github.com/Myxogastria0808/zod-openapi-share/tree/main/examples/nodejs/src/openapi.ts

```ts
import { api } from './app/index.js';
import fs from 'node:fs';

const docs = api().getOpenAPI31Document({
  openapi: '3.1.0',
  info: {
    title: 'hono + @hono/zod-openapi + zod-openapi-share sample',
    version: '1.0.0',
    description: 'This is a sample project to generate OpenAPI documents with Hono and Zod.',
  },
});

const json = JSON.stringify(docs, null, 2);

fs.writeFileSync('./openapi.json', json);
console.log(json);

```

7. Add generate openapi.json `scripts` to package.json

- Example

```jsonc
{
  "name": "example",
  "type": "module",
  "private": true,
    "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "openapi": "tsx src/openapi.ts" // Add this script for generating OpenAPI document
  },
  // [Omitted]
}
```

## HTML Documentation Generated by typedoc

https://myxogastria0808.github.io/zod-openapi-share/

## Test Coverage Generated by @vitest/coverage-v8

https://myxogastria0808.github.io/zod-openapi-share/coverage/

## Test Result Generated by @vitest/ui

https://myxogastria0808.github.io/zod-openapi-share/html/

## DeepWiki

> [!WARNING]
> The accuracy of the contents of generated deepwiki has not been verified by me.
>
> I recommend that you look at the documentation at [typedoc](https://myxogastria0808.github.io/zod-openapi-share/).

https://deepwiki.com/Myxogastria0808/zod-openapi-share/
