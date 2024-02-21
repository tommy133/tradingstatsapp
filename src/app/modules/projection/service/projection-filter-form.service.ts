import { inject, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ProjectionFilterFormService {
  private formBuilder = inject(FormBuilder);

  orderType = this.formBuilder.control<string | null>(null);
  timeframe = this.formBuilder.control<string | null>(null);
  status = this.formBuilder.control<string | null>(null);
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
