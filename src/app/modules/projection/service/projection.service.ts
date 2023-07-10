import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Projection } from '../model/projection';
import { ProjectionCreateInput } from '../model/projectionCreateInput';

@Injectable({
  providedIn: 'root',
})
export class ProjectionService {
  private apiServerUrl = `${environment.apiBaseUrl}/projections`;

  constructor(private http: HttpClient) {}

  public getProjections(): Observable<Projection[]> {
    return this.http.get<Projection[]>(`${this.apiServerUrl}`);
  }

  public getProjection(projectionId: number): Observable<Projection> {
    return this.http.get<Projection>(`${this.apiServerUrl}/${projectionId}`);
  }

  public addProjection(projectionCreateInput: ProjectionCreateInput) {
    return this.http.post(`${this.apiServerUrl}`, projectionCreateInput);
  }

  public updateProjection(projection: Projection): Observable<Projection> {
    return this.http.put<Projection>(
      `${this.apiServerUrl}/${projection.id_proj}`,
      projection,
    );
  }

  public deleteProjection(projectionId: number): Observable<Projection> {
    return this.http.delete<Projection>(`${this.apiServerUrl}/${projectionId}`);
  }
}
