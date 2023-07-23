import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { ProjectionComment } from 'src/app/data/models/pcomment';
import { Status } from 'src/app/data/models/status';
import { Symbol } from 'src/app/data/models/symbol';
import { Timeframe } from 'src/app/data/models/timeframe';
import { ProjectionCommentService } from 'src/app/data/service/pcomment.service';
import { StatusService } from 'src/app/data/service/status.service';
import { SymbolService } from 'src/app/data/service/symbol.service';
import { MutationType } from 'src/app/shared/utils/custom-types';
import { redirectById } from 'src/app/shared/utils/shared-utils';
import { Projection } from '../../../model/projection';
import { ProjectionCreateInput } from '../../../model/projectionCreateInput';
import { ProjectionUpdateInput } from '../../../model/projectionUpdateInput';
import { ProjectionService } from '../../../service/projection.service';

const fileUploadUri = 'http://localhost:8080/file/upload';

@Component({
  selector: 'app-projection-mutation',
  templateUrl: './projection-mutation.component.html',
})
export class ProjectionMutationComponent {
  isLoading: boolean = false;
  errors: Array<string> = [];
  uploader: FileUploader = new FileUploader({
    url: fileUploadUri,
    itemAlias: 'chart',
  });
  chartFileName: string = '';
  idComment?: number;
  subscription: Subscription | undefined;

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
  //chart
  timeframe = this.formBuilder.control<string | null>(
    null,
    Validators.required,
  );
  status = this.formBuilder.control<number | null>(null, Validators.required);
  comment = this.formBuilder.control<string | null>(null);

  projectionForm = this.formBuilder.group({
    id: this.id,
    symbol: this.symbol,
    orderType: this.orderType,
    timeframe: this.timeframe,
    status: this.status,
    comment: this.comment,
  });

  constructor(
    private formBuilder: FormBuilder,
    private projectionService: ProjectionService,
    private symbolService: SymbolService,
    private statusService: StatusService,
    private commentService: ProjectionCommentService,
    private toastService: ToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any,
    ) => {
      this.chartFileName = JSON.parse(response);
      console.log('Uploaded successfully...', status);
    };
  }

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

  get isFileUploaded(): boolean {
    return this.uploader.queue.length > 0;
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

  get buttonColor(): string {
    return this.isMutationAdd ? 'bg-green' : 'bg-orange';
  }

  onAddProjection(projectionCreateInput: ProjectionCreateInput) {
    return this.projectionService.addProjection(projectionCreateInput);
  }

  onUpdateProjection(projectionUpdateInput: ProjectionUpdateInput) {
    return this.projectionService.updateProjection(projectionUpdateInput);
  }

  onAddComment(commentCreateInput: ProjectionComment) {
    return this.commentService.addComment(commentCreateInput);
  }
  onUpdateComment(commentUpdateInput: ProjectionComment) {
    return this.commentService.updateComment(commentUpdateInput);
  }

  removeUploadedFile() {
    this.uploader.clearQueue();
  }

  private setInitialFormStateProj(projectionDetails: Projection) {
    this.symbol.setValue(projectionDetails.symbol.id);
    this.orderType.setValue(projectionDetails.updown ? 1 : 0);
    this.timeframe.setValue(projectionDetails.timeframe);
    this.status.setValue(projectionDetails.status.id);
  }

  private setInitialFormStateComment(comment: ProjectionComment) {
    this.idComment = comment.id_pc;
    this.comment.setValue(comment.pcomment);
  }

  private async handleUploadChart() {
    try {
      this.isLoading = true;
      if (this.isFileUploaded) {
        const fileItem = this.uploader.queue[this.uploader.queue.length - 1];

        const uploadPromise = new Promise<void>((resolve) => {
          this.subscription = this.uploader.response.subscribe((res) => {
            this.chartFileName = JSON.parse(res).filename;
            resolve();
          });
        });

        fileItem.upload();

        this.isLoading = false;
        return uploadPromise;
      }
    } catch (e: any) {
      this.errors.push(e.message as string);
    } finally {
      this.isLoading = false;
    }
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
      const result = this.isMutationAdd
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
    const { symbol, orderType, timeframe, status } = this.projectionForm.value;
    return {
      id_sym: symbol!,
      updown: orderType!,
      date_proj: new Date(),
      graph: this.chartFileName,
      name_tf: timeframe!.toString(),
      id_st: status!,
    };
  }

  private getProjectionUpdateInput(): ProjectionUpdateInput {
    const { id, symbol, orderType, timeframe, status } =
      this.projectionForm.value;
    return {
      id_proj: id!,
      id_sym: symbol!,
      updown: orderType!,
      date_proj: new Date(),
      graph: this.chartFileName,
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

    await this.handleUploadChart(); // wait to load this.chartFileName

    const projectionInput: ProjectionCreateInput | ProjectionUpdateInput = this
      .isMutationAdd
      ? this.getProjectionCreateInput()
      : this.getProjectionUpdateInput();

    const projId = await this.handleMutationProjection(projectionInput);

    if (projId && this.projectionForm.value.comment) {
      const commentInput: ProjectionComment = this.isMutationAdd
        ? this.getCommentCreateInput(projId)
        : this.getCommentUpdateInput();
      this.handleMutationComment(commentInput);
    }

    if (this.errors.length === 0) {
      this.toastService.success({
        message: `Projection has been successfully created`,
      });
      redirectById(this.router, this.activatedRoute, projId!, '../');
    } else {
      this.errors.forEach((error) => {
        this.toastService.error({
          message: error,
        });
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
