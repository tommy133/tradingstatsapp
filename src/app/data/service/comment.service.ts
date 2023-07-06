import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private serverUrl = `${environment.mockBaseUrl}/projections`;

  constructor(private http: HttpClient) {}

  public addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.serverUrl}`, comment);
  }
}
