import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectionComment } from '../models/pcomment';

@Injectable({
  providedIn: 'root',
})
export class ProjectionCommentService {
  private serverUrl = `${environment.apiBaseUrl}/pcomment`;

  constructor(private http: HttpClient) {}

  public getComments(): Observable<ProjectionComment[]> {
    return this.http.get<ProjectionComment[]>(`${this.serverUrl}`);
  }

  public getComment(projId: number): Observable<ProjectionComment> {
    return this.http.get<ProjectionComment>(`${this.serverUrl}/${projId}`);
  }

  public addComment(comment: ProjectionComment) {
    return this.http.post(`${this.serverUrl}`, comment);
  }

  public updateComment(comment: ProjectionComment) {
    return this.http.put(`${this.serverUrl}/${comment.id_pc}`, comment);
  }

  public deleteComment(projId: number) {
    return this.http.delete(`${this.serverUrl}/${projId}`);
  }
}
