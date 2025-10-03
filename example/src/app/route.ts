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
