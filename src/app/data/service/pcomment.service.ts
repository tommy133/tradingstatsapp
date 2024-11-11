import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay, switchMap } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { environment } from 'src/environments/environment';
import {
  CreateProjectionCommentInput,
  ProjectionComment,
} from '../models/pcomment';

@Injectable({
  providedIn: 'root',
})
export class ProjectionCommentService {
  private httpClient = inject(HttpClient);
  private toastService = inject(ToastService);

  private serverUrl = `${environment.apiBaseUrl}/pcomments`;

  private fetchSignal = new BehaviorSubject(null);
  public refetch() {
    this.fetchSignal.next(null);
  }

  public projectionComments$ = this.fetchSignal.asObservable().pipe(
    switchMap(() => this.getComments()),
    shareReplay(1),
  );

  public getComments(): Observable<ProjectionComment[]> {
    return this.httpClient.get<ProjectionComment[]>(`${this.serverUrl}`);
  }

  public getCommentsById(projId: number): Observable<ProjectionComment[]> {
    return this.httpClient.get<ProjectionComment[]>(
      `${this.serverUrl}/${projId}`,
    );
  }

  public addComment(comment: CreateProjectionCommentInput) {
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

  public deleteComment(projId: number) {
    return this.httpClient.delete(`${this.serverUrl}/${projId}`);
  }
}
