import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/data/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiServerUrl = `${environment.apiBaseUrl}/users`;
  private httpClient = inject(HttpClient);

  public currentUser(): Observable<User> {
    return this.httpClient.get<User>(`${this.apiServerUrl}/current_user`);
  }

  public users(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiServerUrl}`);
  }

  public getUserById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.apiServerUrl}/${id}`);
  }

  public createUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${this.apiServerUrl}/register`, user);
  }

  public updateUser(user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.apiServerUrl}/${user.id}`, user);
  }
}
