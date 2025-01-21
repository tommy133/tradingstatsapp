import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SetTokenRequestInterceptor implements HttpInterceptor {
  private readonly accessToken: string | null;

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
    return next.handle(req);
  }
}
