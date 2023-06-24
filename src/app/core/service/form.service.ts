import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor() {}

  public checkErrorsByControl(formControl: AbstractControl<any> | null) {
    return formControl?.invalid && (formControl.dirty || formControl.touched);
  }
}
