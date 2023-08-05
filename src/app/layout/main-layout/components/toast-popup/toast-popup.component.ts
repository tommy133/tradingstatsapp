import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastOptions, ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-toast-popup',
  templateUrl: './toast-popup.component.html',
  styleUrls: ['./toast-popup.component.css'],
})
export class ToastPopupComponent {
  toast$: Observable<ToastOptions | null>;

  constructor(private toastService: ToastService) {
    this.toast$ = this.toastService.toast$;
  }

  get titleStyle(): string {
    return 'p-5 text-white';
  }

  getmessageStyle(toastType: string): string {
    return toastType === 'success' || 'info'
      ? 'text-center pt-4 text-white'
      : 'pl-5 text-white';
  }
}
