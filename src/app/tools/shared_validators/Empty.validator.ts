import { AbstractControl } from '@angular/forms';
export function emptyValidator(control: AbstractControl) {
  if (control.value.id) {
    return null;
  }
  return { emptyValue: true };
}
