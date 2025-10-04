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
    openapi: '3.0.0',
    info: {
      title: 'Echo API',
      version: '1.0.0',
      description: '受け取った入力値をそのまま応答するAPI',
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
