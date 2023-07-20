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
import { ProjectionCreateInput } from '../../../model/projectionCreateInput';
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
  subscription: Subscription | undefined;

  symbols$: Observable<Symbol[]> = this.symbolService.getSymbols();
  statuses$: Observable<Status[]> = this.statusService.getStatuses();

  timeframes = Object.values(Timeframe).filter(
    (value) => typeof value !== 'number',
  );

  symbol = this.formBuilder.control<number | null>(null, Validators.required);
  orderType = this.formBuilder.control<number | null>(
    null,
    Validators.required,
  );
  //chart
  timeframe = this.formBuilder.control<Timeframe | null>(
    null,
    Validators.required,
  );
  status = this.formBuilder.control<number | null>(null, Validators.required);
  comment = this.formBuilder.control<string | null>(null);

  addProjectionForm = this.formBuilder.group({
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

  onAddProjection(projectionCreateInput: ProjectionCreateInput) {
    return this.projectionService.addProjection(projectionCreateInput);
  }

  onAddComment(commentCreateInput: ProjectionComment) {
    return this.commentService.addComment(commentCreateInput);
  }

  removeUploadedFile() {
    this.uploader.clearQueue();
  }

  private async handleCreateProjection(
    projectionCreateInput: ProjectionCreateInput,
  ): Promise<number | void> {
    try {
      this.isLoading = true;
      const result = await firstValueFrom(
        this.onAddProjection(projectionCreateInput),
      );
      if (result) {
        this.isLoading = false;
        return result as number;
      }
    } catch (e: any) {
      this.errors.push(e.message as string);
    } finally {
      this.isLoading = false;
    }
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

  private async handleCreateComment(commentCreateInput: ProjectionComment) {
    try {
      this.isLoading = true;
      await firstValueFrom(this.onAddComment(commentCreateInput));
    } catch (e: any) {
      this.errors.push(e.message as string);
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit() {
    if (this.addProjectionForm.invalid) {
      this.toastService.error({
        message: 'Invalid form!',
      });
      return;
    }
    const submitedInput = this.addProjectionForm.value;
    const { symbol, orderType, timeframe, status, comment } = submitedInput;

    await this.handleUploadChart(); // wait toload this.chartFileName

    const projectionCreateInput: ProjectionCreateInput = {
      id_sym: symbol!,
      updown: orderType!,
      date_proj: new Date(),
      graph: this.chartFileName,
      name_tf: timeframe!.toString(),
      id_st: status!,
    };
    const projId = await this.handleCreateProjection(projectionCreateInput);

    if (comment && projId) {
      const commentInput: ProjectionComment = {
        pcomment: comment,
        id_proj: projId,
      };
      this.handleCreateComment(commentInput);
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
