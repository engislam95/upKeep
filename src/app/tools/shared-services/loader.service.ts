import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoaderService {
  loaderSubject = new Subject();
  loaderObservable = this.loaderSubject.asObservable();
  startLoading() {
    this.loaderSubject.next(true);
  }
  endLoading() {
    this.loaderSubject.next(false);
  }
}
