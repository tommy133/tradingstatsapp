import { Component } from '@angular/core';
import { MainLayoutComponent } from '../main-layout/main-layout.component';

@Component({
  selector: 'app-asset-layout',
  templateUrl: './asset-layout.component.html',
})
export class AssetLayoutComponent {
  title = MainLayoutComponent.title;
  buttons = MainLayoutComponent.buttons;
}
