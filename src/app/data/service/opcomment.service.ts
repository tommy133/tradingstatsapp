import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OperationComment } from '../models/opcomment';

@Injectable({
  providedIn: 'root',
})
export class OperationCommentService {
  private serverUrl = `${environment.apiBaseUrl}/opcomment`;

  constructor(private http: HttpClient) {}

  public getComments(): Observable<OperationComment[]> {
    return this.http.get<OperationComment[]>(`${this.serverUrl}`);
  }

  public getComment(operationId: number): Observable<OperationComment> {
    return this.http.get<OperationComment>(`${this.serverUrl}/${operationId}`);
  }

  public addComment(comment: OperationComment) {
    return this.http.post<number>(`${this.serverUrl}`, comment);
  }

  public updateComment(comment: OperationComment) {
    return this.http.put<number>(
      `${this.serverUrl}/${comment.id_opc}`,
      comment,
    );
  }

  public deleteComment(operationId: number) {
    return this.http.delete(`${this.serverUrl}/${operationId}`);
  }
}
