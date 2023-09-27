import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-trimester-selector',
  template: `<div class="flex flex-row space-x-4">
    <app-square-button
      text="Q1"
      [token]="1"
      [selected]="token === 1"
      (tokenOutput)="setToken($event)"
    ></app-square-button>
    <app-square-button
      text="Q2"
      [token]="2"
      [selected]="token === 2"
      (tokenOutput)="setToken($event)"
    ></app-square-button>
    <app-square-button
      text="Q3"
      [token]="3"
      [selected]="token === 3"
      (tokenOutput)="setToken($event)"
    ></app-square-button>
    <app-square-button
      text="Q4"
      [token]="4"
      [selected]="token === 4"
      (tokenOutput)="setToken($event)"
    ></app-square-button>
  </div> `,
})
export class TrimesterSelectorComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  token: number = 4;
  setToken(token: number) {
    this.token = token;
    this.router.navigate([''], {
      relativeTo: this.activatedRoute,
      queryParams: {
        period: 'q' + token,
      },
    });
  }
}
