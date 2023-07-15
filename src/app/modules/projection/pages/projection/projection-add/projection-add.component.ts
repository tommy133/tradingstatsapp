import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { Observable, firstValueFrom } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { ProjectionComment } from 'src/app/data/models/pcomment';
import { Status } from 'src/app/data/models/status';
import { Symbol } from 'src/app/data/models/symbol';
import { Timeframe } from 'src/app/data/models/timeframe';
import { ProjectionCommentService } from 'src/app/data/service/pcomment.service';
import { StatusService } from 'src/app/data/service/status.service';
import { SymbolService } from 'src/app/data/service/symbol.service';
import { ProjectionCreateInput } from '../../../model/projectionCreateInput';
import { ProjectionService } from '../../../service/projection.service';

const fileUploadUri = 'http://localhost:8080/file/upload';

@Component({
  selector: 'app-projection-add',
  templateUrl: './projection-add.component.html',
})
export class ProjectionAddComponent {
  isLoading: boolean = false;
  errors: Array<string> = [];
  uploader: FileUploader = new FileUploader({
    url: fileUploadUri,
    itemAlias: 'chart',
  });

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
      console.log('uploaded successfully...', status);
    };
  }

  onAddProjection(projectionCreateInput: ProjectionCreateInput) {
    return this.projectionService.addProjection(projectionCreateInput);
  }

  onAddComment(commentCreateInput: ProjectionComment) {
    return this.commentService.addComment(commentCreateInput);
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
      // Toast showCreatedSuccessfully
    } catch (e: any) {
      this.errors.push(e.message as string);
    } finally {
      this.isLoading = false;
    }
  }

  private async handleCreateComment(commentCreateInput: ProjectionComment) {
    try {
      this.isLoading = true;
      const result = await firstValueFrom(
        this.onAddComment(commentCreateInput),
      );

      // Toast showCreatedSuccessfully
    } catch (e: any) {
      this.errors.push(e.message as string);
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit() {
    if (this.addProjectionForm.invalid) {
      return;
    }
    const submitedInput = this.addProjectionForm.value;
    const { symbol, orderType, timeframe, status, comment } = submitedInput;
    const projectionCreateInput: ProjectionCreateInput = {
      id_sym: symbol!,
      updown: orderType!,
      date_proj: new Date(),
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
    } else {
      this.errors.forEach((error) => {
        this.toastService.error({
          message: error,
        });
      });
    }
  }
}
