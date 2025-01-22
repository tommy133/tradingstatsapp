import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';

@Injectable({
  providedIn: 'root',
})
export class SetTokenRequestInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private toast = inject(ToastService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      const modReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return next.handle(modReq);
    }
    return next.handle(req).pipe(
      catchError((error) => {
        console.log('Error:', error);

        this.toast.error(error);

        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(error);
      }),
    );
  }
}
