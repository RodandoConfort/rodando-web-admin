export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface ApiError<TDetails = unknown> {
  code?: string | null;
  details?: TDetails;
}

export interface ApiErrorResponse<TDetails = unknown> {
  success: false;
  message: string;
  error: ApiError<TDetails>;
}

export interface ApiSuccessResponse<TData, TMeta = PaginationMeta | undefined> {
  success: true;
  message: string;
  data: TData;
  meta?: TMeta;
}

export type ApiResponse<
  TData = any,
  TMeta = PaginationMeta | undefined,
  TDetails = any,
> = ApiSuccessResponse<TData, TMeta> | ApiErrorResponse<TDetails>;

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

