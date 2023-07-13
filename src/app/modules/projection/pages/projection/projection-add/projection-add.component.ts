import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';
import { ProjectionComment } from 'src/app/data/models/pcomment';
import { Status } from 'src/app/data/models/status';
import { Symbol } from 'src/app/data/models/symbol';
import { Timeframe } from 'src/app/data/models/timeframe';
import { ProjectionCommentService } from 'src/app/data/service/pcomment.service';
import { StatusService } from 'src/app/data/service/status.service';
import { SymbolService } from 'src/app/data/service/symbol.service';
import { ProjectionCreateInput } from '../../../model/projectionCreateInput';
import { ProjectionService } from '../../../service/projection.service';

@Component({
  selector: 'app-projection-add',
  templateUrl: './projection-add.component.html',
})
export class ProjectionAddComponent {
  constructor(
    private formBuilder: FormBuilder,
    private projectionService: ProjectionService,
    private symbolService: SymbolService,
    private statusService: StatusService,
    private commentService: ProjectionCommentService,
  ) {}

  isLoading: boolean = false;
  errors: Array<string> = [];
  isSubmited = false;

  symbols$: Observable<Symbol[]> = this.symbolService.getSymbols();
  statuses$: Observable<Status[]> = this.statusService.getStatuses();

  timeframes = Object.values(Timeframe).filter(
    (value) => typeof value !== 'number',
  );

  symbol = this.formBuilder.control<number | null>(null, Validators.required);
  orderType = this.formBuilder.control<boolean | null>(
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

  onAddProjection(projectionCreateInput: ProjectionCreateInput) {
    return this.projectionService.addProjection(projectionCreateInput);
  }

  onAddComment(commentCreateInput: ProjectionComment) {
    return this.commentService.addComment(commentCreateInput);
  }

  get orderTypeValue(): boolean {
    return this.orderType.value !== false;
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
    const { symbol, timeframe, status, comment } = submitedInput;
    const projectionCreateInput: ProjectionCreateInput = {
      id_sym: symbol!,
      updown: this.orderTypeValue,
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
    this.isSubmited = true;
  }
}
