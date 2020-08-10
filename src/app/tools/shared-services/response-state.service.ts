import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ResponseStateService {
  stateSubject = new Subject();
  stateObservable = this.stateSubject.asObservable();
  responseState(responseState, responseData) {
    this.stateSubject.next([responseState, responseData]);
  }
}
