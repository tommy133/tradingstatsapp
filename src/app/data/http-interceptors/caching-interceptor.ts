import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (req.method !== 'GET' || !req.url.includes('http')) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && event.status === 200) {
          this.invalidateCache(req.url);
          localStorage.setItem(req.url, JSON.stringify(event.body));
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const fallBackCacheData = JSON.parse(localStorage.getItem(req.url)!);
        if (fallBackCacheData) {
          const cachedResponse = new HttpResponse({
            body: fallBackCacheData,
            status: 200,
            statusText: 'OK',
            url: req.url,
          });
          return of(cachedResponse);
        } else {
          return throwError(error);
        }
      }),
    );
  }

  private invalidateCache(url: string): void {
    localStorage.removeItem(url);
  }
}
