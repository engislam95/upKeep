import { Component, OnInit } from '@angular/core';
import { CoreService } from './../../../tools/shared-services/core.service';
import { WebSocketService } from '../../../tools/shared-services/web-socket.service' ;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  /* ------------------- Variables ---------------------- */
  clientsCount: any = '';
  offersCount: any = '';
  postponedCount: any = '';
  receiptedCount: any = '';
  stoppedCount: any = '';
  todayCount: any = '';
  user: any = '';
  orders: any = [];
  clients: any = [];
  technicians: any = [];
  offers: any = [];
  resoureces: any = [];
  receipts: any = [];
  services: any = [];
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
  /* ------------------ Constructor ----------------------- */
  constructor(private coreService: CoreService , private WebSocketService : WebSocketService) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.user);
    if(this.user) {
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
    this.services = this.user.modules.services;
    if (this.services) {
      this.services.map(ele => {
        switch (ele) {
          case 'all':
            this.service_all = true;
            break;
        }
      });
    }
  }


    if(localStorage.getItem('currentUser') && JSON.parse(localStorage.getItem('currentUser')).privilege != 'owner' )
    {

     this.WebSocketService.listenChannel('company.' + this.user.id)


    }

  }
  /* ------------------------- Oninit ------------------------- */
  ngOnInit() {
    this.getCounts();
  }
  /* ---------------------- Get Counts ----------------------- */
  getCounts() {
    this.coreService.getMethod('dashboard', {}).subscribe((dashboard: any) => {
      this.clientsCount = dashboard.data.clients_count;
      this.offersCount = dashboard.data.offers_count;
      this.postponedCount = dashboard.data.postponed_count;
      this.receiptedCount = dashboard.data.receipted_count;
      this.stoppedCount = dashboard.data.stopped_count;
      this.todayCount = dashboard.data.today_count;
    });
  }
}
