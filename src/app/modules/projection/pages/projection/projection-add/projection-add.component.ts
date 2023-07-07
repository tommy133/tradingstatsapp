import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';
import { Comment } from 'src/app/data/models/comment';
import { Status } from 'src/app/data/models/status';
import { Symbol } from 'src/app/data/models/symbol';
import { Timeframe } from 'src/app/data/models/timeframe';
import { SymbolService } from 'src/app/data/service/symbol.service';
import { Projection } from '../../../model/projection';
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
  ) {}

  idProjection: number | undefined;
  isLoading: boolean = false;
  errors: Array<string> = [];

  symbols$: Observable<Symbol[]> = this.symbolService.getSymbols();
  timeframes = Object.values(Timeframe).filter(
    (value) => typeof value !== 'number',
  );
  statuses = Object.values(Status).filter((value) => typeof value !== 'number');

  symbol = this.formBuilder.control<string | null>(null);
  orderType = this.formBuilder.control<boolean>(false);
  //chart
  timeframe = this.formBuilder.control<Timeframe | null>(null);
  status = this.formBuilder.control<Status | null>(null);
  comment = this.formBuilder.control<string | null>(null);

  addProjectionForm = this.formBuilder.group({
    symbol: this.symbol,
    orderType: this.orderType,
    timeframe: this.timeframe,
    status: this.status,
    comment: this.comment,
  });

  onAddProjection(projection: Projection) {
    return this.projectionService.addProjection(projection);
  }

  get orderTypeValue(): boolean {
    return this.orderType.value !== false;
  }

  private async handleCreateProjection(projectionInput: Projection) {
    try {
      this.isLoading = true;
      const result = await firstValueFrom(
        this.onAddProjection(projectionInput),
      );
      if (result) {
        this.idProjection = result.id;
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
    const projectionInput: Projection = {
      name_sym: symbol!,
      updown: this.orderTypeValue,
      date_proj: new Date(),
      name_tf: timeframe?.toString(),
      name_st: status?.toString(),
    };

    this.handleCreateProjection(projectionInput);

    if (comment && this.idProjection) {
      const commentInput: Comment = {
        comment: comment,
        id_proj: this.idProjection,
      };
      this.handleCreateComment(commentInput);
    }
  }
}
