import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Operation } from 'src/app/operation/model/operation';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  public getOperations(): Observable<Operation[]> {
    return this.http.get<Operation[]>(`${this.apiServerUrl}/operation/all`);
  }

  public addOperation(operation: Operation): Observable<Operation> {
    return this.http.post<Operation>(
      `${this.apiServerUrl}/operation/add`,
      operation,
    );
  }

  public updateOperation(operation: Operation): Observable<Operation> {
    return this.http.put<Operation>(
      `${this.apiServerUrl}/operation/update`,
      operation,
    );
  }

  public deleteOperation(operationId: number): Observable<Operation> {
    return this.http.delete<Operation>(
      `${this.apiServerUrl}/operation/delete/${operationId}`,
    );
  }
}
