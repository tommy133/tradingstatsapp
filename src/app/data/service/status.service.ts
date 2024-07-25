import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Status } from '../models/status';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private apiServerUrl = `${environment.apiBaseUrl}/statuses`;

  constructor(private http: HttpClient) {}

  statuses$ = this.getStatuses().pipe(
    map((statuses: Status[]) => this.transformToMap(statuses)),
  );
  public getStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(`${this.apiServerUrl}`);
  }

  private transformToMap(statuses: Status[]): { [key: string]: number } {
    const statusMap: { [key: string]: number } = {};
    statuses.forEach((status) => {
      statusMap[status.name_st] = status.id_st;
    });
    return statusMap;
  }
}
