import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  map,
  switchMap,
} from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { environment } from 'src/environments/environment';
import { Operation } from '../model/operation';
import { OperationCreateInput } from '../model/operationCreateInput';
import { OperationUpdateInput } from '../model/operationUpdateInput';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  private activatedRoute = inject(ActivatedRoute);
  private apiServerUrl = `${environment.apiBaseUrl}/operations`;
  private fetchSignal = new BehaviorSubject(null);
  private DEFAULT_REFETCH_INTERVAL = 5000;

  public operations$ = this.fetchSignal.asObservable().pipe(
    switchMap(() => this.getOperations()),
    map((operations) => {
      const accountId = this.activatedRoute.snapshot.queryParams['account'];

      const filteredOperations = operations.filter(
        (operation) => operation.account.id_ac.toString() === accountId,
      );
      return filteredOperations;
    }),
  );

  deleteSubscription?: Subscription;

  constructor(private http: HttpClient, private toastService: ToastService) {}

  public refetch() {
    this.fetchSignal.next(null);
  }

  public setRefetchInterval(interval?: number) {
    setInterval(() => {
      this.refetch();
    }, interval ?? this.DEFAULT_REFETCH_INTERVAL);
  }

  public getOperations(): Observable<Operation[]> {
    return this.http.get<Operation[]>(`${this.apiServerUrl}`);
  }

  public getOperation(operationId: number): Observable<Operation> {
    return this.http.get<Operation>(`${this.apiServerUrl}/${operationId}`);
  }

  public addOperation(operationCreateInput: OperationCreateInput) {
    return this.http.post(`${this.apiServerUrl}`, operationCreateInput).pipe(
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

  public updateOperation(operation: OperationUpdateInput) {
    return this.http
      .put(`${this.apiServerUrl}/${operation.id_op}`, operation)
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

  public deleteOperation(operationId: number) {
    this.deleteSubscription = this.http
      .delete(`${this.apiServerUrl}/${operationId}`)
      .subscribe(
        () => {
          this.toastService.success({
            message: 'Operation deleted successfully',
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
}
