import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SymbolCreateInput } from 'src/app/modules/assets/model/symbolCreateInput';
import { SymbolUpdateInput } from 'src/app/modules/assets/model/symbolUpdateInput';
import { environment } from 'src/environments/environment';
import { Symbol } from '../../modules/assets/model/symbol';

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

  public addSymbol(symbol: SymbolCreateInput) {
    return this.http.post<number>(`${this.apiServerUrl}`, symbol);
  }

  public updateSymbol(symbol: SymbolUpdateInput) {
    return this.http.put<number>(
      `${this.apiServerUrl}/${symbol.id_sym}`,
      symbol,
    );
  }

  public deleteSymbol(symbolId: number): Observable<Symbol> {
    return this.http.delete<Symbol>(`${this.apiServerUrl}/${symbolId}`);
  }
}
