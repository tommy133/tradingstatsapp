import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OperationFilterService } from 'src/app/modules/operation/service/operation-filter.service';
import { OperationService } from 'src/app/modules/operation/service/operation.service';

@Component({
  selector: 'app-hope',
  template: `
    <div class="text-center p-4">
      <div [@counterAnimation]="counterValue">
        <app-label
          bgColor="bg-dark"
          textColor="text-white"
          styles="inline-flex items-center justify-center rounded-md p-10 font-semibold text-sm"
        >
          <div class="flex flex-col space-y-10">
            <p class="font-semibold text-base">Hope</p>
            <app-label>
              <p
                [ngClass]="{
                  'text-dark-green': counterValue > 0,
                  'text-bright-blue': counterValue === 0,
                  'text-red': counterValue < 0
                }"
              >
                {{ counterValue }}
              </p>
              <p class="pl-1">€</p></app-label
            >
          </div>
        </app-label>
      </div>
    </div>
  `,
  animations: [
    trigger('counterAnimation', [
      state('start', style({ opacity: 0 })),
      state('end', style({ opacity: 1 })),
      transition('start => end', [
        animate('2000ms 10ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class HopeComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private operationService = inject(OperationService);
  private operationFilterService = inject(OperationFilterService);

  private subscription?: Subscription;
  private data: (number | null)[] = [];

  operationData$ = this.operationService.operations$;

  filteredOperations$ = this.operationFilterService.getFilteredOperations(
    this.operationData$,
  );

  targetValue: number = 0;
  counterValue: number = 0;

  async ngOnInit() {
    await new Promise<void>((resolve) => {
      this.subscription = this.filteredOperations$.subscribe((operations) => {
        const account =
          this.activatedRoute.snapshot.queryParams['account'] ?? '1';
        this.data = operations
          .filter((operation) => operation.account.id_ac === parseInt(account))
          .map(({ revenue }) => revenue ?? null);
        this.targetValue = this.calculateHope(this.data);
        this.startCounter();
        resolve();
      });
    });
  }

  private calculateHope(data: (number | null)[]): number {
    // Separate positive and negative values
    const positiveValues = data.filter((value) => value !== null && value > 0);
    const negativeValues = data.filter((value) => value !== null && value! < 0);
    const n_positive = positiveValues.length;
    const n_negative = negativeValues.length;
    const total = positiveValues.length + n_negative;
    const probPositive = n_positive / total;

    // Calculate mean for positive values
    const sumPositive = positiveValues.reduce((acc, value) => acc! + value!, 0);
    const meanPositive =
      positiveValues.length > 0
        ? (sumPositive ?? 0) / positiveValues.length
        : 0;

    // Calculate mean for negative values
    const sumNegative = negativeValues.reduce((acc, value) => acc! + value!, 0);
    const meanNegative =
      negativeValues.length > 0
        ? (sumNegative ?? 0) / negativeValues.length
        : 0;

    const sum = meanPositive * probPositive + meanNegative * (1 - probPositive);

    return sum;
  }

  private startCounter() {
    const delay = 10;
    const duration = 2000;
    const steps = Math.ceil(duration / delay);
    const increment = this.targetValue / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      this.counterValue = Math.round(increment * currentStep);
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, delay);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
