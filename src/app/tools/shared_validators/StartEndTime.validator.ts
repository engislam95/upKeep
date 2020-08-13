import { AbstractControl } from '@angular/forms';
export function startEndTimeValidator(control: AbstractControl) {
  const startHour = +control.value.start.split(':')[0];
  const startMinute = +control.value.start.split(':')[1];
  let endHour = +control.value.end.split(':')[0];
  const endMinute = +control.value.end.split(':')[1];
  const startTimeType = localStorage.getItem('startTimeType');
  const endtimeType = localStorage.getItem('endTimeType');
  if (startHour !== (0 && NaN) && endHour !== (0 && NaN)) {
    if (endHour === 24) {
      endHour -= 12;
    }
    if (
      startHour == 12 &&
      startTimeType == 'am' &&
      (endHour == 12 && endtimeType == 'am') &&
      endMinute <= startMinute
    ) {
      return { endAfterStart: true };
    }
    if (endHour < startHour && (startTimeType == 'am' && endtimeType == 'am')) {
      return null;
    }
    if (endHour < startHour) {
      return { endAfterStart: true };
    } else if (endHour === startHour && endMinute <= startMinute) {
      return { endAfterStart: true };
    }
    return null;
  }
}
