import { Component } from '@angular/core';
import { MainLayoutComponent } from '../main-layout/main-layout.component';

@Component({
  selector: 'app-projection-layout',
  templateUrl: './projection-layout.component.html',
  styles: [],
})
export class ProjectionLayoutComponent {
  title = MainLayoutComponent.title;
  buttons = MainLayoutComponent.buttons;
}
