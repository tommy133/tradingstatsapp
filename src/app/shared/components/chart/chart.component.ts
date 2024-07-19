import { Component, inject, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartService, ChartType } from 'src/app/core/service/chart.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { OperationFilterService } from 'src/app/modules/operation/service/operation-filter.service';
import { OperationService } from 'src/app/modules/operation/service/operation.service';

@Component({
  selector: 'app-chart',
  template: '<div [id]="chartType"></div>',
})
export class ChartComponent implements OnInit {
  private operationService = inject(OperationService);
  private operationFilterService = inject(OperationFilterService);
  private chartService = inject(ChartService);

  private subscription?: Subscription;
  private data: (number | null)[] = [];

  @Input() chartType: ChartType = 'line';

  operationData$ = this.operationService.operations$;

  filteredOperations$ = this.operationFilterService.getFilteredOperations(
    this.operationData$,
  );

  toastService = inject(ToastService);

  async ngOnInit() {
    switch (this.chartType) {
      case 'line':
        await new Promise<void>((resolve) => {
          this.subscription = this.filteredOperations$.subscribe(
            (operations) => {
              this.data = operations
                .sort(
                  (a, b) =>
                    new Date(a.dateOpen!).getTime() -
                    new Date(b.dateOpen!).getTime(),
                )
                .reduce((accumulatedData: number[], operation) => {
                  const previousTotal =
                    accumulatedData.length > 0
                      ? accumulatedData[accumulatedData.length - 1]
                      : 0;
                  const currentRevenue = operation.revenue ?? 0;
                  const newTotal = previousTotal + currentRevenue;
                  accumulatedData.push(newTotal);
                  return accumulatedData;
                }, []);
              this.chartService.updateChart(this.data, this.chartType);
              resolve();
            },
          );
        });

        this.chartService.initializeLineChart(this.data);
        break;
      case 'pie':
        await new Promise<void>((resolve) => {
          this.subscription = this.filteredOperations$.subscribe(
            (operations) => {
              this.data = operations.map(({ revenue }) => revenue ?? null);

              this.chartService.updateChart(this.data, this.chartType);
              resolve();
            },
          );
        });

        this.chartService.initializePieChart(this.data);
        break;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
