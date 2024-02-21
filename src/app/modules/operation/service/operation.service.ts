import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  Subscription,
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

  public operations$ = this.fetchSignal.asObservable().pipe(
    switchMap(() => this.getOperations()),
    map((operations) => {
      const accountId = this.activatedRoute.snapshot.queryParams['account'];
      if (accountId) {
        const filteredByAccount = operations.filter(
          (operation) => operation.account.id_ac.toString() === accountId,
        );
        return filteredByAccount;
      } else return operations;
    }),
  );

  public static OPERATION_STATUSES = ['OPEN', 'CLOSED'];

  deleteSubscription?: Subscription;

  constructor(private http: HttpClient, private toastService: ToastService) {}

  public refetch() {
    this.fetchSignal.next(null);
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

  private quarters$ = this.activatedRoute.queryParams.pipe(
    map((quarters) => ({
      q1: quarters['q1'] === 'true',
      q2: quarters['q2'] === 'true',
      q3: quarters['q3'] === 'true',
      q4: quarters['q4'] === 'true',
    })),
  );

  private year$ = this.activatedRoute.queryParams.pipe(
    map((queryParams) => parseInt(queryParams['year'])),
  );

  public filterOperationsByPeriod(operations$: Observable<Operation[]>) {
    return combineLatest([operations$, this.quarters$, this.year$]).pipe(
      map(([operations, quarters, year]) => {
        return operations.filter((operation) => {
          if (operation.dateOpen) {
            const operationDate = new Date(operation.dateOpen);
            const quarter = Math.floor(operationDate.getMonth() / 3) + 1;

            if (!quarters.q1 && !quarters.q2 && !quarters.q3 && !quarters.q4)
              return operationDate.getFullYear() === year;

            return (
              (quarters as { [key: string]: boolean })[`q${quarter}`] &&
              operationDate.getFullYear() === year
            );
          }
          return false;
        });
      }),
    );
  }
}
