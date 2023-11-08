import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { ProjectionComment } from 'src/app/data/models/pcomment';
import { ProjectionCommentService } from 'src/app/data/service/pcomment.service';
import { Projection } from '../../../model/projection';
import { ProjectionService } from '../../../service/projection.service';

@Component({
  selector: 'app-projection-details',
  templateUrl: './projection-details.component.html',
})
export class ProjectionDetailsComponent implements OnInit {
  private fileService = inject(FileService);

  projection$?: Observable<Projection>;
  comment$?: Observable<ProjectionComment>;
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

    this.comment$ = this.activatedRoute.params.pipe(
      switchMap((params) => {
        const id = params['id'];
        return this.commentService.getComment(id);
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
      this.goBack();
    }
  }

  private goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}
