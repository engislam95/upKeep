import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SidebarTriggerService {
  showSidemenu = false;
  overlayShow = false;
  overlayTriggerSubject = new Subject();
  overlayTriggerObservable = this.overlayTriggerSubject.asObservable();

  sidebarTriggerSubject = new Subject();
  sidebarTriggerObservable = this.sidebarTriggerSubject.asObservable();
  toggelSidemenu() {
    this.showSidemenu = !this.showSidemenu;
    this.showSidemenu ? this.sidebarTriggerSubject.next('block') : this.sidebarTriggerSubject.next('none');
  }

  toggelOverlay() {
    this.overlayShow = !this.overlayShow;
    this.overlayShow ? this.overlayTriggerSubject.next('block') : this.overlayTriggerSubject.next('none');
  }

  constructor() {}
}
