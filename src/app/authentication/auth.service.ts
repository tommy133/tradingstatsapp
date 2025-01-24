import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

interface LoginResponse {
  user: {
    id: number;
    username: string;
    proj_bm: number;
    op_bm: number;
    inserted_at: Date;
    updated_at: Date;
  };
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiServerUrl = environment.apiBaseUrl;

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${this.apiServerUrl}/users/login`, {
      username: username,
      password: password,
    });
  }

  setUserSession(res: LoginResponse) {
    localStorage.setItem('access_token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
  }

  logout() {
    //delete full local storage
    localStorage.clear();
  }
}
