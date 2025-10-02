import type { RouteConfig } from '@hono/zod-openapi';
import type { NeverWrapper, ResponsesConfig, UniqueTuple, UserDefinedStatusCode } from './types';

export class ZodOpenAPISchema<M extends ResponsesConfig> {
  private responses: Readonly<M>;
  constructor(responses: M) {
    this.responses = responses;
  }

  // NOTE
  /*
    オプショナルな引数であることによって、never型のときにundefinedになって型の不整合のエラーを起こしていたのを
    オーバーロードで引数なしとありの2パターンを用意することで独自型が目的の型との型の不整合を起こさせることができ、
    その結果、型推論によって発生するエラーに独自型を表出させることができたっぽい。
  */
  // 引数なし
  createSchema<R extends RouteConfig>(route: R): R;
  // 引数あり
  createSchema<R extends RouteConfig, T extends Readonly<UserDefinedStatusCode<M>[]>>(
    route: R,
    statusCodes: NeverWrapper<UserDefinedStatusCode<M>, T>
  ): R;

  createSchema<R extends RouteConfig, T extends Readonly<UserDefinedStatusCode<M>[]>>(
    route: R,
    statusCodes?: UniqueTuple<UserDefinedStatusCode<M>, T>
  ): R {
    if (statusCodes) {
      const extraResponses: ResponsesConfig = {};
      for (const statusCode of statusCodes) {
        const response = this.responses[statusCode];
        // Add only if the response is defined
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
    // If no status codes are provided, return the original route
    return route;
  }
}
