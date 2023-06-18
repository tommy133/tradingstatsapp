import { Component } from '@angular/core';
import { NavButton } from 'src/app/shared/navbar/navbar.component';

@Component({
  selector: 'app-operation-layout',
  templateUrl: './operation-layout.component.html',
  styles: [],
})
export class OperationLayoutComponent {
  title: string = 'Trading Stats';
  buttons: NavButton[] = [
    {
      text: 'Projections',
      link: '/projections',
    },
  ];

  constructor() {}
}
