export type MDSErrorTags =
  | "consolidation_error"
  | "txpow_to_big"
  | "split_error"

export const DEFAULT_ERROR_TAG = "server_error"

type DefaultErrorTag = typeof DEFAULT_ERROR_TAG

export type AllErrorTags = MDSErrorTags | DefaultErrorTag

export interface Failure<E> {
  success: false
  error: E
  code: AllErrorTags
}

export interface Success<T> {
  success: true
  data: T
}

export const Failure = <T>(error: T, code: AllErrorTags): Failure<T> => ({
  success: false,
  error,
  code,
})

export const Success = <T>(data: T): Success<T> => ({ success: true, data })

export class CustomError<T> extends Error {
  public error_tag: T | DefaultErrorTag

  constructor(message: string, error_tag?: T) {
    super(message)
    this.error_tag = error_tag ?? DEFAULT_ERROR_TAG
  }
}
