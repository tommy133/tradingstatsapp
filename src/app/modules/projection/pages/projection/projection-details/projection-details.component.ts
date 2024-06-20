import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
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
  private fileService = inject(FileService);

  getStatusColorClass = getStatusColorClass;

  projection$?: Observable<Projection>;
  comments$?: Observable<ProjectionComment[]>;
  isLoading: boolean = false;
  errors: Array<string> = [];

  constructor(
    private projectionService: ProjectionService,
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
      ['../edit/', projectionId],
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
    this.router.navigate(['../'], {
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'preserve',
    });
  }

  getUpdownLabel(updown: number | null) {
    if (updown === null) return 'Not defined';
    return updown ? 'LONG' : 'SHORT';
  }

  onCloseSidebar() {
    navigatePreservingQueryParams(['..'], this.router, this.activatedRoute);
  }
}
