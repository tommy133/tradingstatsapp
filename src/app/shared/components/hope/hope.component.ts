import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
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
              <p class="pl-1">points</p></app-label
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
  private operationService = inject(OperationService);

  private subscription?: Subscription;
  private data: (number | null)[] = [];
  operationData$ = this.operationService.operations$;

  targetValue: number = 0;
  counterValue: number = 0;

  async ngOnInit() {
    await new Promise<void>((resolve) => {
      this.subscription = this.operationData$.subscribe((operations) => {
        this.data = operations
          .filter((operation) => operation.account.id_ac === 1)
          .map(({ points }) => points ?? null);
        this.targetValue = this.calculateHope(this.data);
        resolve();
      });
    });
    this.startCounter();
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
    const meanPositive = (sumPositive ?? 0) / positiveValues.length;

    // Calculate mean for negative values
    const sumNegative = negativeValues.reduce((acc, value) => acc! + value!, 0);
    const meanNegative = (sumNegative ?? 0) / negativeValues.length;

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
