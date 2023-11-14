import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { RoutingService } from 'src/app/core/service/routing.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { ProjectionComment } from 'src/app/data/models/pcomment';
import { Status } from 'src/app/data/models/status';
import { Symbol } from 'src/app/data/models/symbol';
import { Timeframe } from 'src/app/data/models/timeframe';
import { ProjectionCommentService } from 'src/app/data/service/pcomment.service';
import { StatusService } from 'src/app/data/service/status.service';
import { SymbolService } from 'src/app/data/service/symbol.service';
import { MutationType } from 'src/app/shared/utils/custom-types';
import { formatDate } from 'src/app/shared/utils/shared-utils';
import { Projection } from '../../../model/projection';
import { ProjectionCreateInput } from '../../../model/projectionCreateInput';
import { ProjectionUpdateInput } from '../../../model/projectionUpdateInput';
import { ProjectionService } from '../../../service/projection.service';

@Component({
  selector: 'app-projection-mutation',
  templateUrl: './projection-mutation.component.html',
})
export class ProjectionMutationComponent {
  private formBuilder = inject(FormBuilder);
  private symbolService = inject(SymbolService);
  private statusService = inject(StatusService);
  private projectionService = inject(ProjectionService);
  private commentService = inject(ProjectionCommentService);
  private routingService = inject(RoutingService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private fileService = inject(FileService);

  isLoading: boolean = false;
  errors: Array<string> = [];

  idComment?: number = undefined;
  graphFileName: string | null = null;
  uploadedFile: File | null = null;

  symbols$: Observable<Symbol[]> = this.symbolService.getSymbols();
  statuses$: Observable<Status[]> = this.statusService.getStatuses();

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
  date = this.formBuilder.control<string | null>(null);
  timeframe = this.formBuilder.control<string | null>(
    null,
    Validators.required,
  );
  status = this.formBuilder.control<number | null>(null);
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
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      const projectionDetails = await firstValueFrom(
        this.projectionService.getProjection(id),
      );
      if (projectionDetails) {
        this.setInitialFormStateProj(projectionDetails);
      }
      const comment = await firstValueFrom(this.commentService.getComment(id));
      if (comment) {
        this.setInitialFormStateComment(comment);
      }
    }
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

  //if is add projection OR we are on edit and we don't have a comment, we create one
  get isCreateCommentFromEdit(): boolean {
    return this.isMutationAdd || !this.idComment;
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
    return this.isMutationAdd ? 'bg-green' : 'bg-orange';
  }

  get dateValue(): string {
    return "${this.projectionForm.get('date')!.value} | date: 'yyyy-MM-dd'";
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

  onAddComment(commentCreateInput: ProjectionComment) {
    return this.commentService.addComment(commentCreateInput);
  }
  onUpdateComment(commentUpdateInput: ProjectionComment) {
    return this.commentService.updateComment(commentUpdateInput);
  }

  private setInitialFormStateProj(projectionDetails: Projection) {
    this.id.setValue(projectionDetails.id);
    this.symbol.setValue(projectionDetails.symbol.id_sym);
    this.orderType.setValue(projectionDetails.updown ? 1 : 0);
    this.date.setValue(formatDate(projectionDetails.date!));
    this.graphFileName = projectionDetails.graph!;
    this.timeframe.setValue(projectionDetails.timeframe);
    this.status.setValue(projectionDetails.status.id_st);
  }

  private setInitialFormStateComment(comment: ProjectionComment) {
    this.idComment = comment.id_pc;
    this.comment.setValue(comment.pcomment);
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
        return result as number;
      }
    } catch (e: any) {
      this.errors = [...this.errors, e.message as string];
    } finally {
      this.isLoading = false;
    }
  }

  private async handleMutationComment(
    commentInput: ProjectionComment,
  ): Promise<number | void> {
    try {
      this.isLoading = true;
      const result = this.isCreateCommentFromEdit
        ? await firstValueFrom(this.onAddComment(commentInput))
        : await firstValueFrom(this.onUpdateComment(commentInput));
      if (result) {
        this.isLoading = false;
        return result as number;
      }
    } catch (e: any) {
      this.errors = [...this.errors, e.message as string];
    } finally {
      this.isLoading = false;
    }
  }

  private getProjectionCreateInput(): ProjectionCreateInput {
    const { symbol, orderType, date, timeframe } = this.projectionForm.value;
    return {
      id_sym: symbol!,
      updown: orderType!,
      date_proj: date!,
      graph: this.uploadedFile!.name,
      name_tf: timeframe!.toString(),
      id_st: 3,
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

  private getCommentCreateInput(idProj: number): ProjectionComment {
    const { comment } = this.projectionForm.value;
    return {
      pcomment: comment!,
      id_proj: idProj!,
    };
  }

  private getCommentUpdateInput(): ProjectionComment {
    const { id, comment } = this.projectionForm.value;
    return {
      id_pc: this.idComment!,
      pcomment: comment!,
      id_proj: id!,
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
      const commentInput: ProjectionComment = this.isCreateCommentFromEdit
        ? this.getCommentCreateInput(projId)
        : this.getCommentUpdateInput();
      this.handleMutationComment(commentInput);
    }

    if (this.errors.length === 0) {
      const operation = this.isMutationAdd ? 'created' : 'updated';
      this.toastService.success({
        message: `Projection ${operation} successfully`,
      });
      this.routingService.navigatePreservingQueryParams(
        [`${this.closeRoute}${projId}`],
        this.router,
        this.activatedRoute,
      );
    } else {
      this.errors.forEach((error) => {
        this.toastService.error({
          message: error,
        });
      });
    }
  }
}
