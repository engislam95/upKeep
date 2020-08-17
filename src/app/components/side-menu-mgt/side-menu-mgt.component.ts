import { Component, OnInit } from '@angular/core';
import { trigger, animate, transition, style } from '@angular/animations';
import { SidebarTriggerService } from './../../tools/shared-services/sidebar-trigger.service';
import { fade } from './../../tools/shared_animations/fade';
@Component({
  selector: 'app-side-menu-mgt',
  templateUrl: './side-menu-mgt.component.html',
  styleUrls: ['./side-menu-mgt.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ transform: 'translateX(5%)', opacity: 0 }),
        animate('300ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('300ms', style({ transform: 'translateX(5%)', opacity: 0 }))
      ])
    ]),
    fade
  ]
})
export class SideMenuMgtComponent implements OnInit {
  /* ----------------- Variables --------------------------- */
  showSideMenu: boolean = false;
  overLayShow: boolean = false;
  windowWidth = window.innerWidth;
  user: any = {};
  /* ----------------------- Constructor ------------------------ */
  constructor(private sidebarTriggerService: SidebarTriggerService) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }
  /* --------------------- Oninit ------------------------------- */
  ngOnInit() {
    if (this.windowWidth > 991) {
      this.showSideMenu = true;
    } else {
      this.showSideMenu = false;
    }
    this.sidebarTriggerService.sidebarTriggerObservable.subscribe(params => {
      params === 'block'
        ? (this.showSideMenu = true)
        : (this.showSideMenu = false);
    });
    this.sidebarTriggerService.overlayTriggerObservable.subscribe(params => {
      params === 'block'
        ? (this.overLayShow = true)
        : (this.overLayShow = false);
    });
  }
  /* --------------------- Sidebar Overlay -------------------------- */
  sidebarOverlayTrigger() {
    this.sidebarTriggerService.toggelSidemenu();
    this.sidebarTriggerService.toggelOverlay();
  }
  /* ---------------------- Toggle Drop List ---------------------------- */
  toggle_drop_List(e) {
    const element = document.getElementsByClassName('drop_menu');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < element.length; i++) {
      if (element[i].id === e) {
        document.getElementById(e).classList.toggle('active_list');
      } else {
        element[i].classList.remove('active_list');
      }
    }
  }
}
