import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { OperationComment } from 'src/app/data/models/opcomment';
import { Status } from 'src/app/data/models/status';
import { Symbol } from 'src/app/data/models/symbol';
import { Timeframe } from 'src/app/data/models/timeframe';
import { OperationCommentService } from 'src/app/data/service/opcomment.service';
import { StatusService } from 'src/app/data/service/status.service';
import { SymbolService } from 'src/app/data/service/symbol.service';
import { FileService } from 'src/app/file.service';
import { MutationType } from 'src/app/shared/utils/custom-types';
import { formatDate, redirectById } from 'src/app/shared/utils/shared-utils';
import { Operation } from '../../../model/operation';
import { OperationCreateInput } from '../../../model/operationCreateInput';
import { OperationUpdateInput } from '../../../model/operationUpdateInput';
import { OperationService } from '../../../service/operation.service';

@Component({
  selector: 'app-operation-mutation',
  templateUrl: './operation-mutation.component.html',
  styles: [],
})
export class OperationMutationComponent implements OnInit {
  isLoading: boolean = false;
  errors: Array<string> = [];
  uploader: FileUploader = new FileUploader({
    url: inject(FileService).fileUploadUri,
    itemAlias: 'chart',
  });
  chartFileName: string = '';
  account?: number = 1; //TODO get from router
  idComment?: number = undefined;
  uploaderSubscription: Subscription | undefined;

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
  dateOpen = this.formBuilder.control<string | null>(null);
  dateClose = this.formBuilder.control<string | null>(null);
  timeframe = this.formBuilder.control<string | null>(
    null,
    Validators.required,
  );
  status = this.formBuilder.control<number | null>(null, Validators.required);
  volume = this.formBuilder.control<number | null>(null);
  ratio = this.formBuilder.control<number | null>(null);
  points = this.formBuilder.control<number | null>(null);
  comment = this.formBuilder.control<string | null>(null);

  operationForm = this.formBuilder.group({
    id: this.id,
    symbol: this.symbol,
    orderType: this.orderType,
    dateOpen: this.dateOpen,
    dateClose: this.dateClose,
    timeframe: this.timeframe,
    status: this.status,
    volume: this.volume,
    ratio: this.ratio,
    points: this.points,
    comment: this.comment,
  });

  constructor(
    private formBuilder: FormBuilder,
    private operationService: OperationService,
    private symbolService: SymbolService,
    private statusService: StatusService,
    private commentService: OperationCommentService,
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
    //this.account = this.activatedRoute.snapshot.params['account'];
    if (id) {
      const operationDetails = await firstValueFrom(
        this.operationService.getOperation(id),
      );
      if (operationDetails) {
        this.setInitialFormState(operationDetails);
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

  //if is add operation OR we are on edit and we don't have a comment, we create one
  get isCreateCommentFromEdit(): boolean {
    return this.isMutationAdd || !this.idComment;
  }

  get closeRoute(): string {
    return this.isMutationAdd ? '../' : '../../';
  }

  get cancelRoute(): string {
    return '../../' + this.operationForm.value.id;
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
    return "${this.operationForm.get('date')!.value} | date: 'yyyy-MM-dd'";
  }

  get formControl() {
    return this.operationForm.controls.symbol;
  }

  onAddOperation(operationCreateInput: OperationCreateInput) {
    return this.operationService.addOperation(operationCreateInput);
  }

  onUpdateOperation(operationUpdateInput: OperationUpdateInput) {
    return this.operationService.updateOperation(operationUpdateInput);
  }

  onAddComment(commentCreateInput: OperationComment) {
    return this.commentService.addComment(commentCreateInput);
  }
  onUpdateComment(commentUpdateInput: OperationComment) {
    return this.commentService.updateComment(commentUpdateInput);
  }

  removeUploadedFile() {
    this.uploader.clearQueue();
  }

  private setInitialFormState(operationDetails: Operation) {
    const {
      id,
      symbol: { id_sym },
      updown,
      dateOpen,
      dateClose,
      graph,
      timeframe,
      status: { id_st },
      account: { id_ac },
      volume,
      ratio,
      points,
    } = operationDetails;

    this.id.setValue(id);
    this.symbol.setValue(id_sym);
    this.orderType.setValue(updown ? 1 : 0);
    this.dateOpen.setValue(formatDate(dateOpen!));
    this.dateClose.setValue(formatDate(dateClose!));
    this.chartFileName = graph!;
    this.timeframe.setValue(timeframe);
    this.status.setValue(id_st);
    this.account = id_ac;
    this.volume.setValue(volume!);
    this.ratio.setValue(ratio!);
    this.points.setValue(points!);
  }

  private setInitialFormStateComment(comment: OperationComment) {
    this.idComment = comment.id_opc;
    this.comment.setValue(comment.opcomment);
  }

  private async handleUploadChart() {
    try {
      this.isLoading = true;
      if (this.isFileUploaded) {
        const fileItem = this.uploader.queue[this.uploader.queue.length - 1];

        const uploadPromise = new Promise<void>((resolve) => {
          this.uploaderSubscription = this.uploader.response.subscribe(
            (res) => {
              this.chartFileName = JSON.parse(res).filename;
              resolve();
            },
          );
        });

        fileItem.upload();

        this.isLoading = false;
        return uploadPromise;
      }
    } catch (e: any) {
      this.errors = [...this.errors, e.message as string];
    } finally {
      this.isLoading = false;
    }
  }

  private async handleMutationOperation(
    operationInput: OperationCreateInput | OperationUpdateInput,
  ): Promise<number | void> {
    try {
      this.isLoading = true;
      const result = this.isMutationAdd
        ? await firstValueFrom(
            this.onAddOperation(operationInput as OperationCreateInput),
          )
        : await firstValueFrom(
            this.onUpdateOperation(operationInput as OperationUpdateInput),
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
    commentInput: OperationComment,
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

  private getOperationCreateInput(): OperationCreateInput {
    const {
      symbol,
      orderType,
      dateOpen,
      dateClose,
      timeframe,
      status,
      volume,
      ratio,
      points,
    } = this.operationForm.value;
    return {
      id_sym: symbol!,
      updown: orderType!,
      time_op: dateOpen!,
      time_close: dateClose!,
      graph: this.chartFileName,
      name_tf: timeframe!.toString(),
      id_st: status!,
      id_ac: this.account!,
      rr_ratio: ratio!,
      volume: volume!,
      points: points!,
    };
  }

  private getOperationUpdateInput(): OperationUpdateInput {
    const {
      id,
      symbol,
      orderType,
      dateOpen,
      dateClose,
      timeframe,
      status,
      volume,
      ratio,
      points,
    } = this.operationForm.value;
    return {
      id_op: id!,
      id_sym: symbol!,
      updown: orderType!,
      time_op: dateOpen!,
      time_close: dateClose!,
      graph: this.chartFileName,
      name_tf: timeframe!.toString(),
      id_st: status!,
      id_ac: this.account!,
      rr_ratio: ratio!,
      volume: volume!,
      points: points!,
    };
  }

  private getCommentCreateInput(idOperation: number): OperationComment {
    const { comment } = this.operationForm.value;
    return {
      opcomment: comment!,
      id_op: idOperation!,
    };
  }

  private getCommentUpdateInput(): OperationComment {
    const { id, comment } = this.operationForm.value;
    return {
      id_opc: this.idComment!,
      opcomment: comment!,
      id_op: id!,
    };
  }

  async onSubmit() {
    if (this.operationForm.invalid) {
      this.toastService.error({
        message: 'Invalid form!',
      });
      return;
    }

    await this.handleUploadChart(); // wait to load this.chartFileName

    const operationInput: OperationCreateInput | OperationUpdateInput = this
      .isMutationAdd
      ? this.getOperationCreateInput()
      : this.getOperationUpdateInput();

    const operationId = await this.handleMutationOperation(operationInput);
    const comment = this.operationForm.value.comment;

    if (operationId && comment) {
      const commentInput: OperationComment = this.isCreateCommentFromEdit
        ? this.getCommentCreateInput(operationId)
        : this.getCommentUpdateInput();
      this.handleMutationComment(commentInput);
    }

    if (this.errors.length === 0) {
      const operation = this.isMutationAdd ? 'created' : 'updated';
      this.toastService.success({
        message: `Operation ${operation} successfully`,
      });
      redirectById(
        this.router,
        this.activatedRoute,
        operationId!,
        this.isMutationAdd ? '../' : '../../',
      );
    } else {
      this.errors.forEach((error) => {
        this.toastService.error({
          message: error,
        });
      });
    }
  }

  ngOnDestroy() {
    if (this.uploaderSubscription) {
      this.uploaderSubscription.unsubscribe();
    }
  }
}
