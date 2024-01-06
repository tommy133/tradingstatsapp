import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-trimester-selector',
  template: `<ng-container
    *ngIf="selectedTrimesters$ | async as selectedTrimesters"
  >
    <div class="flex flex-row space-x-4">
      <app-trimester-btn [selected]="selectedTrimesters[0]">
        Q1
      </app-trimester-btn>
      <app-trimester-btn [selected]="selectedTrimesters[1]">
        Q2
      </app-trimester-btn>
      <app-trimester-btn [selected]="selectedTrimesters[2]">
        Q3
      </app-trimester-btn>
      <app-trimester-btn [selected]="selectedTrimesters[3]">
        Q4
      </app-trimester-btn>
    </div>
  </ng-container> `,
})
export class TrimesterSelectorComponent {
  private activatedRoute = inject(ActivatedRoute);
  constructor() {
    this.selectedTrimesters$.subscribe(console.log);
  }
  selectedTrimesters$ = this.activatedRoute.queryParams.pipe(
    map((quarters) => [
      quarters['q1'] === 'true',
      quarters['q2'] === 'true',
      quarters['q3'] === 'true',
      quarters['q4'] === 'true',
    ]),
  );
}
