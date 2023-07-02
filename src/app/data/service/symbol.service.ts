import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Symbol {
  id?: number;
  name_sym?: string;
  description?: string;
  name_mkt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SymbolService {
  private apiServerUrl = `${environment.apiBaseUrl}/symbols`;

  constructor(private http: HttpClient) {}

  public getSymbols(): Observable<Symbol[]> {
    return this.http.get<Symbol[]>(`${this.apiServerUrl}`);
  }

  public getSymbol(symbolId: number): Observable<Symbol> {
    return this.http.get<Symbol>(`${this.apiServerUrl}/${symbolId}`);
  }

  public addSymbol(symbol: Symbol): Observable<Symbol> {
    return this.http.post<Symbol>(`${this.apiServerUrl}`, symbol);
  }

  public updateSymbol(symbol: Symbol): Observable<Symbol> {
    return this.http.put<Symbol>(`${this.apiServerUrl}/${symbol.id}`, symbol);
  }

  public deleteSymbol(symbolId: number): Observable<Symbol> {
    return this.http.delete<Symbol>(`${this.apiServerUrl}/${symbolId}`);
  }
}
