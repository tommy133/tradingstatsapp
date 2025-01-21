import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'tradingstatsapp';
  constructor(private http: HttpClient) {}
  private apiServerUrl = `http://localhost:8080/api/users/login`;

  send() {
    this.http
      .post<LoginResponse>(`${this.apiServerUrl}`, {
        username: 'Tomeu',
        password: 'Tstatsengineer123;',
      })
      .subscribe((res) => {
        if (res.token) {
          this.setUserSession(res);
        }
      });
  }

  setUserSession(res: LoginResponse) {
    localStorage.setItem('access_token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
  }
}
