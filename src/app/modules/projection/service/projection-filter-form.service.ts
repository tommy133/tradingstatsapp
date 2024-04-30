import { inject, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ProjectionFilterFormService {
  private formBuilder = inject(FormBuilder);
  readonly DEFAULT_STATUS = '3'; //WATCHING

  orderType = this.formBuilder.control<string | null>(null);
  timeframe = this.formBuilder.control<string | null>(null);
  status = this.formBuilder.control<string | null>(this.DEFAULT_STATUS);
  market = this.formBuilder.control<string | null>(null);

  filtersForm = this.formBuilder.group({
    orderType: this.orderType,
    timeframe: this.timeframe,
    status: this.status,
    market: this.market,
  });

  resetForm() {
    this.filtersForm.reset();
  }

  static checkNullSelectControl(input: string | null | undefined) {
    return !input || input === 'null';
  }
}
