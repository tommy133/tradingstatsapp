import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, map, Observable, switchMap } from 'rxjs';
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
  sortDataByInsertedAt,
  textToHyperlink,
} from 'src/app/shared/utils/shared-utils';
import { Projection } from '../../../model/projection';
import { ProjectionCreateInput } from '../../../model/projectionCreateInput';
import { ProjectionUpdateInput } from '../../../model/projectionUpdateInput';
import { ProjectionService } from '../../../service/projection.service';

@Component({
  selector: 'app-projection-mutation',
  templateUrl: './projection-mutation.component.html',
})
export class ProjectionMutationComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private statusService = inject(StatusService);
  private projectionService = inject(ProjectionService);
  private commentService = inject(ProjectionCommentService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private fileService = inject(FileService);
  private datePipe = inject(DatePipe);

  textToHyperLink = textToHyperlink;

  //Take route from operation/:id or operation/view-chart/:id
  projectionParamId =
    this.activatedRoute.snapshot.params['id'] ??
    this.activatedRoute.snapshot.parent?.params['id'];

  isLoading: boolean = false;
  errors: Array<string> = [];

  readonly STATUS_WATCHING = 3;

  comments$?: Observable<ProjectionComment[]>;

  graphFileName: string | null = null;
  uploadedFile: File | null = null;
  selectedSymbol: string = '';

  statuses$: Observable<Status[]> = this.statusService.statuses$.pipe(
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
  orderType = this.formBuilder.control<number | null>(null);
  date = this.formBuilder.control<string | null>(
    this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    Validators.required,
  );
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

  async ngOnInit() {
    if (this.projectionParamId) {
      const projectionDetails = await firstValueFrom(
        this.projectionService.getProjection(this.projectionParamId),
      );
      this.comments$ = this.activatedRoute.params.pipe(
        switchMap((params) => {
          const id = params['id'];
          return this.commentService.projectionComments$.pipe(
            map((res) =>
              res.filter((comment) => comment.id_proj === Number(id)),
            ),
            map((filteredComments) => sortDataByInsertedAt(filteredComments)),
          );
        }),
      );
      if (projectionDetails) {
        this.setInitialFormStateProj(projectionDetails);
      }
    }
  }

  get mutation(): MutationType {
    if (this.projectionParamId) {
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
    return '../';
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

  get uploadButtonText(): string {
    return this.graphFileName != null && this.graphFileName != undefined
      ? 'Replace chart'
      : 'Upload chart';
  }

  goBack() {
    navigatePreservingQueryParams(['..'], this.router, this.activatedRoute);
  }

  goToDetails() {
    navigatePreservingQueryParams(
      [this.cancelRoute],
      this.router,
      this.activatedRoute,
    );
  }

  onAddProjection(projectionCreateInput: ProjectionCreateInput) {
    return this.projectionService.addProjection(projectionCreateInput);
  }

  onUpdateProjection(projectionUpdateInput: ProjectionUpdateInput) {
    return this.projectionService.updateProjection(projectionUpdateInput);
  }

  onAddComment(commentCreateInput: CreateProjectionCommentInput) {
    return this.commentService.addComment(commentCreateInput);
  }

  setSymbolForm(symbol: Symbol) {
    this.projectionForm.controls.symbol.setValue(symbol.id_sym);
    this.projectionForm.controls.symbol.markAsDirty();
  }

  private setInitialFormStateProj(projectionDetails: Projection) {
    this.id.setValue(projectionDetails.id);
    this.symbol.setValue(projectionDetails.symbol.id_sym);
    this.selectedSymbol = projectionDetails.symbol.name_sym;
    this.orderType.setValue(projectionDetails.updown!);
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
    this.fileService.uploadFile(file, FileService.IMG_DIR);
  }

  private async handleMutationProjection(
    projectionInput: ProjectionCreateInput | ProjectionUpdateInput,
  ): Promise<number | void> {
    try {
      this.isLoading = true;
      //check some projection field changed to submit projection / only comment
      if (
        !this.isMutationAdd &&
        !this.graphFileName &&
        !this.uploadedFile &&
        this.areAllControlsPristineExceptComment(this.projectionForm)
      )
        return (projectionInput as ProjectionUpdateInput).id_proj;

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

  private areAllControlsPristineExceptComment(formGroup: FormGroup): boolean {
    debugger;
    return Object.keys(formGroup.controls)
      .filter((controlName) => controlName !== 'comment')
      .every((controlName) => formGroup.controls[controlName].pristine);
  }

  async onSubmit() {
    if (this.projectionForm.invalid) {
      this.projectionForm.markAllAsTouched();

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

    if (projId && this.errors.length === 0) {
      if (this.uploadedFile) {
        if (!this.isMutationAdd && this.graphFileName) {
          await this.fileService.deleteFile(
            this.graphFileName,
            FileService.IMG_DIR,
          );
        }
        this.uploadFileStorage(this.uploadedFile);
      }
      const operation = this.isMutationAdd ? 'created' : 'updated';
      this.toastService.success({
        message: `Projection ${operation} successfully`,
      });
      this.goBack();
    } else {
      this.errors.forEach((error) => {
        this.toastService.error({
          message: error,
        });
      });
    }
  }
}
