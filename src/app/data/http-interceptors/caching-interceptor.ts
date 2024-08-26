import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  //A lot of room for improvement here
  private cacheableUrls = [
    /\/projections\/?$/,
    /\/operations\/?$/,
    /\/statuses\/?$/,
    /\/markets\/?$/,
    /\/symbols\/?$/,
    /\/pcomments\/?$/,
    /\/opcomments\/?$/,
  ];
  private detailedUrls = [
    /\/projections\/\d+$/,
    /\/operations\/\d+$/,
    /\/statuses\/\d+$/,
    /\/markets\/\d+$/,
    /\/symbols\/\d+$/,
    /\/pcomments\/\d+$/,
    /\/opcomments\/\d+$/,
  ];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (req.method !== 'GET' || !req.url.includes('http')) {
      return next.handle(req);
    }

    const isCacheableUrl = this.cacheableUrls.some((pattern) =>
      pattern.test(req.url),
    );
    const isDetailedUrl = this.detailedUrls.some((pattern) =>
      pattern.test(req.url),
    );

    return next.handle(req).pipe(
      tap((event) => {
        if (
          event instanceof HttpResponse &&
          event.status === 200 &&
          isCacheableUrl
        ) {
          localStorage.setItem(req.url, JSON.stringify(event.body));
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (isCacheableUrl) {
          const fallBackCacheData = JSON.parse(localStorage.getItem(req.url)!);
          if (fallBackCacheData) {
            const cachedResponse = new HttpResponse({
              body: fallBackCacheData,
              status: 200,
              statusText: 'OK',
              url: req.url,
            });
            return of(cachedResponse);
          }
        } else if (isDetailedUrl) {
          const idMatch = req.url.match(/\/(\d+)$/);
          if (idMatch) {
            const id = idMatch[1];
            const baseUrl = req.url.replace(/\/\d+$/, '');
            const cachedData = JSON.parse(localStorage.getItem(baseUrl)!);
            let item;
            if (baseUrl.includes('opcomments')) {
              item = this.getOpcomments(cachedData, id);
            } else if (baseUrl.includes('pcomments')) {
              item = this.getProjectionComments(cachedData, id);
            } else {
              item = this.getItemFromCache(cachedData, id);
            }
            if (cachedData && item) {
              const cachedResponse = new HttpResponse({
                body: item,
                status: 200,
                statusText: 'OK',
                url: req.url,
              });
              return of(cachedResponse);
            }
          }
        }
        return throwError(error);
      }),
    );
  }
  // TODO Remove this and refactor models to have id instead id_st, id_mkt, id_opc,...
  private getItemFromCache(data: any[], id: string) {
    return data.find(
      (item) =>
        item.id === Number(id) ||
        item.id_st === Number(id) ||
        item.id_mkt === Number(id),
    );
  }

  private getProjectionComments(data: any[], id: string) {
    return data.filter((item) => item.id_proj === Number(id));
  }
  private getOpcomments(data: any[], id: string) {
    return data.filter((item) => item.id_op === Number(id));
  }
}
