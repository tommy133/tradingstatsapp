import { Component } from '@angular/core';
import { NetworkStatusService } from 'src/app/core/service/network-status.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styles: [],
})
export class MainLayoutComponent {
  static title: string = 'Trading Stats';
  static buttons = [
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
    {
      text: 'Assets',
      link: '/assets',
    },
  ];

  hasBeenOffline: boolean = false

  constructor(private netStatus: NetworkStatusService, private toastService: ToastService) {
    this.netStatus.onlineStatus$.subscribe((status) => {
      if (status === 'offline') {
        this.toastService.warn({ message: "Network unavailable!" });
        this.hasBeenOffline = true;
      } else if (this.hasBeenOffline) this.toastService.success({ message: "Conection reestablished" })
    }
    )
  }
}
