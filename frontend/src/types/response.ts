export interface Response<TResult> {
  ok: boolean;
  status: number;
  headers: unknown;
  data: TResult | undefined;
}

export interface FetchError<T> extends Error {
  response: Response<T>;
  url: string;
}
