import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SetTokenRequestInterceptor implements HttpInterceptor {
  private readonly accessToken: string | null;
  private router = inject(Router);

  constructor() {
    this.accessToken = localStorage.getItem('access_token');
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (this.accessToken) {
      const modReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      return next.handle(modReq);
    }
    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Token expired, redirect to login page
          this.router.navigate(['/login']);
        }
        return throwError(error);
      }),
    );
  }
}
