import { AbstractControl } from '@angular/forms';
export function detailsValidator(control: AbstractControl) {
  if (control.value !== '<p>&nbsp;</p>') {
    return null;
  }
  return { emptyValue: true };
}
