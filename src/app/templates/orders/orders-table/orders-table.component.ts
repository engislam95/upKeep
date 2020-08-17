import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { CoreService } from './../../../tools/shared-services/core.service';
import { LoaderService } from './../../../tools/shared-services/loader.service';
import { fadeBottomTop } from './../../../tools/shared_animations/fade-bottom-top';
import { MessagingService } from '../../../tools/shared-services/messaging.service';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss'],
  animations: [fadeBottomTop]
})
export class OrdersTableComponent implements OnInit {
  //  ############################# Start General data #############################
  dayStart = 0;
  dayEnd = 23;
  order_add: boolean = false;
  order_all: boolean = false;
  order_update: boolean = false;
  order_delete: boolean = false;
  orders: any = [];
  user: any = '';

  // dayStart = 9;
  // dayEnd = 22;
  dayHoursArray = [];
  pageLoaded = false;
  todayDate = new FormControl(new Date());
  orderDate;
  darkTheme = {
    container: {
      bodyBackgroundColor: '#424242',
      buttonColor: '#fff'
    },
    dial: {
      dialBackgroundColor: '#555'
    },
    clockFace: {
      clockFaceBackgroundColor: '#555',
      clockHandColor: '#f6a811',
      clockFaceTimeInactiveColor: '#fff'
    }
  };

  orderTechnicians = [];
  //  ############################# Start General data #############################

  //
  // ─── START MULTIPLE SELECT FILTER ─────────────────
  //

  servicesWithTechniciansList = [];
  techniciansFilterPlaceholder = 'إسم الفني او الخدمة';
  nestedType = 'nested';
  filterTechniciansComponentId = 'filterTechnicians';
  filteredTechniciansIds = []; // filtered ids

  //
  // ─────────────────────────────────────────────── END MULTIPLE SELECT FILTER ─────
  //

  //  ############################# Start Time Table data #############################
  loopCellWidth;
  @ViewChild('loopContainer') loopContainer: ElementRef;
  hideme = [];
  minutes = [];
  hours = [];
  start: any = '';
  end: any = '';
  //  ############################# End Time Table #############################
  constructor(
    private cdr: ChangeDetectorRef,
    private loaderService: LoaderService,
    private coreService: CoreService,
    private messagingService: MessagingService
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.user);
    this.orders = this.user.modules.orders;
    if (this.orders) {
      this.orders.map(ele => {
        switch (ele) {
          case 'create':
            this.order_add = true;
            break;
          case 'show':
            this.order_all = true;
            break;
          case 'update':
            this.order_update = true;
            break;
          case 'delete':
            this.order_delete = true;
            break;
        }
      });
    }
  }

  //  ############################# Start OnInit #############################
  ngOnInit() {
    window.scroll({ top: 0, behavior: 'auto' });
    // Start START Loading
    this.startLoading();
    // End START Loading
    //  ############################## End Create Time Data Array ##############################
    this.generateTime();
    //  ############################## End Create Time Data Array ##############################
    // Start Init Hours <th> For Technicians Table
    this.initTechniciansTableHours();
    this.getServicesWithTechnicians();
    // End Init Hours <th> For Technicians Table
    let todayDate;
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    todayDate = year + '/' + month + '/' + day;
    this.orderDateChanged(todayDate, 'init');
    this.listenOrdersUpdates();
  }
  //  ############################# End OnInit #############################

  //
  // ─── START LISTEN FOR ORDERS UPDATES ────────────────────────────────────────────
  //

  listenOrdersUpdates() {
    this.messagingService.orderUpdatedNotification.subscribe(
      (orderUpdate: any) => {
        this.startLoading();
        this.getOrderTechnicians();
      }
    );
  }

  //
  // ──────────────────────────────────────────── END LISTEN FOR ORDERS UPDATES ─────
  //

  //
  // ─── START SEARCH WITH MULTISELECT FILTER ───────────────────────────────────────
  //

  search(selectedData) {
    if (selectedData.type === this.filterTechniciansComponentId) {
      this.filteredTechniciansIds = selectedData.data;
    }
    this.getOrderTechnicians();
  }

  //
  // ───────────────────────────────────── START SEARCH WITH MULTISELECT FILTER ─────
  //

  //
  // ─── START GET SERVICES WITH TECHNICIANS ────────────────────────────────────────
  //

  getServicesWithTechnicians() {
    let servicesWithTechnicians = [];
    this.coreService
      .getMethod('services/active', { with_technicians: 1 })
      .subscribe((servicesWithTechniciansResponse: any) => {
        servicesWithTechnicians = servicesWithTechniciansResponse.data;
        servicesWithTechnicians = servicesWithTechnicians.map(service => {
          return (service = {
            ...service,
            checked: false,
            technicians: service.technicians.map(technical => {
              return (technical = {
                ...technical,
                parentId: service.id,
                checked: false
              });
            })
          });
        });
        this.servicesWithTechniciansList = servicesWithTechnicians;
      });
  }

  //
  // ──────────────────────────────────────── END GET SERVICES WITH TECHNICIANS ─────
  //

  //  ######################### Start Filter Order Date #########################
  orderDateChanged(event, ...mode) {
    let orderDateArray;
    let orderDate;
    if (mode[0] === 'init') {
      orderDate = event;
    } else {
      orderDateArray = event.targetElement.value.split('/');
      orderDate =
        orderDateArray[2] + '/' + orderDateArray[0] + '/' + orderDateArray[1];
    }
    this.orderDate = orderDate;
    this.getOrderTechnicians();
  }
  //  ######################### End Filter Order Date #########################

  //  ######################### Start Get Order Technicians #########################
  getOrderTechnicians() {
    // Start START Loading
    this.startLoading();
    // End START Loading
    // Get Technicians
    this.coreService
      .getMethod('orders/technicians', {
        working_orders: 1,
        'ids[]': this.filteredTechniciansIds,
        order_date: this.orderDate
      })
      .subscribe((orderTechnicians: any) => {
        this.orderTechnicians = orderTechnicians.data;
        console.log(this.orderTechnicians);

        setTimeout(() => {
          this.loopCellWidth = this.loopContainer.nativeElement.offsetWidth;
          this.cdr.detectChanges();
          // Start End Loading
          this.endLoading();
          // End End Loading
        }, 500);
      });
    // Get Technicians
  }
  //  ######################### End Get Order Technicians #########################
  //  ########################### Start Init Techncians Table Hours ###########################
  initTechniciansTableHours() {
    let dayStart = this.dayStart - 1;
    for (let i = 1; i <= this.dayEnd - this.dayStart + 1; i++) {
      this.dayHoursArray.push(dayStart + 1);
      dayStart++;
    }
  }

  //  ########################### Start Init Techncians Table Hours ###########################
  //  ############################ Start Generate Hours Functions ############################
  generateTime() {
    for (let index = 1; index <= 60; index++) {
      this.minutes.push(index);
    }
    for (let index = this.dayStart; index <= this.dayEnd; index++) {
      this.hours.push(index);
    }
  }
  //  ############################ End Generate Hours Functions ############################
  //  ############################ Start Loading Functions ############################
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
    if (true) {
      this.pageLoaded = true;
      this.loaderService.endLoading();
    }
  }
  //  ############################ End Loading Functions ############################
}
