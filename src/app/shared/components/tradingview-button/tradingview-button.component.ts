import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TimeframeTradingViewIntervalMap } from '../../utils/shared-utils';

@Component({
  selector: 'app-tradingview-button',
  template: `<a
    [ngClass]="disabled ? 'opacity-20' : ''"
    (click)="$event.stopPropagation()"
    [href]="tradingViewUrl"
    target="_blank"
  >
    <svg-icon
      src="assets/svg/tradingview_logo.svg"
      [svgClass]="iconSvgClass"
      [svgStyle]="iconSvgStyle"
    ></svg-icon>
  </a>`,
})
export class TradingviewButtonComponent {
  @Input() iconSvgStyle?: any = { 'height.px': 32, 'width.px': 32 };
  @Input() iconSvgClass?: string;

  @Input() set data(data: { symbolName: string; timeframe?: string }) {
    const interval = data.timeframe
      ? `&interval=${TimeframeTradingViewIntervalMap[data.timeframe]}`
      : '';
    this.tradingViewUrl = `${environment.tradingViewUrl}${data.symbolName}${interval}`;
  }
  tradingViewUrl: string = '';

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  @Output() clickEvent = new EventEmitter<any>();
}
