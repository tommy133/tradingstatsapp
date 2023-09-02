import { Component } from '@angular/core';

@Component({
  selector: 'app-stats-layout',
  template: ` <app-navbar [title]="title" [buttons]="buttons"></app-navbar>
    <router-outlet></router-outlet>`,
})
export class StatsLayoutComponent {
  title: string = 'Trading Stats';
  buttons = [
    {
      text: 'Projections',
      link: '/projections',
    },
    {
      text: 'Operations',
      link: '/operations',
    },
    {
      text: 'Stats',
      link: '/stats',
    },
  ];
}
