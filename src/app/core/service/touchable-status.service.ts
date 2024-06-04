import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TouchableStatusService {
  public static readonly isTouchable = 'ontouchend' in document;
}
