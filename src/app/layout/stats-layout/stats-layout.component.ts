import { Component } from '@angular/core';

@Component({
  selector: 'app-stats-layout',
  templateUrl: './stats-layout.component.html',
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
