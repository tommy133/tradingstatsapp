import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styles: [],
})
export class MainLayoutComponent {
  static title: string = 'Trading Stats';
  static buttons = [
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
    {
      text: 'Assets',
      link: '/assets',
    },
  ];
}
