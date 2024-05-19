import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  Subscription,
  switchMap,
} from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { SymbolCreateInput } from 'src/app/modules/assets/model/symbolCreateInput';
import { SymbolUpdateInput } from 'src/app/modules/assets/model/symbolUpdateInput';
import { environment } from 'src/environments/environment';
import { Symbol } from '../../modules/assets/model/symbol';

@Injectable({
  providedIn: 'root',
})
export class SymbolService {
  private toastService = inject(ToastService);

  private apiServerUrl = `${environment.apiBaseUrl}/symbols`;

  private fetchSignal = new BehaviorSubject(null);
  public refetch() {
    this.fetchSignal.next(null);
  }

  deleteSubscription?: Subscription;

  assets$ = this.fetchSignal
    .asObservable()
    .pipe(switchMap(() => this.getSymbols()));

  constructor(private http: HttpClient) {}

  public getSymbols(): Observable<Symbol[]> {
    return this.http.get<Symbol[]>(`${this.apiServerUrl}`);
  }

  public getSymbol(symbolId: number): Observable<Symbol> {
    return this.http.get<Symbol>(`${this.apiServerUrl}/${symbolId}`);
  }

  public addSymbol(symbol: SymbolCreateInput) {
    return this.http.post<number>(`${this.apiServerUrl}`, symbol).pipe(
      map(
        (res) => {
          this.refetch();
          return res;
        },
        (error: HttpErrorResponse) => {
          this.toastService.error({
            message: error.message,
          });
        },
      ),
    );
  }

  public updateSymbol(symbol: SymbolUpdateInput) {
    return this.http
      .put<number>(`${this.apiServerUrl}/${symbol.id_sym}`, symbol)
      .pipe(
        map(
          (res) => {
            this.refetch();
            return res;
          },
          (error: HttpErrorResponse) => {
            this.toastService.error({
              message: error.message,
            });
          },
        ),
      );
  }

  public deleteSymbol(symbolId: number) {
    this.deleteSubscription = this.http
      .delete(`${this.apiServerUrl}/${symbolId}`)
      .subscribe(
        () => {
          this.toastService.success({
            message: 'Symbol deleted successfully',
          });
          this.refetch();
        },
        (error: HttpErrorResponse) => {
          this.toastService.error({
            message: error.message,
          });
        },
      );
  }

  ngOnDestroy() {
    this.deleteSubscription?.unsubscribe();
  }
}
