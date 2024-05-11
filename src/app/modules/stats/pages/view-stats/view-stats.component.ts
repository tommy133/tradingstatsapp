import { Component, inject } from '@angular/core';
import { OperationFilterFormService } from 'src/app/modules/operation/service/operation-filter-form.service';

@Component({
  selector: 'app-view-stats',
  templateUrl: './view-stats.component.html',
})
export class ViewStatsComponent {
  private operationFilterFormService = inject(OperationFilterFormService);

  resetFilterForm() {
    this.operationFilterFormService.resetForm();
  }
}
