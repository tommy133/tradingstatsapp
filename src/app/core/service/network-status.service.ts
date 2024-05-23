import { Observable, fromEvent, map, merge, shareReplay, startWith } from 'rxjs'

import { Injectable } from '@angular/core'

export type OnlineState = 'online' | 'offline'

@Injectable({
  providedIn: 'root',
})
export class NetworkStatusService {
  public readonly onlineStatus$: Observable<OnlineState> = merge(
    fromEvent(window, 'online').pipe<OnlineState>(map(() => 'online')),
    fromEvent(window, 'offline').pipe<OnlineState>(map(() => 'offline')),
  ).pipe(
    startWith<OnlineState>(window.navigator.onLine ? 'online' : 'offline'),
    shareReplay(1),
  )

  constructor() {}
}
