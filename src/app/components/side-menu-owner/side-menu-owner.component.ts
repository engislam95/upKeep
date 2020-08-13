import { Component, OnInit } from '@angular/core';
import { trigger, animate, transition, style } from '@angular/animations';
import { SidebarTriggerService } from './../../tools/shared-services/sidebar-trigger.service';
import { fade } from './../../tools/shared_animations/fade';
@Component({
  selector: 'app-side-menu-owner',
  templateUrl: './side-menu-owner.component.html',
  styleUrls: ['./side-menu-owner.component.scss'],
  animations: [
    trigger('fade', [
      transition(
        ':enter',
        [
          style({ transform: 'translateX(5%)', opacity: 0 }),
          animate('300ms', style({ transform: 'translateX(0)', opacity: 1 }))
        ]
      ),
      transition(
        ':leave',
        [
          style({ transform: 'translateX(0)', opacity: 1 }),
          animate('300ms', style({ transform: 'translateX(5%)', opacity: 0 }))
        ]
      )
    ]),
    fade
  ]
})
export class SideMenuOwnerComponent implements OnInit {
  /* ----------------- Variables --------------------------- */
  showSideMenu: boolean = false;
  overLayShow: boolean = false;
  windowWidth = window.innerWidth;
  user: any = '';
  /* ----------------------- Constructor ------------------------ */
  constructor(private sidebarTriggerService: SidebarTriggerService) {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
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
  hideMenu() {
    let x = document.getElementsByClassName('side_page')[0];
    console.log(x);
    if (x['style'].transform != 'translateX(205px)') {
      x['style'].transform = 'translateX(205px)';
      sessionStorage.setItem('showMenu', 'false');
    }
    else {
      x['style'].transform = 'translateX(0)';
      sessionStorage.setItem('showMenu', 'true');
    }
    x['style'].transition = '.5s all ease-in-out';
  }
}
