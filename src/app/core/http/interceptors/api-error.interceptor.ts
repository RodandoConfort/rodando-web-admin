import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { ApiErrorResponse, ApiResponse } from '../../api/api-response.model';

export interface NormalizedApiError {
  status: number;
  message: string;
  code?: string | null;
  details?: any;
  rawError: any;
}

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifier = inject(NotificationService);

  return next(req).pipe(
    catchError((err: unknown) => {
      // 1) No es HttpErrorResponse → algo raro
      if (!(err instanceof HttpErrorResponse)) {
        notifier.showError('Ha ocurrido un error inesperado.');
        return throwError(() => err);
      }

      const httpError = err as HttpErrorResponse;

      // 2) Error de red / conexión
      if (httpError.status === 0) {
        notifier.showError(
          'No se pudo conectar con el servidor. Revisa tu conexión a internet.',
        );
        const normalized: NormalizedApiError = {
          status: 0,
          message: 'Network error',
          rawError: httpError,
        };
        return throwError(() => normalized);
      }

      // 3) Intentar parsear como ApiResponse
      const body = httpError.error as ApiResponse<any> | any;

      let normalized: NormalizedApiError = {
        status: httpError.status,
        message: 'Ha ocurrido un error en la petición.',
        rawError: httpError,
      };

      if (body && body.success === false) {
        const apiError = body as ApiErrorResponse<any>;
        normalized = {
          status: httpError.status,
          message: apiError.message || 'Error en la API.',
          code: apiError.error?.code ?? null,
          details: apiError.error?.details,
          rawError: httpError,
        };
      } else if (typeof body?.message === 'string') {
        // NestJS clásico a veces devuelve { message: '...' }
        normalized.message = body.message;
      }

      // Mostrar mensaje (puedes mejorar esto por código/status/etc.)
      notifier.showError(normalized.message);

      // Rethrow normalizado para que los componentes/stores puedan manejarlo
      return throwError(() => normalized);
    }),
  );
};
