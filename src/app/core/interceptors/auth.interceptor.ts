import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, shareReplay, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

let refreshRequest$: Observable<void> | null = null;

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const isApiRequest = request.url.startsWith(environment.apiUrl);
  const isAuthRequest = request.url.startsWith(`${environment.apiUrl}/auth/`);
  const requestWithCookies = isApiRequest
    ? request.clone({ withCredentials: true })
    : request;

  if (!isApiRequest || isAuthRequest) {
    return next(requestWithCookies);
  }

  const auth = inject(AuthService);
  return next(requestWithCookies).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      refreshRequest$ ??= auth.refresh().pipe(
        finalize(() => refreshRequest$ = null),
        shareReplay({ bufferSize: 1, refCount: false })
      );

      return refreshRequest$.pipe(
        switchMap(() => next(requestWithCookies))
      );
    })
  );
};
