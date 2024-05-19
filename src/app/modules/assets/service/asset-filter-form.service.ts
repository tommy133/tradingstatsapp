import { inject, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AssetFilterFormService {
  private formBuilder = inject(FormBuilder);

  market = this.formBuilder.control<string | null>(null);

  filtersForm = this.formBuilder.group({
    market: this.market,
  });

  resetForm() {
    this.filtersForm.reset();
  }

  static checkNullSelectControl(input: string | null | undefined) {
    return !input || input === 'null';
  }
}
