import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-trimester-btn',
  template: ` <button
    class="square-btn"
    [ngClass]="selected ? 'bg-gray-300' : 'bg-dark'"
    (click)="selectedChange.emit(!selected)"
  >
    <h5 [ngClass]="selected ? 'text-black' : 'text-white'"><ng-content /></h5>
  </button>`,
})
export class TrimesterBtnComponent {
  @Input() selected: boolean = false;
  @Output() selectedChange = new EventEmitter<boolean>();
}
