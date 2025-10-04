import type { RouteConfig } from '@hono/zod-openapi';

/**
 * The union type representing all standard HTTP status codes and a special code `-1`.
 */
export type StatusCode =
  | 100
  | 102
  | 103
  | 200
  | 201
  | 202
  | 203
  | 206
  | 207
  | 208
  | 226
  | 300
  | 301
  | 302
  | 303
  | 305
  | 306
  | 307
  | 308
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 425
  | 426
  | 428
  | 429
  | 431
  | 451
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 510
  | 511
  | -1;

/**
 * The `ResponseConfig | ReferenceObject` provided by @hono/zod-openapi.
 */
export type ResponsesEntry = NonNullable<RouteConfig['responses']>[StatusCode];
/**
 * The type representing user-defined responses configuration.
 */
export type ResponsesConfig = Partial<Record<StatusCode, ResponsesEntry>>;
/**
 * The type representing user-defined status codes extracted from the user-defined responses configuration.
 *
 * @template M - The user-defined status codes type (M extends ResponsesConfig).
 * @extends {ResponsesConfig}
 */
export type UserDefinedStatusCode<M extends ResponsesConfig> = Extract<StatusCode, keyof M>;

/**
 * The type that identifies duplicate elements in a tuple. \
 * If there are no duplicates, it returns an empty tuple.
 *
 * @template Elm - The type of elements in the tuple (Elm extends UserDefinedStatusCode<ResponsesConfig>).
 * @template Arr - The tuple type to check for duplicates (Arr extends Readonly<Elm[]>).
 * @template Seen - The tuple type that keeps track of seen elements (default is an empty tuple).
 * @template Duplication - The tuple type that accumulates duplicate elements (default is an empty tuple).
 */
export type DuplicateStatusCode<
  Elm extends UserDefinedStatusCode<ResponsesConfig>,
  Arr extends Readonly<Elm[]>,
  Seen extends Readonly<Elm[]> = [],
  Duplication extends Readonly<Elm[]> = []
> = Arr extends Readonly<[infer Head extends Elm, ...infer Tail extends Elm[]]>
  ? Head extends Seen[number]
    ? DuplicateStatusCode<Elm, Tail, Seen, [...Duplication, Head]>
    : DuplicateStatusCode<Elm, Tail, [...Seen, Head], Duplication>
  : Duplication;

/**
 * The type that checks for duplicates in a tuple. \
 * If duplicates are found, it returns `never`; otherwise, it returns `Arr`.
 *
 * @template Elm - The type of elements in the tuple (Elm extends UserDefinedStatusCode<ResponsesConfig>).
 * @template Arr - The tuple type to check for uniqueness (Arr extends Readonly<Elm[]>).
 * @template Seen - The tuple type that keeps track of seen elements (default is an empty tuple).
 */
export type UniqueTuple<
  Elm extends UserDefinedStatusCode<ResponsesConfig>,
  Arr extends Readonly<Elm[]>,
  Seen extends Readonly<Elm[]> = []
> = Arr extends Readonly<[infer Head extends Elm, ...infer Tail extends Elm[]]>
  ? Head extends Seen[number]
    ? never
    : Readonly<[Head, ...UniqueTuple<Elm, Tail, [...Seen, Head]>]>
  : Arr;

/**
 * The type that if Elm satisfies `Elm extends never`, it returns zod-openapi-share defined error type (`{ __error: 'Status codes have to be unique.'; __duplicate_status_codes: DuplicateStatusCode<Elm, T>;}`); otherwise, it returns `Arr`.
 *
 * @template Elm - The type of elements in the tuple (Elm extends UserDefinedStatusCode<ResponsesConfig>).
 * @template T - The tuple type to check for uniqueness (T extends Readonly<Elm[]>).
 */
export type NeverWrapper<Elm extends UserDefinedStatusCode<ResponsesConfig>, T extends Readonly<Elm[]>> = UniqueTuple<
  Elm,
  T
> extends never
  ? {
      __error: 'Status codes have to be unique.';
      __duplicate_status_codes: DuplicateStatusCode<Elm, T>;
    }
  : UniqueTuple<Elm, T>;
