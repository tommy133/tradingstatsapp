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

  operationData$ = this.operationFilterService.getFilteredOperations(
    this.operationService.operations$.pipe(shareReplay(1)),
  );

  operationRevenueData$ = this.operationData$.pipe(
    map((data) => data.map(({ revenue }) => revenue ?? null)),
  );
  hasOperations$ = this.operationData$.pipe(
    map((operations) => operations.length > 0),
    distinctUntilChanged(),
  );

  constructor() {
    this.hasOperationSubs = this.hasOperations$.subscribe((hasOperations) => {
      if (!hasOperations)
        this.toastService.info({
          message: `No data for this filters`,
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
