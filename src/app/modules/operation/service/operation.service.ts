import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  shareReplay,
  Subscription,
  switchMap,
} from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { environment } from 'src/environments/environment';
import { Operation } from '../model/operation';
import { OperationCreateInput } from '../model/operationCreateInput';
import { OperationUpdateInput } from '../model/operationUpdateInput';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  private httpClient = inject(HttpClient);
  private toastService = inject(ToastService);
  private fileService = inject(FileService);

  private apiServerUrl = `${environment.apiBaseUrl}/operations`;
  private fetchSignal = new BehaviorSubject(null);

  public operations$ = this.fetchSignal.asObservable().pipe(
    switchMap(() => this.getOperations()),
    shareReplay(1),
  );

  public tempAssociatedProjectionId: number | null = null;
  public static OPERATION_STATUSES = ['OPEN', 'CLOSED'];

  deleteSubscription?: Subscription;

  public refetch() {
    this.fetchSignal.next(null);
  }

  public getOperations(): Observable<Operation[]> {
    return this.httpClient.get<Operation[]>(`${this.apiServerUrl}`);
  }

  public getOperation(operationId: number): Observable<Operation> {
    return this.httpClient.get<Operation>(
      `${this.apiServerUrl}/${operationId}`,
    );
  }

  public getOperationFromProjection(
    projectionId: number,
  ): Observable<Operation> {
    return this.httpClient.get<Operation>(
      `${this.apiServerUrl}/projectionAssoc/${projectionId}`,
    );
  }

  public addOperationFromProjection(
    operationCreateInput: OperationCreateInput,
    projectionId: number,
  ) {
    return this.httpClient
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
    return this.httpClient
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
    return this.httpClient
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

  public async deleteOperation(operation: Operation) {
    const { id, graph } = operation;
    if (graph) {
      if (await this.fileService.deleteImage(graph))
        this.deleteOperationAction(id);
    } else this.deleteOperationAction(id);
  }

  private deleteOperationAction(operationId: number) {
    this.deleteSubscription = this.httpClient
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
