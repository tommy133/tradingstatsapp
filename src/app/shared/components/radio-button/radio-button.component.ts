import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion'
import { Component, EventEmitter, Input, Optional, Output } from '@angular/core'
import { NgControl } from '@angular/forms'
@Component({
  selector: 'app-radio-button',
  template: `
    <div
      class="p-2 flex gap-2 rounded-md text-sm hocus:bg-dark/5 items-center cursor-pointer"
      [ngClass]="{ 'bg-dark/5': this.isChecked }"
      (click)="handleChange(input.checked)">
      <input #input type="radio" [checked]="isChecked" [disabled]="disabled" />
      <ng-content select="[label]"></ng-content>
    </div>
  `,
  styleUrls: ['./radio-button.component.css'],
})
export class RadioButtonComponent {
  @Input() uid!: string
  @Input() isChecked: boolean = false
  @Input() value?: any
  @Input()
  get disabled() {
    return this._disabled
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value)
  }
  private _disabled = false

  @Output() radioCheckedEvent = new EventEmitter<string>()

  onChange: any = () => {}
  onTouched: any = () => {}
  constructor(@Optional() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this
    }
  }
  writeValue(value: any): void {
    if (value === null) return
    this.ngControl?.control?.setValue(value)
    this.isChecked = value
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled
  }

  handleChange(value: boolean) {
    if (this.disabled) return
    this.onChange(value)
    this.radioCheckedEvent.emit(this.uid)
  }
}
