import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay, switchMap } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { environment } from 'src/environments/environment';
import {
  CreateOperationCommentInput,
  OperationComment,
} from '../models/opcomment';

@Injectable({
  providedIn: 'root',
})
export class OperationCommentService {
  private httpClient = inject(HttpClient);
  private toastService = inject(ToastService);

  private serverUrl = `${environment.apiBaseUrl}/opcomments`;

  private fetchSignal = new BehaviorSubject(null);
  public refetch() {
    this.fetchSignal.next(null);
  }

  public operationComments$ = this.fetchSignal.asObservable().pipe(
    switchMap(() => this.getComments()),
    shareReplay(1),
  );

  public getComments(): Observable<OperationComment[]> {
    return this.httpClient.get<OperationComment[]>(`${this.serverUrl}`);
  }

  public getCommentsById(projId: number): Observable<OperationComment[]> {
    return this.httpClient.get<OperationComment[]>(
      `${this.serverUrl}/${projId}`,
    );
  }

  public getComment(operationId: number): Observable<OperationComment> {
    return this.httpClient.get<OperationComment>(
      `${this.serverUrl}/${operationId}`,
    );
  }

  public addComment(comment: CreateOperationCommentInput) {
    return this.httpClient.post<number>(`${this.serverUrl}`, comment).pipe(
      map(
        (res) => {
          this.refetch();
          return res;
        },
        (error: HttpErrorResponse) => {
          this.toastService.error({
            message: error.message,
          });
        },
      ),
    );
  }

  public deleteComment(operationId: number) {
    return this.httpClient.delete(`${this.serverUrl}/${operationId}`);
  }
}
