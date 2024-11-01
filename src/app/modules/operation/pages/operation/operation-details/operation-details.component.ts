import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { SidebarService } from 'src/app/core/service/sidebar.service';
import { OperationComment } from 'src/app/data/models/opcomment';
import { OperationCommentService } from 'src/app/data/service/opcomment.service';
import { ProjectionService } from 'src/app/modules/projection/service/projection.service';
import {
  navigatePreservingQueryParams,
  sortDataByInsertedAt,
} from 'src/app/shared/utils/shared-utils';
import { Operation } from '../../../model/operation';
import { OperationService } from '../../../service/operation.service';
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
  private sidebarService = inject(SidebarService);
  private fileService = inject(FileService);

  @Input() extended: boolean = true;
  @Input() viewChartMode: boolean = false;

  private postDeletePath = this.activatedRoute.snapshot.data['postDeletePath'];
  closeSidebarRedirect =
    this.activatedRoute.snapshot.data['closeSidebarRedirect'];
  showViewChartBtn =
    this.activatedRoute.snapshot.data['showViewChartBtn'] ?? true;

  operation$?: Observable<Operation>;
  projectionAssocId$?: Observable<number>;
  comments$?: Observable<OperationComment[]>;
  checklist$?: Observable<any>;
  accumulationOrDistribution$?: Observable<string>;

  isAccumulation = isAccumulation;
  isDistribution = isDistribution;
  isEquilibrium = isEquilibrium;

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
    const { id, graph } = operation;

    if (confirm('Are you sure you want to delete this operation?')) {
      if (graph) {
        this.fileService.deleteImage(graph);
      }
      this.operationService.deleteOperation(id);
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

  goBackDelete() {
    navigatePreservingQueryParams(
      [this.postDeletePath],
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

  getRevenueColorClass(revenue: number): string {
    return revenue > 0 ? 'text-dark-green' : 'text-red';
  }
}
