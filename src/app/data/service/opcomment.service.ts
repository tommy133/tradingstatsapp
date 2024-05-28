import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  CreateOperationCommentInput,
  OperationComment,
} from '../models/opcomment';

@Injectable({
  providedIn: 'root',
})
export class OperationCommentService {
  private serverUrl = `${environment.apiBaseUrl}/opcomments`;

  constructor(private http: HttpClient) {}

  public getComments(): Observable<OperationComment[]> {
    return this.http.get<OperationComment[]>(`${this.serverUrl}`);
  }

  public getCommentsById(projId: number): Observable<OperationComment[]> {
    return this.http.get<OperationComment[]>(`${this.serverUrl}/${projId}`);
  }

  public getComment(operationId: number): Observable<OperationComment> {
    return this.http.get<OperationComment>(`${this.serverUrl}/${operationId}`);
  }

  public addComment(comment: CreateOperationCommentInput) {
    return this.http.post<number>(`${this.serverUrl}`, comment);
  }

  public deleteComment(operationId: number) {
    return this.http.delete(`${this.serverUrl}/${operationId}`);
  }
}
