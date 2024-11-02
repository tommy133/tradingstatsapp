import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { ProjectionComment } from 'src/app/data/models/pcomment';
import { ProjectionCommentService } from 'src/app/data/service/pcomment.service';
import { OperationService } from 'src/app/modules/operation/service/operation.service';
import {
  getStatusColorClass,
  navigatePreservingQueryParams,
  sortDataByInsertedAt,
} from 'src/app/shared/utils/shared-utils';
import { Projection } from '../../../model/projection';
import { ProjectionService } from '../../../service/projection.service';
import { getUpdownLabel } from '../../../utils/shared-utils';

@Component({
  selector: 'app-projection-details',
  templateUrl: './projection-details.component.html',
})
export class ProjectionDetailsComponent implements OnInit {
  private fileService = inject(FileService);

  getStatusColorClass = getStatusColorClass;
  getUpdownLabel = getUpdownLabel;

  projection$?: Observable<Projection>;
  operationAssocId$?: Observable<number>;
  comments$?: Observable<ProjectionComment[]>;
  isLoading: boolean = false;
  errors: Array<string> = [];
  isViewChart = this.router.url.includes('view-chart');

  constructor(
    private projectionService: ProjectionService,
    private operationService: OperationService,
    private commentService: ProjectionCommentService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.projection$ = this.activatedRoute.params.pipe(
      switchMap((params) => {
        const id = params['id'];
        return this.projectionService.getProjection(id);
      }),
    );

    this.comments$ = this.activatedRoute.params.pipe(
      switchMap((params) => {
        const id = params['id'];
        return this.commentService.getCommentsById(id).pipe(
          map(
            (res) => sortDataByInsertedAt(res), //it comes already sorted from the backend but need it for cached data
          ),
        );
      }),
    );

    this.operationAssocId$ = this.activatedRoute.params.pipe(
      switchMap((params) => {
        const id = params['id'];
        return this.operationService
          .getOperationFromProjection(id)
          .pipe(map((op) => op?.id));
      }),
    );
  }

  public onDeleteProjection(projection: Projection): void {
    const { id, graph } = projection;
    if (confirm('Are you sure you want to delete this projection?')) {
      if (graph) {
        this.fileService.deleteImage(graph);
      }
      this.projectionService.deleteProjection(id);
      this.goBackDelete();
    }
  }

  goToEdit(projectionId: number) {
    navigatePreservingQueryParams(
      ['../', projectionId, 'edit'],
      this.router,
      this.activatedRoute,
    );
  }

  goToCreateOperation(projectionId: number) {
    navigatePreservingQueryParams(
      ['/operations/addFromProj', projectionId],
      this.router,
      this.activatedRoute,
    );
  }

  goToOperation(operationId: number) {
    navigatePreservingQueryParams(
      ['../../operations', operationId],
      this.router,
      this.activatedRoute,
    );
  }

  goToChart(projectionId: number) {
    this.router.navigate(['../view-chart', projectionId], {
      relativeTo: this.activatedRoute,
      queryParams: {
        ...this.activatedRoute.snapshot.queryParams,
      },
      queryParamsHandling: 'merge',
    });
  }

  private goBackDelete() {
    navigatePreservingQueryParams(
      [this.isViewChart ? '/projections' : '../'],
      this.router,
      this.activatedRoute,
    );
  }
}
