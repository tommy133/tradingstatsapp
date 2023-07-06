import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';
import { Symbol, SymbolService } from 'src/app/data/service/symbol.service';
import { Status } from 'src/app/data/status';
import { Timeframe } from 'src/app/data/timeframe';
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

  isLoading: boolean = false;
  errors: Array<string> = [];

  symbols$: Observable<Symbol[]> = this.symbolService.getSymbols();
  timeframes = Object.values(Timeframe).filter(
    (value) => typeof value !== 'number',
  );
  statuses = Object.values(Status).filter((value) => typeof value !== 'number');

  symbol = this.formBuilder.control<Symbol | null>(null);
  orderType = this.formBuilder.control<boolean | null>(null);
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

  private async handleCreateProjection(projectionInput: Projection) {
    try {
      this.isLoading = true;
      const result = await firstValueFrom(
        this.onAddProjection(projectionInput),
      );
      // Toast showCreatedSuccessfully
    } catch (e: any) {
      this.errors.push(e.message as string);
    } finally {
      this.isLoading = false;
    }
  }

  private async handleCreateComment() {}

  onSubmit() {
    if (this.addProjectionForm.invalid) {
      return;
    }
    const submitedInput = this.addProjectionForm.value;
    const { symbol, orderType, timeframe, status, comment } = submitedInput;
    const projectionInput: Projection = {
      name_sym: symbol?.name_sym,
      updown: orderType!,
      date_proj: new Date(),
      name_tf: timeframe?.toString(),
      name_st: status?.toString(),
    };
    //const comment
    this.handleCreateProjection(projectionInput);
  }
}
