import { Component, inject } from '@angular/core';
import { ToastService } from 'src/app/core/service/toast.service';
import { MainLayoutComponent } from 'src/app/layout/main-layout/main-layout.component';

@Component({
  selector: 'app-not-found',
  template: `<app-navbar [title]="title" [buttons]="buttons"> </app-navbar> `,
})
export class NotFoundComponent {
  private toastService = inject(ToastService);
  title = MainLayoutComponent.title;
  buttons = MainLayoutComponent.buttons;
  ngOnInit() {
    this.toastService.error({ message: 'Page not found' });
  }
}
