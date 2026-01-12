import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiErrorInterceptor } from './core/http/interceptors/api-error.interceptor';
import { API_BASE_URL } from './core/api/api-tokens';
import { environment } from '../environments/environment.development';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideStore(),
    provideEffects(),
    provideHttpClient(
      withInterceptors([
        apiErrorInterceptor,
        // aquí añades otros interceptors: authInterceptor, etc.
      ]),
    ),
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
  ],
};
