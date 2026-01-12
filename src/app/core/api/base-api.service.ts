import { inject, Inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  HttpParams,
} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, PaginatedResult, PaginationMeta } from './api-response.model';
import { API_BASE_URL } from './api-tokens';

export interface RequestOptions {
 params?: HttpParams | object;
  context?: HttpContext;
}

/**
 * BaseApiService
 * - Construye URLs a partir de una base
 * - Hace peticiones tipadas ApiResponse<T>
 * - Desenvuelve la propiedad `data` y lanza error si `success === false`
 */
@Injectable()
export abstract class BaseApiService {
  protected readonly http = inject(HttpClient);

  constructor(
    @Inject(API_BASE_URL) private readonly apiBaseUrl: string,
  ) {}

  protected buildUrl(path: string): string {
    if (!path) return this.apiBaseUrl;
    // evita dobles barras
    return `${this.apiBaseUrl.replace(/\/$/, '')}/${path.replace(
      /^\/+/,
      '',
    )}`;
  }

  /** GET paginado que devuelve { items, meta } */
  protected getPaginated<T>(
    path: string,
    options?: RequestOptions,
  ): Observable<PaginatedResult<T>> {
    return this.http
      .get<ApiResponse<T[], PaginationMeta>>(
        this.buildUrl(path),
        this.mapOptions(options),
      )
      .pipe(
        map((res) => {
          if (!res.success) {
            // ApiErrorResponse<unknown>
            throw res;
          }
          if (!res.meta) {
            throw new Error('Respuesta paginada sin meta');
          }
          return {
            items: res.data,
            meta: res.meta,
          };
        }),
      );
  }

  /** GET que devuelve directamente el data: T */
  protected getData<T>(
    path: string,
    options?: RequestOptions,
  ): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(
        this.buildUrl(path),
        this.mapOptions(options),
      )
      .pipe(map(this.unwrapResponse));
  }

  /** POST que devuelve data: T */
  protected postData<TBody, TResponse>(
    path: string,
    body: TBody,
    options?: RequestOptions,
  ): Observable<TResponse> {
    return this.http
      .post<ApiResponse<TResponse>>(
        this.buildUrl(path),
        body,
        this.mapOptions(options),
      )
      .pipe(map(this.unwrapResponse));
  }

  protected patchData<TBody, TResponse>(
    path: string,
    body: TBody,
    options?: RequestOptions,
  ): Observable<TResponse> {
    return this.http
      .patch<ApiResponse<TResponse>>(
        this.buildUrl(path),
        body,
        this.mapOptions(options),
      )
      .pipe(map(this.unwrapResponse));
  }

  protected deleteData<TResponse = void>(
    path: string,
    options?: RequestOptions,
  ): Observable<TResponse> {
    return this.http
      .delete<ApiResponse<TResponse>>(
        this.buildUrl(path),
        this.mapOptions(options),
      )
      .pipe(map(this.unwrapResponse));
  }

  /** Si alguna vez quieres la ApiResponse completa */
  protected getResponse<T>(
    path: string,
    options?: RequestOptions,
  ): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(
      this.buildUrl(path),
      this.mapOptions(options),
    );
  }

  private unwrapResponse = <T>(res: ApiResponse<T>): T => {
    if (!res.success) {
      // Aquí NO mostramos nada, solo lanzamos.
      // El interceptor global se encargará de mostrar toasts, etc.
      throw res; // res es ApiErrorResponse<unknown>
    }
    return res.data;
  };

  /**
   * Normaliza RequestOptions para HttpClient:
   * - Si params ya es HttpParams, lo respeta.
   * - Si es un objeto, convierte valores a string/string[].
   */
  private mapOptions(
  options?: RequestOptions,
): { params?: HttpParams; context?: HttpContext } | undefined {
  if (!options) return undefined;

  const { params, context } = options;

  // 1) Ya es HttpParams → lo devolvemos tal cual
  if (params instanceof HttpParams) {
    return { params, context };
  }

  // 2) No hay params → solo context (si existe)
  if (!params) {
    return context ? { context } : undefined;
  }

  // 3) Es un objeto plano (VehicleCategoryQuery, etc.)
  const raw = params as Record<string, unknown>;
  const fromObject: Record<string, string | string[]> = {};

  for (const [key, value] of Object.entries(raw)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      fromObject[key] = value.map((v) => String(v));
    } else {
      fromObject[key] = String(value);
    }
  }

  const httpParams = new HttpParams({ fromObject });

  return { params: httpParams, context };
}
}
