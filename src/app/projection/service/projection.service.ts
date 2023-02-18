import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Projection } from '../model/projection';

@Injectable({
  providedIn: 'root'
})
export class ProjectionService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getProjections(): Observable<Projection[]> {
    return this.http.get<Projection[]>(`${this.apiServerUrl}/projection/all`)
  }

  public addProjection(projection: Projection): Observable<Projection> {
    return this.http.post<Projection>(`${this.apiServerUrl}/projection/add`, projection);
  }

  public updateProjection(projection: Projection): Observable<Projection> {
    return this.http.put<Projection>(`${this.apiServerUrl}/projection/update`, projection);
  }

  public deleteProjection(projectionId: number): Observable<Projection> {
    return this.http.delete<Projection>(`${this.apiServerUrl}/projection/delete/${projectionId}`);
  }
}
