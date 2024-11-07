import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { OperationComment } from 'src/app/data/models/opcomment';
import { OperationCommentService } from 'src/app/data/service/opcomment.service';
import { ProjectionService } from 'src/app/modules/projection/service/projection.service';
import {
  navigatePreservingQueryParams,
  sortDataByInsertedAt,
} from 'src/app/shared/utils/shared-utils';
import { Operation } from '../../../model/operation';
import { OperationService } from '../../../service/operation.service';
import { getRevenueColorClass } from '../../../utils/shared-utils';
import {
  getPotentialDirection,
  isAccumulation,
  isDistribution,
  isEquilibrium,
} from '../../rules/checklist/formulas';

@Component({
  selector: 'app-operation-details',
  templateUrl: './operation-details.component.html',
})
export class OperationDetailsComponent implements OnInit {
  private operationService = inject(OperationService);
  private projectionService = inject(ProjectionService);
  private commentService = inject(OperationCommentService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  @Input() extended: boolean = true;
  @Input() viewChartMode: boolean = false;

  showViewChartBtn =
    this.activatedRoute.snapshot.data['showViewChartBtn'] ?? true;

  operation$?: Observable<Operation>;
  projectionAssocId$?: Observable<number>;
  comments$?: Observable<OperationComment[]>;
  checklist$?: Observable<any>;
  accumulationOrDistribution$?: Observable<string>;
  isViewChart = this.router.url.includes('view-chart');

  isAccumulation = isAccumulation;
  isDistribution = isDistribution;
  isEquilibrium = isEquilibrium;
  getRevenueColorClass = getRevenueColorClass;

  ngOnInit() {
    this.operation$ = this.activatedRoute.params.pipe(
      switchMap((params) => {
        const id = params['id'];
        return this.operationService.getOperation(id);
      }),
    );

    this.checklist$ = this.operation$.pipe(
      map((operation) =>
        Object.entries(operation.checklist ?? {}).map(([key, value]) => ({
          key: key,
          value: value,
        })),
      ),
    );

    this.accumulationOrDistribution$ = this.operation$?.pipe(
      map(({ checklist }) =>
        checklist ? getPotentialDirection(checklist) : '',
      ),
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

    this.projectionAssocId$ = this.activatedRoute.params.pipe(
      switchMap((params) => {
        const id = params['id'];
        return this.projectionService
          .getProjectionFromOperation(id)
          .pipe(map((proj) => proj?.id));
      }),
    );
  }

  onDeleteOperation(operation: Operation): void {
    if (confirm('Are you sure you want to delete this operation?')) {
      this.operationService.deleteOperation(operation);
      this.goBackDelete();
    }
  }

  goToEdit(operationId: number) {
    navigatePreservingQueryParams(
      ['../' + operationId, 'edit'],
      this.router,
      this.activatedRoute,
    );
  }

  goToProjection(projectionId: number) {
    navigatePreservingQueryParams(
      ['../../projections', projectionId],
      this.router,
      this.activatedRoute,
    );
  }

  private goBackDelete() {
    navigatePreservingQueryParams(
      [this.isViewChart ? '/operations' : '../'],
      this.router,
      this.activatedRoute,
    );
  }

  goToChart(operationId: number) {
    this.router.navigate(['../view-chart', operationId], {
      relativeTo: this.activatedRoute,
      queryParams: {
        ...this.activatedRoute.snapshot.queryParams,
      },
      queryParamsHandling: 'merge',
    });
  }
}
