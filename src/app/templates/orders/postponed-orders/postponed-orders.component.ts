import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreService } from './../../../tools/shared-services/core.service';
import { LoaderService } from '../../../tools/shared-services/loader.service';
import { PaginationService } from './../../../tools/shared-services/pagination.service';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';

import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-postponed-orders',
  templateUrl: './postponed-orders.component.html',
  styleUrls: ['./postponed-orders.component.scss']
})
export class PostponedOrdersComponent implements OnInit {
  //
  // ─── START GENERAL DATA ──────────────────────────────────────────
  //
  invoideId;
  getOrdersResponseTotal;
  hideme = [];
  showOrdercontrolst = false;

  pageLoaded = false;
  ordersResponseTotal;
  order_add: boolean = false;
  order_all: boolean = false;
  order_update: boolean = false;
  order_delete: boolean = false;
  orders: any = [];
  user: any = '';

  responseState;
  responseData;

  deletedOrderClientName: string;
  deletedOrderId: number;
  showDeletePopup = false;
  showDetailsPopup = false;
  orderObj;
  updatedTechnicalName: string;
  updatedTechnicalId: number;
  showUpdatePopup = false;
  statisticsRow = false;
  filteredStatusId;

  //
  // ────────────────────────────────────────── END GENERAL DATA ─────
  //

  //
  // ─── START TABLE DATA ─────────────────────────────────────────────────────────────────
  //

  displayedColumns = [
    'ID',
    'client_name',
    'technical_name',
    'main_service',
    'order_time',
    'service_date',
    'order_status',
    'order_resource',
    'order_details'
  ];
  ordersArray = [];
  getOrderNumber;
  pagesNumbers = [];
  pageId = 1;
  firstPage;
  lastPage;

  //
  // ──────────────────────────────────────────────── END TABLE DATA ─────
  //

  //
  // ─── START FILTER DATA ────────────────────────────────────────────────────────────────
  //

  filteredClientData = '';
  filteredFromDate = '';
  filteredToDate = '';
  filteredTechnicians = '';
  filtersOrderNumberData = '';
  filterOrdernumber = '';

  //
  // ────────────────────────────────────────────────────────────── END FILTER DATA ─────
  //

  //
  // ─── START SELECT STATUS ─────────────────────────────────────────
  //

  filterForm = new FormGroup({
    startDateFilter: new FormControl(),
    endDateFilter: new FormControl(),
    filterName: new FormControl(),
    ordersNumberObj: new FormControl()
  });

  statusArray = [];
  todayFilltered = 0;
  clearDate = '';
  techniciansArray = [];
  technicianId = '';
  countPerPage = [];
  i;

  //
  // ───────────────────────────────────────── END SELECT STATUS ─────
  //

  //
  // ─── START MULTIPLE SELECT FILTER ─────────────────
  //

  servicesWithTechniciansList = [];
  techniciansFilterPlaceholder = 'إسم الفني او الخدمة';
  orderStatusFilterPlaceholder = 'حالة الطلب';
  nestedType = 'nested';
  filterTechniciansComponentId = 'filterTechnicians';
  filterTechnicians = []; // filtered ids
  filterStatusComponentId = 'filterStatus';
  filterStatus = []; // filtered ids

  //
  // ── END MULTIPLE SELECT FILTER ─────
  //

  constructor(
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private router: Router,
    private paginationService: PaginationService
  ) {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log(this.user);
    this.orders = this.user.modules.orders;
    if (this.orders) {
      this.orders.map(ele => {
        switch (ele) {
          case 'create': this.order_add = true;
            break;
          case 'show': this.order_all = true;
            break;
          case 'update': this.order_update = true;
            break;
          case 'delete': this.order_delete = true;
            break;
        }
      });
    }
  }

  //
  // ─── START ONINIT ────────────────────────────────────────────────
  //

  ngOnInit() {
    this.startLoading();
    this.getOrderStatusTypes();
    this.getAllOrders();
    this.getServicesWithTechnicians();

    //
    // ───START NOMBER OF ORDERS IN ON PAGE ─────────────────────────────────
    //

    for (let option = 10; option <= 50; option += 10) {
      this.countPerPage.push(option);
    }

    //
    // ──────────────────────────────────────────────END NOMBER OF ORDERS IN ON PAGE ─────
    //
  }
  search(selectedData) {
    if (selectedData.type === this.filterStatusComponentId) {
      this.filterStatus = selectedData.data;
    } else if (selectedData.type === this.filterTechniciansComponentId) {
      this.filterTechnicians = selectedData.data;
    }
    this.getAllOrders();
  }
  //
  // ─────────────────────────────────────────────────────────────── END ONINIT ─────
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

  //
  // ──────────────────────────────────────────────────────────────── I ──────────
  //   :::::: D O N E   S E C T I O N : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────────────
  //

  //
  // ─── START PAGINATION OPTION ────────────────────────────────────────────────────
  //

  setCountPerPage(option) {
    // Start START Loading
    this.startLoading();
    // End START Loading
    this.pageId = 1;
    this.getAllOrders(option);
    // End Select
    this.endLoading();
    // End END Loading
  }

  //
  // ──────────────────────────────────────────────────── END PAGINATION OPTION ─────
  //

  //
  // ─────────────────────────────────────────────────────────────── END ONINIT ─────
  //

  //
  // ─────────────────────────────────────────────────────── START CHECKBOX ON CHANGE ─────
  //

  checkBoxOnChange(e) {
    if (e.checked) {
      this.statisticsRow = true;
    } else {
      this.statisticsRow = false;
    }
  }

  //
  // ─────────────────────────────────────────────────── END CHECKBOX ON CHANGE ─────
  //

  //
  // ─── START GET ALL ORDERS ──────────────────────────────────────────
  //

  getAllOrders(...option) {
    let perPage;
    let suspendedStatus = 29;
    option.length > 0 ? (perPage = +option[0]) : (perPage = 10);
    this.loaderService.startLoading();
    this.coreService
      .getMethod('orders?page=' + this.pageId, {
        'statuses[]': suspendedStatus,

        per_page: perPage
      })
      .subscribe((getOrdersResponse: any) => {
        // Start Assign Data
        this.getOrdersResponseTotal = getOrdersResponse.orders;
        this.ordersArray = getOrdersResponse.orders.data;

        /*

filter(
          suspendedOrder => {
            return suspendedOrder.status.id === 42;
          }
        );

        */

        this.getOrderNumber = getOrdersResponse.totals;

        if (this.ordersArray.length === 0 && this.pageId === 1) {
          // empty data array
        }
        if (this.ordersArray.length === 0 && this.pageId > 1) {
          // last page
          this.pageId -= 1;
          this.pagesNumbers.splice(-1);
          this.goPage(this.pageId);
        }
        // Start Assign Data
        // Start END Loading
        this.endLoading();
        // End END Loading
        //  Start Pagination Count
        this.pagination(
          getOrdersResponse.orders.total,
          getOrdersResponse.orders.per_page
        );
        //  End Pagination Count
      });
  }
  //
  // ──────────────────────────────────────── END GET ALL ORDERS ─────
  //

  //
  // ─── START FILTER ORDER DATE ────────────────────────────────────────────────────
  //

  orderDateChanged(event, type) {
    let orderDateArray;
    let orderDate;
    orderDateArray = event.targetElement.value.split('/');
    orderDate =
      orderDateArray[2] + '/' + orderDateArray[0] + '/' + orderDateArray[1];
    this.pageId = 1;
    type === 'from'
      ? (this.filteredFromDate = orderDate)
      : (this.filteredToDate = orderDate);
    this.getAllOrders();
  }
  //
  // ──────────────────────────────────────────────────── END FILTER ORDER DATE ─────
  //

  //
  // ─── START GET ORDER STATUS TYPES ───────────────────────────────────────────────
  //

  getOrderStatusTypes() {
    this.coreService
      .getMethod('lookup/order-status-types', {})
      .subscribe((statusTypes: any) => {
        this.statusArray = statusTypes.data;
        this.filterStatus = statusTypes.data.id;
        // Start END Loading
        this.endLoading();
        // End END Loading
      });
  }

  //
  // ─── END GET ORDER STATUS TYPES ───────────────────────────────────────────────
  //

  //
  // ─── START DISPLAY OPTIONS FOR SELECT ───────────────────────────────────────────
  //

  displayOptionsFunction(state) {
    if (state !== null) {
      return state.name;
    }
  }

  //
  // ─────────────────────────────────────────── END DISPLAY OPTIONS FOR SELECT ─────
  //

  //
  // ─── START GO TO ORDER DETAILS ──────────────────────────────────────────────────
  //

  goToOrderDetails() {
    this.router.navigate(['/orders/order-details'], {
      queryParams: { orderId: this.orderObj.id }
    });
  }

  //
  // ──────────────────────────────────────────────── END GO TO ORDER DETAILS ─────
  //

  //
  // ─── START GET INVOICE DETA ─────────────────────────────────────────────────────
  //

  getInvoiceDetails() {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.invoideId = queryParams.incoiveID;
      this.coreService
        .getMethod('receipts/' + this.invoideId, {})
        .subscribe((getInvoiceDetails: any) => {
          this.endLoading();
        });
    });
  }

  //
  // ────────────────────────────────────────────────── END GET INVOICE DETAILS ─────
  //

  //
  // ─── START PAGINATION ────────────────────────────────────────────
  //

  pagination(totalOrdersNumber, ordersPerPAge) {
    this.pagesNumbers = [];
    const totalPages = Math.ceil(totalOrdersNumber / ordersPerPAge);
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      this.pagesNumbers.push(pageNumber);
    }
    this.checkPagination(this.pageId);
  }

  //
  // ──────────────────────────────────────────── END PAGINATION ─────
  //

  //
  // ─── START GO PAGE ───────────────────────────────────────────────
  //

  goPage(i) {
    if (i >= 1 && i <= this.pagesNumbers.length) {
      this.pageId = i;
      this.checkPagination(i);
      // Start START Loading
      this.startLoading();
      // End START Loading
      this.getAllOrders();
    }
  }

  //
  // ─────────────────────────────────────────────── END GO PAGE ─────
  //

  //
  // ─── START CHECK FOR PAGINATION BUTTONS ──────────────────────────
  //

  checkPagination(pageId) {
    const [firstPage, lastPage] = this.paginationService.checkPaginationButtons(
      pageId,
      this.pagesNumbers.length
    );
    this.firstPage = firstPage;
    this.lastPage = lastPage;
  }

  //
  // ────────────────────────── END CHECK FOR PAGINATION BUTTONS ─────
  //

  //
  // ─── START DELETE TECHNICAL ──────────────────────────────────────
  //

  openDeletePopup(id, name) {
    this.deletedOrderClientName = name;
    this.deletedOrderId = id;
    this.showDeletePopup = true;
  }
  deleteTechnical() {
    this.closePopup();
    this.startLoading();
    this.coreService.deleteMethod('orders/' + this.deletedOrderId).subscribe(
      () => {
        this.showSuccess();
        this.getAllOrders();
      },
      error => {
        if (error.error.errors) {
          this.showErrors(error.error.errors);
        } else {
          this.showErrors(error.error.message);
        }
      }
    );
  }
  closePopup() {
    this.showDeletePopup = false;
    this.showDetailsPopup = false;
  }

  //
  // ────────────────────────────────────── END DELETE TECHNICAL ─────
  //

  //
  // ─── START LOADING FUNCTIONS ────────────────────────────────────────────────────
  //

  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  endLoading() {
    if (this.ordersArray && this.statusArray) {
      this.pageLoaded = true;
      this.loaderService.endLoading();
    }
  }

  //
  // ──────────────────────────────────────────────────── END LOADING FUNCTIONS ─────
  //

  //
  // ─── START RESPONSE MESSEGES ────────────────────────────────────────────────────
  //

  showErrors(errors) {
    this.endLoading();
    this.responseState = 'error';
    this.responseData = errors;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  showSuccess() {
    this.endLoading();
    this.responseState = 'success';
    this.responseData = 'تم حذف الطلب بنجاح';
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }

  //
  // ──────────────────────────────────────────────────── END RESPONSE MESSEGES ─────
  //
}
