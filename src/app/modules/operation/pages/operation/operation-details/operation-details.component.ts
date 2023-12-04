import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { RoutingService } from 'src/app/core/service/routing.service';
import { SidebarService } from 'src/app/core/service/sidebar.service';
import { OperationComment } from 'src/app/data/models/opcomment';
import { OperationCommentService } from 'src/app/data/service/opcomment.service';
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
  private routingService = inject(RoutingService);
  private sidebarService = inject(SidebarService);
  private fileService = inject(FileService);

  @Input() extended: boolean = true;

  editPath = this.activatedRoute.snapshot.data['editPath'];
  postDeletePath = this.activatedRoute.snapshot.data['postDeletePath'];
  operation$?: Observable<Operation>;
  comment$?: Observable<OperationComment>;
  isLoading: boolean = false;
  errors: Array<string> = [];

  ngOnInit() {
    this.operation$ = this.activatedRoute.params.pipe(
      switchMap((params) => {
        const id = params['id'];
        return this.operationService.getOperation(id);
      }),
    );

    this.comment$ = this.activatedRoute.params.pipe(
      switchMap((params) => {
        const id = params['id'];
        return this.commentService.getComment(id);
      }),
    );
  }

  public onDeleteOperation(operation: Operation): void {
    const { id, graph } = operation;

    if (confirm('Are you sure you want to delete this operation?')) {
      if (graph) {
        this.fileService.deleteImage(graph);
      }
      this.operationService.deleteOperation(id);
      this.goBack();
    }
  }

  goToEdit(operationId: number) {
    this.routingService.navigatePreservingQueryParams(
      [this.editPath, operationId],
      this.router,
      this.activatedRoute,
    );
  }

  goBack() {
    this.routingService.navigatePreservingQueryParams(
      [this.postDeletePath],
      this.router,
      this.activatedRoute,
    );
  }

  closeSidebarLeft() {
    this.sidebarService.closeSidebarLeft();
  }

  goToChart(operation: Operation) {
    this.router.navigate(['../view-chart', operation.id], {
      relativeTo: this.activatedRoute,
      queryParams: {
        ...this.activatedRoute.snapshot.queryParams,
        fileName: operation.graph,
      },
      queryParamsHandling: 'merge',
    });
  }

  getPointsColorClass(points: number): string {
    return points > 0 ? 'text-dark-green' : 'text-red';
  }
}
