import { CoreService } from './../../tools/shared-services/core.service';
import { Component, OnInit } from '@angular/core';
/* ---------------- Services ---------------- */
import { SidebarTriggerService } from './../../tools/shared-services/sidebar-trigger.service';
/* ------------------ Animation ------------------ */
import { trigger, animate, transition, style } from '@angular/animations';
import { fade } from './../../tools/shared_animations/fade';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
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
export class SideMenuComponent implements OnInit {
  /* ------------------- Variables ------------------- */
  showSideMenu: boolean = false;
  overLayShow: boolean = false;
  order_add: boolean = false;
  order_all: boolean = false;
  client_add: boolean = false;
  client_all: boolean = false;
  technician_add: boolean = false;
  technician_all: boolean = false;
  offer_add: boolean = false;
  offer_all: boolean = false;
  resource_add: boolean = false;
  resources_all: boolean = false;
  receipt_add: boolean = false;
  receipt_all: boolean = false;
  service_all: boolean = false;
  orders: any = [];
  clients: any = [];
  technicians: any = [];
  offers: any = [];
  resoureces: any = [];
  receipts: any = [];
  user: any = '';
  windowWidth = window.innerWidth;
  receipt: any = '';
  /* ------------------- Constructor ----------------------- */
  constructor(
    private sidebarTriggerService: SidebarTriggerService,
    private coreService: CoreService
  ) {
    this.coreService.getMethod('settings/actions').subscribe(data => {
      console.log('Receipt', data);
      if (data['data'][0]) {
        this.receipt = data['data'][0].receipt;
      }
    });
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log(this.user);
    this.orders = this.user.modules.orders;
    if (this.orders) {
      this.orders.map(ele => {
        switch (ele) {
          case 'create':
            this.order_add = true;
            break;
          case 'all':
            this.order_all = true;
            break;
        }
      });
    }
    this.clients = this.user.modules.clients;
    if (this.clients) {
      this.clients.map(ele => {
        switch (ele) {
          case 'create':
            this.client_add = true;
            break;
          case 'all':
            this.client_all = true;
            break;
        }
      });
    }
    this.technicians = this.user.modules.technicians;
    if (this.technicians) {
      this.technicians.map(ele => {
        switch (ele) {
          case 'create':
            this.technician_add = true;
            break;
          case 'all':
            this.technician_all = true;
            break;
        }
      });
    }
    this.offers = this.user.modules.offers;
    if (this.offers) {
      this.offers.map(ele => {
        switch (ele) {
          case 'create':
            this.offer_add = true;
            break;
          case 'all':
            this.offer_all = true;
            break;
        }
      });
    }
    this.resoureces = this.user.modules.resources;
    if (this.resoureces) {
      this.resoureces.map(ele => {
        switch (ele) {
          case 'create':
            this.resource_add = true;
            break;
          case 'all':
            this.resources_all = true;
            break;
        }
      });
    }
    this.receipts = this.user.modules.receipts;
    if (this.receipts) {
      this.receipts.map(ele => {
        switch (ele) {
          case 'create':
            this.receipt_add = true;
            break;
          case 'all':
            this.receipt_all = true;
            break;
        }
      });
    }
  }
  /* ---------------------- Oninit -------------------------- */
  ngOnInit() {
    /* ------------- Check Responsive ------------------- */
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
  /* ------------------- Overlay Sidebar ------------------------ */
  sidebarOverlayTrigger() {
    this.sidebarTriggerService.toggelSidemenu();
    this.sidebarTriggerService.toggelOverlay();
  }
  /* --------------- Carousal ---------------- */
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
