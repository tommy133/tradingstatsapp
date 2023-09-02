import { Component } from '@angular/core';
import { NavButton } from 'src/app/shared/utils/custom-types';

@Component({
  selector: 'app-projection-layout',
  templateUrl: './projection-layout.component.html',
  styles: [],
})
export class ProjectionLayoutComponent {
  title: string = 'Trading Stats';
  buttons: NavButton[] = [
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
