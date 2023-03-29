import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Projection } from '../model/projection';

@Injectable({
  providedIn: 'root',
})
export class ProjectionService {
  apiServerUrl = `${environment.apiBaseUrl}/projections`;
  fetchSignal = new BehaviorSubject(null);
  projections$ = this.fetchSignal
    .asObservable()
    .pipe(switchMap(() => this.getProjections()));

  constructor(private http: HttpClient) {}

  public getProjections(): Observable<Projection[]> {
    return this.http.get<Projection[]>(`${this.apiServerUrl}`);
  }

  public getProjection(projectionId: number): Observable<Projection> {
    return this.http.get<Projection>(`${this.apiServerUrl}/${projectionId}`);
  }

  public addProjection(projection: Projection) {
    this.http.post<Projection>(`${this.apiServerUrl}`, projection);
    this.refetch();
  }

  public updateProjection(projection: Projection) {
    this.http.put<Projection>(
      `${this.apiServerUrl}/${projection.id}`,
      projection
    );
    this.refetch();
  }

  public deleteProjection(projectionId: number) {
    this.http.delete<Projection>(`${this.apiServerUrl}/${projectionId}`);
    this.refetch();
  }

  refetch() {
    this.fetchSignal.next(null);
  }
}
