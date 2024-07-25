import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, map, Observable } from 'rxjs';
import { FileService } from 'src/app/core/service/file.service';
import { ToastService } from 'src/app/core/service/toast.service';
import {
  CreateOperationCommentInput,
  OperationComment,
} from 'src/app/data/models/opcomment';
import { Status } from 'src/app/data/models/status';
import { Timeframe } from 'src/app/data/models/timeframe';
import { OperationCommentService } from 'src/app/data/service/opcomment.service';
import { StatusService } from 'src/app/data/service/status.service';
import { SymbolService } from 'src/app/data/service/symbol.service';
import { Symbol } from 'src/app/modules/assets/model/symbol';
import { Projection } from 'src/app/modules/projection/model/projection';
import { ProjectionService } from 'src/app/modules/projection/service/projection.service';
import { AccountType, MutationType } from 'src/app/shared/utils/custom-types';
import {
  navigatePreservingQueryParams,
  textToHyperlink,
} from 'src/app/shared/utils/shared-utils';
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
  private formBuilder = inject(FormBuilder);
  private symbolService = inject(SymbolService);
  private statusService = inject(StatusService);
  private operationService = inject(OperationService);
  private projectionService = inject(ProjectionService);
  private commentService = inject(OperationCommentService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private fileService = inject(FileService);
  private datePipe = inject(DatePipe);

  textToHyperLink = textToHyperlink;

  //Take route from operation/:id or operation/view-chart/:id
  operationParamId =
    this.activatedRoute.snapshot.params['id'] ??
    this.activatedRoute.snapshot.parent?.params['id'];
  projectionParamId = this.activatedRoute.snapshot.params['projId'];

  isLoading: boolean = false;
  errors: Array<string> = [];

  readonly DEFAULT_SYMBOL = 20; //FDXS
  readonly DEFAULT_STATUS: number = 2; //CLOSED

  readonly accountTypes: AccountType[] = ['Demo', 'Live', 'Backtest'];

  comments: OperationComment[] = [];

  graphFileName: string | null = null;
  uploadedFile: File | null = null;
  selectedSymbol: string = '';

  symbols$: Observable<Symbol[]> = this.symbolService.assets$;
  statuses$: Observable<Status[]> = this.statusService
    .getStatuses()
    .pipe(
      map((statuses) =>
        statuses.filter((status) =>
          OperationService.OPERATION_STATUSES.includes(status.name_st),
        ),
      ),
    );

  timeframes = Object.values(Timeframe).filter(
    (value) => typeof value !== 'number',
  );

  //CONTROLS
  id = this.formBuilder.control<number | null>(null);
  symbol = this.formBuilder.control<number | null>(
    this.DEFAULT_SYMBOL,
    Validators.required,
  );
  orderType = this.formBuilder.control<number | null>(
    null,
    Validators.required,
  );
  dateOpen = this.formBuilder.control<string | null>(
    this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm'),
    Validators.required,
  );
  dateClose = this.formBuilder.control<string | null>(
    this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm'),
  );
  timeframe = this.formBuilder.control<string | null>(
    'M1',
    Validators.required,
  );
  account = this.formBuilder.control<number>(
    this.activatedRoute.snapshot.queryParams['account'] ?? 1,
  );
  status = this.formBuilder.control<number>(
    this.DEFAULT_STATUS,
    Validators.required,
  );
  volume = this.formBuilder.control<number | null>(null);
  ratio = this.formBuilder.control<number | null>(null);
  revenue = this.formBuilder.control<number | null>(null);
  comment = this.formBuilder.control<string | null>(null);

  operationForm = this.formBuilder.group({
    id: this.id,
    symbol: this.symbol,
    orderType: this.orderType,
    dateOpen: this.dateOpen,
    dateClose: this.dateClose,
    timeframe: this.timeframe,
    status: this.status,
    account: this.account,
    volume: this.volume,
    ratio: this.ratio,
    revenue: this.revenue,
    comment: this.comment,
  });

  async ngOnInit() {
    this.account.setValue(this.activatedRoute.snapshot.queryParams['account']);
    if (this.operationParamId) {
      const operationDetails = await firstValueFrom(
        this.operationService.getOperation(this.operationParamId),
      );
      this.comments = await firstValueFrom(
        this.commentService.getCommentsById(this.operationParamId),
      );
      if (operationDetails) {
        this.setInitialFormStateOperation(operationDetails);
      }
    } else if (this.projectionParamId) {
      const projectionDetails = await firstValueFrom(
        this.projectionService.getProjection(this.projectionParamId),
      );
      if (projectionDetails) {
        this.setInitialFormStateOperationFromProjection(projectionDetails);
      }
    }
  }

  get mutation(): MutationType {
    if (this.operationParamId) {
      return MutationType.EDIT;
    }
    return MutationType.ADD;
  }

  get isMutationAdd(): boolean {
    return this.mutation === MutationType.ADD;
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
    return this.isMutationAdd ? 'bg-green' : 'bg-light-orange';
  }

  goToList() {
    navigatePreservingQueryParams(
      ['/operations'],
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

  onAddOperation(
    operationCreateInput: OperationCreateInput,
    projectionId: number | null,
  ) {
    debugger;
    if (this.uploadedFile) {
      this.uploadFileStorage(this.uploadedFile);
    }
    if (projectionId)
      return this.operationService.addOperationFromProjection(
        operationCreateInput,
        projectionId,
      );
    return this.operationService.addOperation(operationCreateInput);
  }

  onUpdateOperation(operationUpdateInput: OperationUpdateInput) {
    if (this.uploadedFile) {
      if (this.graphFileName) {
        this.fileService.deleteImage(this.graphFileName);
      }
      this.uploadFileStorage(this.uploadedFile);
    }
    return this.operationService.updateOperation(operationUpdateInput);
  }

  onAddComment(commentCreateInput: CreateOperationCommentInput) {
    return this.commentService.addComment(commentCreateInput);
  }

  setSymbolForm(symbol: Symbol) {
    this.operationForm.controls.symbol.setValue(symbol.id_sym);
  }

  private setInitialFormStateOperation(operationDetails: Operation) {
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
      revenue,
    } = operationDetails;
    this.id.setValue(id);
    this.symbol.setValue(id_sym);
    this.selectedSymbol = operationDetails.symbol.name_sym;
    this.orderType.setValue(updown);
    this.dateOpen.setValue(
      this.datePipe.transform(new Date(dateOpen!), 'yyyy-MM-ddTHH:mm', 'UTC'),
    );
    this.dateClose.setValue(
      dateClose
        ? this.datePipe.transform(
            new Date(dateClose),
            'yyyy-MM-ddTHH:mm',
            'UTC',
          )
        : null,
    );
    this.graphFileName = graph!;
    this.timeframe.setValue(timeframe);
    this.status.setValue(id_st);
    this.account.setValue(id_ac);
    this.volume.setValue(volume!);
    this.ratio.setValue(ratio!);
    this.revenue.setValue(revenue!);
  }

  private setInitialFormStateOperationFromProjection(
    projectionDetails: Projection,
  ) {
    const {
      symbol: { id_sym },
      updown,
      timeframe,
    } = projectionDetails;

    const statusOpen = 1;

    this.symbol.setValue(id_sym);
    this.selectedSymbol = projectionDetails.symbol.name_sym;
    this.orderType.setValue(updown ?? null);
    this.dateOpen.setValue(
      this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm'),
    );
    this.dateClose.setValue(null);
    this.timeframe.setValue(timeframe);
    this.status.setValue(statusOpen);
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

  private async handleMutationOperation(
    operationInput: OperationCreateInput | OperationUpdateInput,
  ): Promise<number | void> {
    try {
      this.isLoading = true;
      const projId = this.activatedRoute.snapshot.paramMap.get('projId');
      const parsedProjId = projId ? parseInt(projId) : null;
      const result = this.isMutationAdd
        ? await firstValueFrom(
            this.onAddOperation(
              operationInput as OperationCreateInput,
              parsedProjId,
            ),
          )
        : await firstValueFrom(
            this.onUpdateOperation(operationInput as OperationUpdateInput),
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
    commentInput: CreateOperationCommentInput,
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

  private getOperationCreateInput(): OperationCreateInput {
    const {
      symbol,
      orderType,
      dateOpen,
      dateClose,
      timeframe,
      status,
      account,
      volume,
      ratio,
      revenue,
    } = this.operationForm.value;
    return {
      id_sym: symbol!,
      updown: orderType!,
      time_op: dateOpen!,
      time_close: dateClose === '' ? undefined : dateClose!,
      graph: this.uploadedFile?.name,
      name_tf: timeframe!.toString(),
      id_st: status!,
      id_ac: account!,
      rr_ratio: ratio!,
      volume: volume!,
      revenue: revenue!,
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
      account,
      volume,
      ratio,
      revenue,
    } = this.operationForm.value;
    return {
      id_op: id!,
      id_sym: symbol!,
      updown: orderType!,
      time_op: dateOpen!,
      time_close: dateClose!,
      graph: this.uploadedFile?.name,
      name_tf: timeframe!.toString(),
      id_st: status!,
      id_ac: account!,
      rr_ratio: ratio!,
      volume: volume!,
      revenue: revenue!,
    };
  }

  private getCommentCreateInput(
    idOperation: number,
  ): CreateOperationCommentInput {
    const { comment } = this.operationForm.value;
    return {
      comment: comment!,
      id_op: idOperation!,
    };
  }

  async onSubmit() {
    if (this.operationForm.invalid) {
      this.toastService.error({
        message: 'Invalid form!',
      });
      return;
    }

    const operationInput: OperationCreateInput | OperationUpdateInput = this
      .isMutationAdd
      ? this.getOperationCreateInput()
      : this.getOperationUpdateInput();
    const operationId = await this.handleMutationOperation(operationInput);
    const comment = this.operationForm.value.comment;

    if (operationId && comment) {
      const commentInput: CreateOperationCommentInput =
        this.getCommentCreateInput(operationId);
      this.handleMutationComment(commentInput);
    }

    if (this.errors.length === 0) {
      const operation = this.isMutationAdd ? 'created' : 'updated';
      this.toastService.success({
        message: `Operation ${operation} successfully`,
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
