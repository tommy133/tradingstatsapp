import { Component, Input, Optional } from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';

@Component({
  selector: 'app-validation-error',
  template: `<ng-container *ngIf="errorText"
    ><p class="text-red" [innerText]="errorText"></p
  ></ng-container>`,
})
export class ValidationErrorComponent {
  @Input() fieldName!: string;
  @Input() maxRange?: string;
  @Input() for!: string; // name of input element
  constructor(@Optional() private control: ControlContainer) {}

  get errorText(): string | undefined {
    const formControl = (this.control as any).form.get(this.for) as FormControl;
    const errorsAndMessages = new Map<string, string>([
      ['required', `${this.fieldName} required`],
      ['max', `${this.fieldName} can't exceed ${this.maxRange}`],
    ]);
    if (formControl && formControl.touched) {
      const keyOrNull = Object.keys(formControl.errors ?? {}).at(0);
      if (keyOrNull) {
        return (
          errorsAndMessages.get(keyOrNull) ??
          `Undefined error message for key ${keyOrNull}`
        );
      }
    }

    return undefined;
  }
}
