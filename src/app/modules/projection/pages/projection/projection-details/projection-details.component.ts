import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { SidebarService } from 'src/app/core/service/sidebar.service';
import { ProjectionComment } from 'src/app/data/models/pcomment';
import { ProjectionCommentService } from 'src/app/data/service/pcomment.service';
import {
  getStatusColorClass,
  navigatePreservingQueryParams,
} from 'src/app/shared/utils/shared-utils';
import { Projection } from '../../../model/projection';
import { ProjectionService } from '../../../service/projection.service';

@Component({
  selector: 'app-projection-details',
  templateUrl: './projection-details.component.html',
})
export class ProjectionDetailsComponent implements OnInit {
  private projectionService = inject(ProjectionService);
  private commentService = inject(ProjectionCommentService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private sidebarService = inject(SidebarService);
  private fileService = inject(FileService);

  getStatusColorClass = getStatusColorClass;

  projection$?: Observable<Projection>;
  comments$?: Observable<ProjectionComment[]>;
  isLoading: boolean = false;
  errors: Array<string> = [];

  private postDeletePath = this.activatedRoute.snapshot.data['postDeletePath'];
  closeSidebarRedirect =
    this.activatedRoute.snapshot.data['closeSidebarRedirect'];
  showViewChartBtn =
    this.activatedRoute.snapshot.data['showViewChartBtn'] ?? true;

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
        return this.commentService.getCommentsById(id);
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
      ['../' + projectionId, 'edit'],
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

  getUpdownLabel(updown: number | null) {
    if (updown === null) return 'Not defined';
    return updown ? 'LONG' : 'SHORT';
  }

  onCloseSidebar() {
    navigatePreservingQueryParams(['..'], this.router, this.activatedRoute);
  }
}
