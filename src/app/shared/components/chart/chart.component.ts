import { Component, Input, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartService, ChartType } from 'src/app/core/service/chart.service';
import { OperationService } from 'src/app/modules/operation/service/operation.service';

@Component({
  selector: 'app-chart',
  template: '<div [id]="chartType"></div>',
})
export class ChartComponent implements OnInit {
  private operationService = inject(OperationService);
  private chartService = inject(ChartService);

  private subscription?: Subscription;
  private data: (number | null)[] = [];

  @Input() chartType: ChartType = 'line';

  operationData$ = this.operationService.operations$;

  async ngOnInit() {
    switch (this.chartType) {
      case 'line':
        await new Promise<void>((resolve) => {
          this.subscription = this.operationData$.subscribe((operations) => {
            this.data = operations
              .filter((operation) => operation.account.id_ac === 1)
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
                const currentPoints = operation.points ?? 0;
                const newTotal = previousTotal + currentPoints;
                accumulatedData.push(newTotal);
                return accumulatedData;
              }, []);
            this.chartService.updateChart(this.data, this.chartType);
            resolve();
          });
        });

        this.chartService.initializeLineChart(this.data);
        break;
      case 'pie':
        await new Promise<void>((resolve) => {
          this.subscription = this.operationData$.subscribe((operations) => {
            this.data = operations
              .filter((operation) => operation.account.id_ac === 1)
              .map(({ points }) => points ?? null);

            this.chartService.updateChart(this.data, this.chartType);
            resolve();
          });
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
