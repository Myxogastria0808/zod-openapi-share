import { z } from 'zod';
import { ZodOpenAPISchema } from 'zod-openapi-share';

const ContentfulStatusCodeArray = [
  100, 102, 103, 200, 201, 202, 203, 206, 207, 208, 226, 300, 301, 302, 303, 305, 306, 307, 308, 400, 401, 402, 403,
  404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429,
  431, 451, 500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511, -1,
] as const;

export const errorResponseSchema = z.object({
  status: z.union(ContentfulStatusCodeArray.map((code) => z.literal(code))).meta({
    example: 400,
    description: 'HTTP Status Code',
  }),
  message: z.string().min(1).meta({
    example: 'Bad Request',
    description: 'Error Message',
  }),
});

export type ErrorResponseSchemaType = z.infer<typeof errorResponseSchema>;

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
