import type { RouteConfig } from '@hono/zod-openapi';
import type { StatusCode } from 'hono/utils/http-status';

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
