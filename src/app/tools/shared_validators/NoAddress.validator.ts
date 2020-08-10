import { AbstractControl } from '@angular/forms';
export function noAddressValidator(control: AbstractControl) {
  if (typeof control.value.clientIdObj === 'object') {
    if (control.value.clientIdObj.locations && control.value.clientIdObj.locations.length === 0) {
      return { noAddress: true };
    } else {
      return null;
    }
  }
  return null;
}
