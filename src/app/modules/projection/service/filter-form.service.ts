import { inject, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { StatusService } from 'src/app/data/service/status.service';

@Injectable({
  providedIn: 'root',
})
export class FilterFormService {
  private formBuilder = inject(FormBuilder);

  orderType = this.formBuilder.control<number | null>(null);
  timeframe = this.formBuilder.control<string | null>('M1');
  status = this.formBuilder.control<number>(StatusService.STATUS_CLOSED);
  market = this.formBuilder.control<number>(1);

  filtersForm = this.formBuilder.group({
    orderType: this.orderType,
    timeframe: this.timeframe,
    status: this.status,
    market: this.market,
  });
}
