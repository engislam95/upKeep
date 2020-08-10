import { Injectable } from '@angular/core';

@Injectable()
export class SelectSearchService {
  constructor() {}
  //  ######################### Start Filter #########################
  filterOptions(value, array) {
    return array.filter(option => option.name.includes(value));
  }
  //  ######################### End Filter #########################
  //  ######################### Start display Options For Select #########################
  displaySelected(state) {
    if (state !== null) {
      if (state.user) {
        return state.user.name;
      } else {
        return state.name;
      }
    }
  }
  //  ######################### End display Options For Select #########################
}
