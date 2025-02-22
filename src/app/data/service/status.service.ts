import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Status } from '../models/status';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private apiServerUrl = `${environment.apiBaseUrl}/statuses`;

  constructor(private http: HttpClient) {}

  statuses$ = this.getStatuses().pipe(shareReplay(1));
  statusesMap$ = this.getStatuses().pipe(
    map((statuses: Status[]) => this.transformToMap(statuses)),
    shareReplay(1),
  );
  public getStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(`${this.apiServerUrl}`);
  }

  public getStatusColorClass(status: Status): string {
    switch (status.name_st) {
      case 'OPEN':
        return 'text-blue-300';
      case 'WATCHING':
        return 'text-yellow-600';
      case 'TRIGGER':
        return 'text-orange-500';
      default:
        return '';
    }
  }

  private transformToMap(statuses: Status[]): { [key: string]: number } {
    const statusMap: { [key: string]: number } = {};
    statuses.forEach((status) => {
      statusMap[status.name_st] = status.id_st;
    });
    return statusMap;
  }
}
