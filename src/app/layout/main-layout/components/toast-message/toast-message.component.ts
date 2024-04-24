import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, inject } from '@angular/core';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-toast-message',
  template: `
    <div *ngIf="toast$ | async as toast" @slideInOut [ngClass]="toast.type">
      <p
        class="label text-white"
        *ngIf="toast.title as title"
        [innerText]="title"
      ></p>
      <p
        class="body-xs text-white"
        *ngIf="toast.message as message"
        [innerText]="message"
      ></p>
    </div>
  `,
  styles: [
    `
      div {
        @apply flex flex flex-col gap-2 w-full sm:min-w-[412px] max-w-[412px] p-4 text-white rounded-lg shadow;
      }

      .success {
        background-color: theme(colors.green);
      }
      .error {
        background-color: theme(colors.red);
      }
      .warning {
        background-color: #f89406;
      }
      .info {
        background-color: #3276b1;
      }
    `,
  ],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-120%)' }),
        animate(
          '0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
          style({ transform: 'translateX(0)' }),
        ),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate(
          '0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
          style({ transform: 'translateX(-120%)' }),
        ),
      ]),
    ]),
  ],
})
export class ToastMessageComponent {
  toast$ = inject(ToastService).toast$;
  @HostBinding('role') role = 'alert';
}
