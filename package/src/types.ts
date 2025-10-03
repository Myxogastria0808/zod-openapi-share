import type { RouteConfig } from '@hono/zod-openapi';

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

export type ResponsesEntry = NonNullable<RouteConfig['responses']>[StatusCode];
export type ResponsesConfig = Partial<Record<StatusCode, ResponsesEntry>>;
/** ユーザーが渡したマップ M に実在するステータスコードだけを抽出 */
export type UserDefinedStatusCode<M extends ResponsesConfig> = Extract<StatusCode, keyof M>;

/** 重複している要素を返す型 */
type DuplicateStatusCode<
  Elm extends UserDefinedStatusCode<ResponsesConfig>,
  Arr extends Readonly<Elm[]>,
  Seen extends Readonly<Elm[]> = [],
  Duplication extends Readonly<Elm[]> = []
> = Arr extends Readonly<[infer Head extends Elm, ...infer Tail extends Elm[]]>
  ? Head extends Seen[number]
    ? DuplicateStatusCode<Elm, Tail, Seen, [...Duplication, Head]>
    : DuplicateStatusCode<Elm, Tail, [...Seen, Head], Duplication>
  : Duplication;

/** タプル Arr が重複を含んでいたら never、そうでなければ Arr をそのまま返す型 */
export type UniqueTuple<
  Elm extends UserDefinedStatusCode<ResponsesConfig>,
  Arr extends Readonly<Elm[]>,
  Seen extends Readonly<Elm[]> = []
> = Arr extends Readonly<[infer Head extends Elm, ...infer Tail extends Elm[]]>
  ? Head extends Seen[number]
    ? never
    : Readonly<[Head, ...UniqueTuple<Elm, Tail, [...Seen, Head]>]>
  : Arr;

/** never型のときは、独自型を返して型の不整合のエラーを表出させる型 */
export type NeverWrapper<Elm extends UserDefinedStatusCode<ResponsesConfig>, T extends Readonly<Elm[]>> = UniqueTuple<
  Elm,
  T
> extends never
  ? {
      __error: 'Status codes must be unique.';
      __duplicate_status_codes: DuplicateStatusCode<Elm, T>;
    }
  : UniqueTuple<Elm, T>;
