import { Component, Input, Optional } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-selector',
  template: `
    <select [ngClass]="selectStyle" [formControl]="formControl">
      <ng-content></ng-content>
    </select>
  `,
})
export class SelectorComponent implements ControlValueAccessor {
  isDisabled = false;
  onChange: any = () => {};
  onTouched: any = () => {};
  constructor(@Optional() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }
  writeValue(value: any): void {
    this.ngControl?.control?.setValue(value);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  @Input() formControl!: FormControl;
  @Input() selectStyle?: string;
}
