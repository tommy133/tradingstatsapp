import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, map, Observable } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { ToastService } from 'src/app/core/service/toast.service';
import {
  CreateProjectionCommentInput,
  ProjectionComment,
} from 'src/app/data/models/pcomment';
import { Status } from 'src/app/data/models/status';
import { Timeframe } from 'src/app/data/models/timeframe';
import { ProjectionCommentService } from 'src/app/data/service/pcomment.service';
import { StatusService } from 'src/app/data/service/status.service';
import { Symbol } from 'src/app/modules/assets/model/symbol';
import { MutationType } from 'src/app/shared/utils/custom-types';
import {
  formatDate,
  navigatePreservingQueryParams,
} from 'src/app/shared/utils/shared-utils';
import { Projection } from '../../../model/projection';
import { ProjectionCreateInput } from '../../../model/projectionCreateInput';
import { ProjectionUpdateInput } from '../../../model/projectionUpdateInput';
import { ProjectionService } from '../../../service/projection.service';

@Component({
  selector: 'app-projection-mutation',
  templateUrl: './projection-mutation.component.html',
})
export class ProjectionMutationComponent implements OnDestroy {
  private formBuilder = inject(FormBuilder);
  private statusService = inject(StatusService);
  private projectionService = inject(ProjectionService);
  private commentService = inject(ProjectionCommentService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private fileService = inject(FileService);

  isLoading: boolean = false;
  errors: Array<string> = [];

  readonly STATUS_WATCHING = 3;

  comments: ProjectionComment[] = [];

  graphFileName: string | null = null;
  uploadedFile: File | null = null;
  selectedSymbol: string = '';

  statuses$: Observable<Status[]> = this.statusService
    .getStatuses()
    .pipe(
      map((statuses) =>
        statuses.filter((status) =>
          ProjectionService.PROJECTION_STATUSES.includes(status.name_st),
        ),
      ),
    );

  timeframes = Object.values(Timeframe).filter(
    (value) => typeof value !== 'number',
  );

  //CONTROLS
  id = this.formBuilder.control<number | null>(null);
  symbol = this.formBuilder.control<number | null>(null, Validators.required);
  orderType = this.formBuilder.control<number | null>(
    null,
    Validators.required,
  );
  date = this.formBuilder.control<string | null>(null, Validators.required);
  timeframe = this.formBuilder.control<string | null>(
    null,
    Validators.required,
  );
  status = this.formBuilder.control<number>(this.STATUS_WATCHING);
  comment = this.formBuilder.control<string | null>(null);

  projectionForm = this.formBuilder.group({
    id: this.id,
    symbol: this.symbol,
    orderType: this.orderType,
    date: this.date,
    timeframe: this.timeframe,
    status: this.status,
    comment: this.comment,
  });

  activatedRouteSubs = this.activatedRoute.params.subscribe(async (params) => {
    const id = params['id'];
    if (id) {
      const projectionDetails = await firstValueFrom(
        this.projectionService.getProjection(id),
      );
      this.comments = await firstValueFrom(
        this.commentService.getCommentsById(id),
      );
      if (projectionDetails) {
        this.setInitialFormStateProj(projectionDetails);
      }
    }
  });

  ngOnDestroy() {
    this.activatedRouteSubs.unsubscribe();
  }

  get mutation(): MutationType {
    if (this.activatedRoute.snapshot.params['id']) {
      return MutationType.EDIT;
    }
    return MutationType.ADD;
  }

  get isMutationAdd(): boolean {
    return this.mutation === MutationType.ADD;
  }

  get closeRoute(): string {
    return this.isMutationAdd ? '../' : '../../';
  }

  get cancelRoute(): string {
    return '../../' + this.projectionForm.value.id;
  }

  get buttonType(): string {
    return this.isMutationAdd ? 'Add' : 'Save';
  }

  get formType(): string {
    return this.isMutationAdd ? 'ADD' : 'EDIT';
  }

  get buttonColor(): string {
    return this.isMutationAdd ? 'bg-green' : 'bg-light-orange';
  }

  get dateValue(): string {
    return "${this.projectionForm.get('date')!.value} | date: 'yyyy-MM-dd'";
  }

  goToList() {
    navigatePreservingQueryParams(
      [this.closeRoute],
      this.router,
      this.activatedRoute,
    );
  }

  goToDetails() {
    navigatePreservingQueryParams(
      [this.cancelRoute],
      this.router,
      this.activatedRoute,
    );
  }

  onAddProjection(projectionCreateInput: ProjectionCreateInput) {
    if (this.uploadedFile) {
      this.uploadFileStorage(this.uploadedFile);
    }
    return this.projectionService.addProjection(projectionCreateInput);
  }

  onUpdateProjection(projectionUpdateInput: ProjectionUpdateInput) {
    if (this.uploadedFile) {
      if (this.graphFileName) {
        this.fileService.deleteImage(this.graphFileName);
      }
      this.uploadFileStorage(this.uploadedFile);
    }
    return this.projectionService.updateProjection(projectionUpdateInput);
  }

  onAddComment(commentCreateInput: CreateProjectionCommentInput) {
    return this.commentService.addComment(commentCreateInput);
  }

  setSymbolForm(symbol: Symbol) {
    this.projectionForm.controls.symbol.setValue(symbol.id_sym);
  }

  private setInitialFormStateProj(projectionDetails: Projection) {
    this.id.setValue(projectionDetails.id);
    this.symbol.setValue(projectionDetails.symbol.id_sym);
    this.selectedSymbol = projectionDetails.symbol.name_sym;
    this.orderType.setValue(projectionDetails.updown);
    this.date.setValue(formatDate(projectionDetails.date!));
    this.graphFileName = projectionDetails.graph!;
    this.timeframe.setValue(projectionDetails.timeframe);
    this.status.setValue(projectionDetails.status.id_st);
  }

  uploadFileMemory($event: any) {
    this.uploadedFile = $event.target.files[0];
  }

  removeFileMemory() {
    this.uploadedFile = null;
  }

  private uploadFileStorage(file: File) {
    this.fileService.uploadImage(file);
  }

  private async handleMutationProjection(
    projectionInput: ProjectionCreateInput | ProjectionUpdateInput,
  ): Promise<number | void> {
    try {
      this.isLoading = true;
      const result = this.isMutationAdd
        ? await firstValueFrom(
            this.onAddProjection(projectionInput as ProjectionCreateInput),
          )
        : await firstValueFrom(
            this.onUpdateProjection(projectionInput as ProjectionUpdateInput),
          );
      if (result) {
        this.isLoading = false;
        return result;
      }
    } catch (e: any) {
      this.errors = [...this.errors, e.message as string];
    } finally {
      this.isLoading = false;
    }
  }

  private async handleMutationComment(
    commentInput: CreateProjectionCommentInput,
  ): Promise<number | void> {
    try {
      this.isLoading = true;
      const result = await firstValueFrom(this.onAddComment(commentInput));
      if (result) {
        this.isLoading = false;
        return result;
      }
    } catch (e: any) {
      this.errors = [...this.errors, e.message as string];
    } finally {
      this.isLoading = false;
    }
  }

  private getProjectionCreateInput(): ProjectionCreateInput {
    const { symbol, orderType, date, timeframe, status } =
      this.projectionForm.value;
    return {
      id_sym: symbol!,
      updown: orderType!,
      date_proj: date!,
      graph: this.uploadedFile?.name,
      name_tf: timeframe!.toString(),
      id_st: status!,
    };
  }

  private getProjectionUpdateInput(): ProjectionUpdateInput {
    const { id, symbol, orderType, date, timeframe, status } =
      this.projectionForm.value;
    return {
      id_proj: id!,
      id_sym: symbol!,
      updown: orderType!,
      date_proj: date!,
      graph: this.uploadedFile?.name,
      name_tf: timeframe!.toString(),
      id_st: status!,
    };
  }

  private getCommentCreateInput(idProj: number): CreateProjectionCommentInput {
    const { comment } = this.projectionForm.value;
    return {
      comment: comment!,
      id_proj: idProj!,
    };
  }

  async onSubmit() {
    if (this.projectionForm.invalid) {
      this.toastService.error({
        message: 'Invalid form!',
      });
      return;
    }

    const projectionInput: ProjectionCreateInput | ProjectionUpdateInput = this
      .isMutationAdd
      ? this.getProjectionCreateInput()
      : this.getProjectionUpdateInput();

    const projId = await this.handleMutationProjection(projectionInput);
    const comment = this.projectionForm.value.comment;

    if (projId && comment) {
      const commentInput: CreateProjectionCommentInput =
        this.getCommentCreateInput(projId);
      this.handleMutationComment(commentInput);
    }

    if (this.errors.length === 0) {
      const operation = this.isMutationAdd ? 'created' : 'updated';
      this.toastService.success({
        message: `Projection ${operation} successfully`,
      });
      this.goToList();
    } else {
      this.errors.forEach((error) => {
        this.toastService.error({
          message: error,
        });
      });
    }
  }
}
