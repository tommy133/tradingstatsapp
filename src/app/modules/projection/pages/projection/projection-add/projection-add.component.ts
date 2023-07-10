import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';
import { Comment } from 'src/app/data/models/comment';
import { Status } from 'src/app/data/models/status';
import { Symbol } from 'src/app/data/models/symbol';
import { Timeframe } from 'src/app/data/models/timeframe';
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
  ) {}

  projectionId: number | undefined;
  isLoading: boolean = false;
  errors: Array<string> = [];
  isSubmited = false;

  symbols$: Observable<Symbol[]> = this.symbolService.getSymbols();
  statuses$: Observable<Status[]> = this.statusService.getStatuses();

  timeframes = Object.values(Timeframe).filter(
    (value) => typeof value !== 'number',
  );

  symbol = this.formBuilder.control<number | null>(null);
  orderType = this.formBuilder.control<boolean>(false);
  //chart
  timeframe = this.formBuilder.control<Timeframe | null>(null);
  status = this.formBuilder.control<number | null>(null);
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

  get orderTypeValue(): boolean {
    return this.orderType.value !== false;
  }

  private async handleCreateProjection(
    projectionCreateInput: ProjectionCreateInput,
  ) {
    try {
      this.isLoading = true;
      const result = await firstValueFrom(
        this.onAddProjection(projectionCreateInput),
      );
      if (result) {
        this.projectionId = result as number;
      }
      // Toast showCreatedSuccessfully
    } catch (e: any) {
      this.errors.push(e.message as string);
    } finally {
      this.isLoading = false;
    }
  }

  private async handleCreateComment(commentInput: Comment) {
    try {
      this.isLoading = true;
      //const result = await firstValueFrom(this.onAddProjection(commentInput));

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

    this.handleCreateProjection(projectionCreateInput);

    if (comment && this.projectionId) {
      const commentInput: Comment = {
        comment: comment,
        id_proj: this.projectionId,
      };
      this.handleCreateComment(commentInput);
    }
    this.isSubmited = true;
  }
}
