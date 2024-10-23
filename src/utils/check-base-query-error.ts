import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export interface ErrorResponse {
  message: string;
}

export function isFetchBaseQueryError(error: any): error is FetchBaseQueryError {
  return error && typeof error.status === 'number' && 'data' in error;
}
