import { Component, Input } from '@angular/core';
import { NavButton } from '../../utils/custom-types';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Input() title: string | null = '';
  @Input() buttons: Array<NavButton> | null = [];
  constructor() {}
}
