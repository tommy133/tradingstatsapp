import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-counter-up',
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
export class CounterUpComponent implements OnInit {
  @Input() targetValue: number = 0;
  counterValue: number = 0;

  ngOnInit() {
    this.startCounter();
  }

  startCounter() {
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
}
