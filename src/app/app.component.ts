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
export class AppComponent {}
