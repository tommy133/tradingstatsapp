import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { OperationComment } from 'src/app/data/models/opcomment';
import { OperationCommentService } from 'src/app/data/service/opcomment.service';
import { Operation } from '../../../model/operation';
import { OperationService } from '../../../service/operation.service';

@Component({
  selector: 'app-operation-details',
  templateUrl: './operation-details.component.html',
})
export class OperationDetailsComponent implements OnInit {
  operation$?: Observable<Operation>;
  comment$?: Observable<OperationComment>;
  isLoading: boolean = false;
  errors: Array<string> = [];

  constructor(
    private operationService: OperationService,
    private commentService: OperationCommentService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

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

  public onDeleteOperation(operationId: number): void {
    this.operationService.deleteOperation(operationId);
    this.goBack();
  }

  goBack() {
    this.router.navigate(['../'], {
      relativeTo: this.activatedRoute,
      queryParams: this.activatedRoute.snapshot.queryParams,
      queryParamsHandling: 'preserve',
    });
  }

  getPointsColorClass(points: number): string {
    return points > 0 ? 'text-dark-green' : 'text-red';
  }
}
