import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Market } from '../models/market';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  private apiServerUrl = `${environment.apiBaseUrl}/markets`;

  constructor(private http: HttpClient) {}

  public getMarkets(): Observable<Market[]> {
    return this.http.get<Market[]>(`${this.apiServerUrl}`);
  }
}
