import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  CreateProjectionCommentInput,
  ProjectionComment,
} from '../models/pcomment';

@Injectable({
  providedIn: 'root',
})
export class ProjectionCommentService {
  private serverUrl = `${environment.apiBaseUrl}/pcomments`;

  constructor(private http: HttpClient) {}

  public getComments(): Observable<ProjectionComment[]> {
    return this.http.get<ProjectionComment[]>(`${this.serverUrl}`);
  }

  public getComment(projId: number): Observable<ProjectionComment> {
    return this.http.get<ProjectionComment>(`${this.serverUrl}/${projId}`);
  }

  public addComment(comment: CreateProjectionCommentInput) {
    return this.http.post<number>(`${this.serverUrl}`, comment);
  }

  public deleteComment(projId: number) {
    return this.http.delete(`${this.serverUrl}/${projId}`);
  }
}
