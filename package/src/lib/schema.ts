import type { RouteConfig } from '@hono/zod-openapi';
import type { NeverWrapper, ResponsesConfig, UniqueTuple, UserDefinedStatusCode } from './types';

/**
 * A class that helps create OpenAPI response schemas using Zod schemas.
 */
export class ZodOpenAPISchema<M extends ResponsesConfig> {
  private responses: Readonly<M>;
  /**
   * Constructor to initialize the ZodOpenAPISchema class with a ResponsesConfig type object.
   * @param responses ResponsesConfig type object (A type object that defines response schemas for each status code. This type object is provided by the user.)
   */
  constructor(responses: M) {
    this.responses = responses;
  }

  // Overload signatures
  // statusCodes argument omitted
  createSchema<R extends RouteConfig>(route: R): R;
  // statusCodes argument included
  createSchema<R extends RouteConfig, T extends Readonly<UserDefinedStatusCode<M>[]>>(
    route: R,
    statusCodes: NeverWrapper<UserDefinedStatusCode<M>, T>
  ): R;

  /**
   * Create a new RouteConfig type object by adding specified status codes to the responses of the given route.
   * @param route RouteConfig type object (This type object  is provided by @hono/zod-openapi).
   * @param statusCodes An array of status codes (only user-defined ones) to be added to the route. (This argument is optional.)
   * @returns A RouteConfig type object with the specified status codes added to the responses.
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
        // This process adds only status codes that are defined by the user.
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
