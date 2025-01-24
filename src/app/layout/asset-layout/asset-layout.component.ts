import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/authentication/auth.service';
import { MainLayoutComponent } from '../main-layout/main-layout.component';

@Component({
  selector: 'app-asset-layout',
  templateUrl: './asset-layout.component.html',
})
export class AssetLayoutComponent {
  private authService = inject(AuthService);

  title = MainLayoutComponent.title;
  buttons = MainLayoutComponent.buttons;

  logout() {
    this.authService.logout();
  }
}
