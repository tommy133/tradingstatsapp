import { Injectable } from '@angular/core';
import { BehaviorSubject, shareReplay } from 'rxjs';
import { SidebarAnimationState } from 'src/app/shared/utils/custom-types';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private _sidebarRightState$ = new BehaviorSubject<SidebarAnimationState>(
    'out',
  );
  private _sidebarLeftState$ = new BehaviorSubject<SidebarAnimationState>(
    'out',
  );

  sidebarRightState$ = this._sidebarRightState$
    .asObservable()
    .pipe(shareReplay());

  sidebarLeftState$ = this._sidebarLeftState$
    .asObservable()
    .pipe(shareReplay());

  openSidebarRight() {
    this._sidebarRightState$.next('in');
  }

  closeSidebarRight() {
    this._sidebarRightState$.next('out');
  }

  openSidebarLeft() {
    this._sidebarLeftState$.next('in');
  }

  closeSidebarLeft() {
    this._sidebarLeftState$.next('out');
  }
}
