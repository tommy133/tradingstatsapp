import { AbstractControl } from '@angular/forms';

export const showError = (
  control: AbstractControl | null | undefined,
  submitted: boolean,
  searchControl?: AbstractControl | null,
) => {
  return (
    (submitted || control?.touched || searchControl?.touched) &&
    control?.invalid
  );
};
