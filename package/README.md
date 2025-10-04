# zod-openapi-share

[![Test](https://github.com/Myxogastria0808/zod-openapi-share/actions/workflows/test.yaml/badge.svg)](https://github.com/Myxogastria0808/zod-openapi-share/actions/workflows/test.yaml)
[![Docs](https://github.com/Myxogastria0808/zod-openapi-share/actions/workflows/docs.yaml/badge.svg)](https://github.com/Myxogastria0808/zod-openapi-share/actions/workflows/docs.yaml)
[![NPM Version](https://img.shields.io/npm/v/zod-openapi-share.svg)](https://www.npmjs.com/package/zod-openapi-share)
![GitHub Release](https://img.shields.io/github/v/release/Myxogastria0808/zod-openapi-share)
![NPM Type Definitions](https://img.shields.io/npm/types/zod-openapi-share)
[![Download NPM](https://img.shields.io/npm/dm/zod-openapi-share.svg?style=flat)](https://www.npmjs.com/package/zod-openapi-share)
![GitHub License](https://img.shields.io/github/license/Myxogastria0808/zod-openapi-share)
![Vitest](https://img.shields.io/badge/-vitest-6e9f18?style=flat&logo=vitest&logoColor=ffffff)
![Typedoc](https://img.shields.io/badge/docs-typedoc-blue?style=flat-square&logo=typescript&logoColor=white)
[![RenovateBot](https://img.shields.io/badge/RenovateBot-1A1F6C?logo=renovate&logoColor=fff)](#)


// TODO: AIに箇条書きで説明を書いて、説明文を英語で吐かせる
`zod-openapi-share` is a package that works as a wrapper for `@hono/zod-openapi`.

> [!IMPORTANT]
> Be sure to use the latest version.

## How to Use

// TODO: 修正を入れる + 対象のファイルのリンクを貼る
// TODO: exampleを `nodejs` と `cloudflare` の2つ用意する
// TODO: 以下のノリでbeforeとafterの差分を書き、このパッケージを使うメリットを説明する
https://notepm.jp/markdown-table-tool
|                                       |                                                            |
| ------------------------------------- | ---------------------------------------------------------- |
| Before (`hono` + `@hono/zod-openapi`) | After (`hono` + `@hono/zod-openapi` + `zod-openapi-share`) |
| ```typescript<br>```                  | ```typescript<br>```                                       |

1. Install Packages

```sh
npm install hono @hono/zod-openapi zod-openapi-share
```

2. Create `Zod` Schema and `ZodOpenAPISchema` Class Instance

- Example

```typescript
import { z } from 'zod';
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
please refer to the [@hono/zod-openapi (https://hono.dev/examples/zod-openapi)](https://hono.dev/examples/zod-openapi).

```ts
zodOpenAPISchemaInstance.createSchema(
    createRoute object (@hono/zod-openapi RouteConfig type object),
    StatusCode[] (Array of status codes to be shared from ZodOpenAPISchema instance)
);
```

- Example

```typescript
import { z } from 'zod';
import { route } from './share.js';

const responseBodySchema = z.object({
  result: z.string().meta({
    example: 'Hello World!',
    description: 'Sample Endpoint Response',
  }),
});

export const root = route.createSchema(
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

```typescript
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { type ErrorResponseSchemaType } from './share.js';
import { root } from './route.js';

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

  // [Omitted]

  /**
   * Add route to app instance
   */
  app.openapi(root, (c) => {
    return c.json({ result: 'Hello World!' });
  });

  return app;
};
```

5. Define `serve` (Define Entry Point)

- Example

```ts
import { serve } from '@hono/node-server';
import { api } from './app/app.js';

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

```ts
import { api } from './app/app.js';
import fs from 'node:fs';

const docs = api().getOpenAPIDocument({
  openapi: '3.0.0',
  info: {
    title: 'hono + @hono/zod-openapi sample',
    version: '1.0.0',
    description: 'HonoとZodでOpenAPIドキュメントを生成するサンプルです。',
  },
});

const json = JSON.stringify(docs, null, 2);

fs.writeFileSync('./openapi.json', json);
console.log(json);
```

7. Add generate openapi.json `scripts` to package.json

- Example

```json
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

## Test Result Generated by @vitest/coverage-v8

https://myxogastria0808.github.io/zod-openapi-share/coverage/

## Test Coverage Generated by @vitest/ui

https://myxogastria0808.github.io/zod-openapi-share/html/

## DeepWiki

> [!WARNING]
> The accuracy of the contents of generated deepwiki has not been verified by me.
>
> I recommend that you look at the documentation at [typedoc](https://myxogastria0808.github.io/zod-openapi-share/).

https://deepwiki.com/Myxogastria0808/zod-openapi-share/
