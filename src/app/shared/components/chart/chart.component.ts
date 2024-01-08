import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Subscription } from 'rxjs';
import { ChartService, ChartType } from 'src/app/core/service/chart.service';
import { OperationService } from 'src/app/modules/operation/service/operation.service';

@Component({
  selector: 'app-chart',
  template: '<div [id]="chartType"></div>',
})
export class ChartComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private operationService = inject(OperationService);
  private chartService = inject(ChartService);

  private subscription?: Subscription;
  private data: (number | null)[] = [];

  @Input() chartType: ChartType = 'line';

  operationData$ = this.operationService.operations$;

  quarters$ = this.activatedRoute.queryParams.pipe(
    map((quarters) => ({
      q1: quarters['q1'] === 'true',
      q2: quarters['q2'] === 'true',
      q3: quarters['q3'] === 'true',
      q4: quarters['q4'] === 'true',
    })),
  );

  year$ = this.activatedRoute.queryParams.pipe(
    map((queryParams) => queryParams['year']),
  );

  filteredOperations$ = combineLatest([
    this.operationData$,
    this.quarters$,
    this.year$,
  ]).pipe(
    map(([operations, quarters, year]) => {
      return operations.filter((operation) => {
        if (operation.dateOpen) {
          const operationDate = new Date(operation.dateOpen);
          const quarter = Math.floor(operationDate.getMonth() / 3) + 1;
          return (
            (quarters as { [key: string]: boolean })[`q${quarter}`] &&
            operationDate.getFullYear() == year
          );
        }
        return false;
      });
    }),
  );

  async ngOnInit() {
    const account = this.activatedRoute.snapshot.queryParams['account'] ?? '1';
    switch (this.chartType) {
      case 'line':
        await new Promise<void>((resolve) => {
          this.subscription = this.filteredOperations$.subscribe(
            (operations) => {
              this.data = operations
                .filter(
                  (operation) => operation.account.id_ac === parseInt(account),
                )
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
            },
          );
        });

        this.chartService.initializeLineChart(this.data);
        break;
      case 'pie':
        await new Promise<void>((resolve) => {
          this.subscription = this.filteredOperations$.subscribe(
            (operations) => {
              this.data = operations
                .filter(
                  (operation) => operation.account.id_ac === parseInt(account),
                )
                .map(({ points }) => points ?? null);

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
