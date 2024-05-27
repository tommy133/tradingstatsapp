import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { SidebarService } from 'src/app/core/service/sidebar.service';
import { OperationComment } from 'src/app/data/models/opcomment';
import { OperationCommentService } from 'src/app/data/service/opcomment.service';
import {
  getStatusColorClass,
  navigatePreservingQueryParams,
} from 'src/app/shared/utils/shared-utils';
import { Operation } from '../../../model/operation';
import { OperationService } from '../../../service/operation.service';

@Component({
  selector: 'app-operation-details',
  templateUrl: './operation-details.component.html',
})
export class OperationDetailsComponent implements OnInit {
  private operationService = inject(OperationService);
  private commentService = inject(OperationCommentService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private sidebarService = inject(SidebarService);
  private fileService = inject(FileService);

  getStatusColorClass = getStatusColorClass;

  @Input() extended: boolean = true;
  @Input() viewChartMode: boolean = false;

  private postDeletePath = this.activatedRoute.snapshot.data['postDeletePath'];
  closeSidebarRedirect =
    this.activatedRoute.snapshot.data['closeSidebarRedirect'];
  showViewChartBtn =
    this.activatedRoute.snapshot.data['showViewChartBtn'] ?? true;

  operation$?: Observable<Operation>;
  comments$?: Observable<OperationComment[]>;

  ngOnInit() {
    this.operation$ = this.activatedRoute.params.pipe(
      switchMap((params) => {
        const id = params['id'];
        return this.operationService.getOperation(id);
      }),
    );

    this.comments$ = this.activatedRoute.params.pipe(
      switchMap((params) => {
        const id = params['id'];
        return this.commentService.getCommentsById(id);
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

  goBackDelete() {
    navigatePreservingQueryParams(
      [this.postDeletePath],
      this.router,
      this.activatedRoute,
    );
  }

  closeSidebarLeft() {
    this.sidebarService.closeSidebarLeft();
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
