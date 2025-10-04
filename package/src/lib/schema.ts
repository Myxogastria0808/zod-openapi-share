import type { RouteConfig } from '@hono/zod-openapi';
import type { NeverWrapper, ResponsesConfig, UniqueTuple, UserDefinedStatusCode } from './types';

/**
 * The ZodOpenAPISchema class is a utility for creating OpenAPI schema definitions
 *
 * @author Yuki Osada <r.rstudio.c@gmail.com>
 * @template M - The user-defined status codes type (M extends ResponsesConfig).
 * @extends {ResponsesConfig}
 */
export class ZodOpenAPISchema<M extends ResponsesConfig> {
  /**
   * The private property that holds the user-defined status codes type object (M extends ResponsesConfig).
   *
   * @readonly
   * @private
   * @type {Readonly<M>}
   */
  private responses: Readonly<M>;

  /**
   * The constructor to initialize the ZodOpenAPISchema class with a ResponsesConfig type object.
   *
   * @param {M} responses - The user-defined status codes type object (M extends ResponsesConfig).
   * @returns {ZodOpenAPISchema<M>} - An instance of ZodOpenAPISchema class.
   *
   * @example
   * ```ts
   * import { z } from '@hono/zod-openapi';
   * import { ZodOpenAPISchema } from 'zod-openapi-share';
   *
   * const ContentlyStatusCodeArray = [
   *   100, 102, 103, 200, 201, 202, 203, 206, 207, 208, 226, 300, 301, 302, 303, 305, 306, 307, 308, 400, 401, 402, 403,
   *   404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429,
   *   431, 451, 500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511, -1,
   * ] as const;
   *
   * export const errorResponseSchema = z.object({
   *   status: z.union(ContentlyStatusCodeArray.map((code) => z.literal(code))).meta({
   *     example: 400,
   *     description: 'HTTP Status Code',
   *   }),
   *   message: z.string().min(1).meta({
   *     example: 'Bad Request',
   *     description: 'Error Message',
   *   }),
   * });
   *
   * const route = new ZodOpenAPISchema({
   *   400: {
   *     description: 'Bad Request',
   *     content: { 'application/json': { schema: errorResponseSchema } },
   *   },
   *   500: {
   *     description: 'Internal Server Error',
   *     content: { 'application/json': { schema: errorResponseSchema } },
   *   },
   * } as const);
   *
   * ```
   */
  constructor(responses: M) {
    this.responses = responses;
  }

  /**
   * Overload signatures for createSchema method.
   *
   * @template R - The route config type (R extends RouteConfig). This type is provided by @hono/zod-openapi.
   * @extends {RouteConfig}
   * @template T - The readonly array of unique user-defined status codes type (M extends ResponsesConfig).
   * @extends {Readonly<UserDefinedStatusCode<M>[]>}
   */
  /**
   * `statusCodes` argument omitted
   *
   * @template R - The route config type (R extends RouteConfig). This type is provided by @hono/zod-openapi.
   * @extends {RouteConfig}
   *
   * @param {R} route - Route config (R extends RouteConfig). This type is provided by @hono/zod-openapi.
   * @returns {R} - The route config type (R extends RouteConfig) with the specified status codes added to the responses. This type is provided by @hono/zod-openapi.
   *
   * @example
   * ```ts
   * import { z } from '@hono/zod-openapi';
   * import { ZodOpenAPISchema } from 'zod-openapi-share';
   *
   * const ContentlyStatusCodeArray = [
   *   100, 102, 103, 200, 201, 202, 203, 206, 207, 208, 226, 300, 301, 302, 303, 305, 306, 307, 308, 400, 401, 402, 403,
   *   404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429,
   *   431, 451, 500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511, -1,
   * ] as const;
   *
   * const errorResponseSchema = z.object({
   *   status: z.union(ContentlyStatusCodeArray.map((code) => z.literal(code))).meta({
   *     example: 400,
   *     description: 'HTTP Status Code',
   *   }),
   *   message: z.string().min(1).meta({
   *     example: 'Bad Request',
   *     description: 'Error Message',
   *   }),
   * });
   *
   *
   * const route = new ZodOpenAPISchema({
   *   400: {
   *     description: 'Bad Request',
   *     content: { 'application/json': { schema: errorResponseSchema } },
   *   },
   *   500: {
   *     description: 'Internal Server Error',
   *     content: { 'application/json': { schema: errorResponseSchema } },
   *   },
   * } as const);
   *
   * const responseBodySchema = z.object({
   *   result: z.string().meta({
   *     example: 'Hello World!',
   *     description: 'Sample Endpoint Response',
   *   }),
   * });
   *
   * const rootRoute = route.createSchema(
   *   {
   *     path: '/',
   *     method: 'get',
   *     description: 'Sample Endpoint',
   *     responses: {
   *       200: {
   *         description: 'OK',
   *         content: {
   *           'application/json': {
   *             schema: responseBodySchema,
   *           },
   *         },
   *       },
   *     },
   *   }
   *   \/\/ You can omit the `statusCodes` argument here
   * );
   * ```
   */
  createSchema<R extends RouteConfig>(route: R): R;
  /**
   * `statusCodes` argument included
   *
   * @template R - The route config type (R extends RouteConfig). This type is provided by @hono/zod-openapi.
   * @extends {RouteConfig}
   * @template T - The readonly array of unique user-defined status codes type (M extends ResponsesConfig).
   * @extends {Readonly<UserDefinedStatusCode<M>[]>}
   *
   * @param {R} route - Route config (R extends RouteConfig). This type is provided by @hono/zod-openapi.
   * @param {Readonly<UserDefinedStatusCode<M>[]>} statusCodes - Optional array of unique status codes (only user-defined ones) to be added to the route.
   * @returns {R} - The route config type (R extends RouteConfig) with the specified status codes added to the responses. This type is provided by @hono/zod-openapi.
   *
   * @example
   * ```ts
   * import { z } from '@hono/zod-openapi';
   * import { ZodOpenAPISchema } from 'zod-openapi-share';
   *
   * const ContentlyStatusCodeArray = [
   *   100, 102, 103, 200, 201, 202, 203, 206, 207, 208, 226, 300, 301, 302, 303, 305, 306, 307, 308, 400, 401, 402, 403,
   *   404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429,
   *   431, 451, 500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511, -1,
   * ] as const;
   *
   * const errorResponseSchema = z.object({
   *   status: z.union(ContentlyStatusCodeArray.map((code) => z.literal(code))).meta({
   *     example: 400,
   *     description: 'HTTP Status Code',
   *   }),
   *   message: z.string().min(1).meta({
   *     example: 'Bad Request',
   *     description: 'Error Message',
   *   }),
   * });
   *
   *
   * const route = new ZodOpenAPISchema({
   *   400: {
   *     description: 'Bad Request',
   *     content: { 'application/json': { schema: errorResponseSchema } },
   *   },
   *   500: {
   *     description: 'Internal Server Error',
   *     content: { 'application/json': { schema: errorResponseSchema } },
   *   },
   * } as const);
   *
   * const responseBodySchema = z.object({
   *   result: z.string().meta({
   *     example: 'Hello World!',
   *     description: 'Sample Endpoint Response',
   *   }),
   * });
   *
   * const rootRoute = route.createSchema(
   *   {
   *     path: '/',
   *     method: 'get',
   *     description: 'Sample Endpoint',
   *     responses: {
   *       200: {
   *         description: 'OK',
   *         content: {
   *           'application/json': {
   *             schema: responseBodySchema,
   *           },
   *         },
   *       },
   *     },
   *   },
   *   [400, 500] \/\/ This argument is the `statusCodes`
   * );
   * ```
   */
  createSchema<R extends RouteConfig, T extends Readonly<UserDefinedStatusCode<M>[]>>(
    route: R,
    statusCodes: NeverWrapper<UserDefinedStatusCode<M>, T>
  ): R;

  /**
   * Create a new RouteConfig type object by adding specified status codes to the responses of the given route.
   *
   * @template R - The route config type (R extends RouteConfig). This type is provided by @hono/zod-openapi.
   * @extends {RouteConfig}
   * @template T - The readonly array of unique user-defined status codes type (M extends ResponsesConfig).
   * @extends {Readonly<UserDefinedStatusCode<M>[]>}
   *
   * @param {R} route - Route config (R extends RouteConfig). This type is provided by @hono/zod-openapi.
   * @param {Readonly<UserDefinedStatusCode<M>[]>} statusCodes - Optional array of unique status codes (only user-defined ones) to be added to the route.
   * @returns {R} - The route config type (R extends RouteConfig) with the specified status codes added to the responses. This type is provided by @hono/zod-openapi.
   *
   * @example
   * ```ts
   * import { z } from '@hono/zod-openapi';
   * import { ZodOpenAPISchema } from 'zod-openapi-share';
   *
   * const ContentlyStatusCodeArray = [
   *   100, 102, 103, 200, 201, 202, 203, 206, 207, 208, 226, 300, 301, 302, 303, 305, 306, 307, 308, 400, 401, 402, 403,
   *   404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429,
   *   431, 451, 500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511, -1,
   * ] as const;
   *
   * const errorResponseSchema = z.object({
   *   status: z.union(ContentlyStatusCodeArray.map((code) => z.literal(code))).meta({
   *     example: 400,
   *     description: 'HTTP Status Code',
   *   }),
   *   message: z.string().min(1).meta({
   *     example: 'Bad Request',
   *     description: 'Error Message',
   *   }),
   * });
   *
   * const route = new ZodOpenAPISchema({
   *   400: {
   *     description: 'Bad Request',
   *     content: { 'application/json': { schema: errorResponseSchema } },
   *   },
   *   500: {
   *     description: 'Internal Server Error',
   *     content: { 'application/json': { schema: errorResponseSchema } },
   *   },
   * } as const);
   *
   * const responseBodySchema = z.object({
   *   result: z.string().meta({
   *     example: 'Hello World!',
   *     description: 'Sample Endpoint Response',
   *   }),
   * });
   *
   * const rootRoute = route.createSchema(
   *   {
   *     path: '/',
   *     method: 'get',
   *     description: 'Sample Endpoint',
   *     responses: {
   *       200: {
   *         description: 'OK',
   *         content: {
   *           'application/json': {
   *             schema: responseBodySchema,
   *           },
   *         },
   *       },
   *     },
   *   },
   *   [400, 500]
   * );
   * ```
   */
  createSchema<R extends RouteConfig, T extends Readonly<UserDefinedStatusCode<M>[]>>(
    route: R,
    statusCodes?: UniqueTuple<UserDefinedStatusCode<M>, T>
  ): R {
    if (statusCodes) {
      const extraResponses: ResponsesConfig = {};
      // Collect responses for the specified status codes
      for (const statusCode of statusCodes) {
        const response = this.responses[statusCode];
        // Add only status codes that are defined by the user.
        if (response) {
          extraResponses[statusCode] = response;
        }
      }

      return {
        ...route,
        responses: {
          ...extraResponses,
          ...route.responses,
        },
      } as R;
    }
    // When no status codes are provided, return the route as is.
    return route;
  }
}
