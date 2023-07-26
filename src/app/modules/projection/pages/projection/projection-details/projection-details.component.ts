import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, switchMap } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { ProjectionComment } from 'src/app/data/models/pcomment';
import { ProjectionCommentService } from 'src/app/data/service/pcomment.service';
import { Projection } from '../../../model/projection';
import { ProjectionService } from '../../../service/projection.service';

@Component({
  selector: 'app-projection-details',
  templateUrl: './projection-details.component.html',
})
export class ProjectionDetailsComponent implements OnInit {
  projection$?: Observable<Projection>;
  deleteSubscription?: Subscription;
  comment$?: Observable<ProjectionComment>;
  isLoading: boolean = false;
  errors: Array<string> = [];

  constructor(
    private projectionService: ProjectionService,
    private commentService: ProjectionCommentService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
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

  public onDeleteProjection(projectionId: number): void {
    this.deleteSubscription = this.projectionService
      .deleteProjection(projectionId)
      .subscribe(
        () => {
          this.toastService.success({
            message: 'Projection deleted successfully',
          });
          this.goBack();
        },
        (error: HttpErrorResponse) => {
          this.toastService.error({
            message: error.message,
          });
        },
      );
  }

  private goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  ngOnDestroy() {
    this.deleteSubscription?.unsubscribe();
  }
}
