import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-trimester-selector',
  template: `<ng-container
    *ngIf="selectedTrimesters$ | async as selectedTrimesters"
  >
    <div class="flex flex-row space-x-4">
      <app-trimester-btn
        [selected]="selectedTrimesters[0]"
        (selectedChange)="navigateSelectedTrimester('q1', $event)"
      >
        Q1
      </app-trimester-btn>
      <app-trimester-btn
        [selected]="selectedTrimesters[1]"
        (selectedChange)="navigateSelectedTrimester('q2', $event)"
      >
        Q2
      </app-trimester-btn>
      <app-trimester-btn
        [selected]="selectedTrimesters[2]"
        (selectedChange)="navigateSelectedTrimester('q3', $event)"
      >
        Q3
      </app-trimester-btn>
      <app-trimester-btn
        [selected]="selectedTrimesters[3]"
        (selectedChange)="navigateSelectedTrimester('q4', $event)"
      >
        Q4
      </app-trimester-btn>
    </div>
  </ng-container> `,
})
export class TrimesterSelectorComponent {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  selectedTrimesters$ = this.activatedRoute.queryParams.pipe(
    map((quarters) => [
      quarters['q1'] === 'true',
      quarters['q2'] === 'true',
      quarters['q3'] === 'true',
      quarters['q4'] === 'true',
    ]),
  );

  navigateSelectedTrimester(selectedTrimester: string, state: boolean) {
    const queryParams = {
      ...this.activatedRoute.snapshot.queryParams,
      [selectedTrimester]: state,
    };

    this.router.navigate(['.'], {
      relativeTo: this.activatedRoute,
      queryParams,
    });
  }
}
