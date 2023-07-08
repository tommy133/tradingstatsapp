import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Status } from '../models/status';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private apiServerUrl = `${environment.apiBaseUrl}/statuses`;

  constructor(private http: HttpClient) {}

  public getStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(`${this.apiServerUrl}`);
  }
}
