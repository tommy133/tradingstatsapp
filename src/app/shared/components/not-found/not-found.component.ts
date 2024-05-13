import { Component, inject } from '@angular/core';
import { ToastService } from 'src/app/core/service/toast.service';
import { NavButton } from '../../utils/custom-types';

@Component({
  selector: 'app-not-found',
  template: `<app-navbar [title]="title" [buttons]="buttons"> </app-navbar> `,
})
export class NotFoundComponent {
  private toastService = inject(ToastService);
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
  ngOnInit() {
    this.toastService.error({ message: 'Page not found' });
  }
}
