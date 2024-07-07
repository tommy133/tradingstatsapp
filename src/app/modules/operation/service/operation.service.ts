import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
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
  private apiServerUrl = `${environment.apiBaseUrl}/operations`;
  private fetchSignal = new BehaviorSubject(null);

  public operations$ = this.fetchSignal
    .asObservable()
    .pipe(switchMap(() => this.getOperations()));

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

  public addOperationFromProjection(
    operationCreateInput: OperationCreateInput,
    projectionId: number,
  ) {
    return this.http
      .post<number>(
        `${this.apiServerUrl}/addFromProj/${projectionId}`,
        operationCreateInput,
      )
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

  public addOperation(operationCreateInput: OperationCreateInput) {
    return this.http
      .post<number>(`${this.apiServerUrl}`, operationCreateInput)
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

  public updateOperation(operation: OperationUpdateInput) {
    return this.http
      .put<number>(`${this.apiServerUrl}/${operation.id_op}`, operation)
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

  ngOnDestroy() {
    this.deleteSubscription?.unsubscribe();
  }
}
