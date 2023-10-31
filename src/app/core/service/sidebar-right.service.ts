import { Injectable } from '@angular/core';
import { BehaviorSubject, shareReplay } from 'rxjs';
import { SidebarRightAnimationState } from 'src/app/shared/utils/sidebar-right-animation';

@Injectable({
  providedIn: 'root',
})
export class SidebarRightService {
  private _sidebarRightState$ = new BehaviorSubject<SidebarRightAnimationState>(
    'out',
  );

  sidebarRightState$ = this._sidebarRightState$
    .asObservable()
    .pipe(shareReplay());

  openSidebarRight() {
    this._sidebarRightState$.next('in');
  }

  closeSidebarRight() {
    this._sidebarRightState$.next('out');
  }
}
