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
import { Projection } from '../model/projection';
import { ProjectionCreateInput } from '../model/projectionCreateInput';
import { ProjectionUpdateInput } from '../model/projectionUpdateInput';

@Injectable({
  providedIn: 'root',
})
export class ProjectionService {
  private fileService = inject(FileService);

  private apiServerUrl = `${environment.apiBaseUrl}/projections`;
  private fetchSignal = new BehaviorSubject(null);

  public projections$ = this.fetchSignal.asObservable().pipe(
    switchMap(() => this.getProjections()),
    shareReplay(1),
  );

  public static PROJECTION_STATUSES = ['WATCHING', 'EXPIRED'];

  deleteSubscription?: Subscription;

  constructor(private http: HttpClient, private toastService: ToastService) {}

  public refetch() {
    this.fetchSignal.next(null);
  }

  public getProjections(): Observable<Projection[]> {
    return this.http.get<Projection[]>(`${this.apiServerUrl}`);
  }

  public getProjection(projectionId: number): Observable<Projection> {
    return this.http.get<Projection>(`${this.apiServerUrl}/${projectionId}`);
  }

  public getProjectionFromOperation(
    operationId: number,
  ): Observable<Projection> {
    return this.http.get<Projection>(
      `${this.apiServerUrl}/operationAssoc/${operationId}`,
    );
  }

  public addProjection(projectionCreateInput: ProjectionCreateInput) {
    return this.http
      .post<number>(`${this.apiServerUrl}`, projectionCreateInput)
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

  public updateProjection(projection: ProjectionUpdateInput) {
    return this.http
      .put<number>(`${this.apiServerUrl}/${projection.id_proj}`, projection)
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

  public async deleteProjection(projection: Projection) {
    const { id, graph } = projection;
    if (graph) {
      if (await this.fileService.deleteImage(graph))
        this.deleteProjectionAction(id);
    } else this.deleteProjectionAction(id);
  }

  private deleteProjectionAction(projectionId: number) {
    this.deleteSubscription = this.http
      .delete(`${this.apiServerUrl}/${projectionId}`)
      .subscribe(
        () => {
          this.toastService.success({
            message: 'Projection deleted successfully',
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
