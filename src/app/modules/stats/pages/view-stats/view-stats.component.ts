import { Component, inject, OnDestroy } from '@angular/core';
import { distinctUntilChanged, map, shareReplay, Subscription } from 'rxjs';
import { ToastService } from 'src/app/core/service/toast.service';
import { OperationFilterFormService } from 'src/app/modules/operation/service/operation-filter-form.service';
import { OperationFilterService } from 'src/app/modules/operation/service/operation-filter.service';
import { OperationService } from 'src/app/modules/operation/service/operation.service';

@Component({
  selector: 'app-view-stats',
  templateUrl: './view-stats.component.html',
})
export class ViewStatsComponent implements OnDestroy {
  private operationFilterFormService = inject(OperationFilterFormService);
  private operationService = inject(OperationService);
  private operationFilterService = inject(OperationFilterService);
  private toastService = inject(ToastService);
  private hasOperationSubs!: Subscription;

  operationData$ = this.operationService.operations$;
  hasOperations$ = this.operationFilterService
    .getFilteredOperations(this.operationData$)
    .pipe(
      map((operations) => operations.length > 0),
      distinctUntilChanged(),
      shareReplay(1),
    );

  constructor() {
    this.hasOperationSubs = this.hasOperations$.subscribe((hasOperations) => {
      if (!hasOperations)
        this.toastService.info({
          message: `No data for this period`,
        });
    });
  }

  resetFilterForm() {
    this.operationFilterFormService.resetForm();
  }

  ngOnDestroy() {
    this.hasOperationSubs.unsubscribe();
  }
}
