import { MessagingService } from './../../../tools/shared-services/messaging.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreService } from './../../../tools/shared-services/core.service';
import { LoaderService } from '../../../tools/shared-services/loader.service';
import { PaginationService } from './../../../tools/shared-services/pagination.service';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';
import { popup } from '../../../tools/shared_animations/popup';
import { fromEvent, Observable } from 'rxjs';
import {
  map,
  debounceTime,
  distinctUntilChanged,
  startWith
} from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss'],
  animations: [popup]
})
export class AllOrdersComponent implements OnInit {
  //
  // ─── START GENERAL DATA ──────────────────────────────────────────
  //
  invoideId;
  todayOrdersToggelChecked = false;
  hideme = [];
  showOrdercontrolst = false;

  pageLoaded = false;

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
  order_add: boolean = false;
  order_all: boolean = false;
  order_update: boolean = false;
  order_delete: boolean = false;
  orders: any = [];
  user: any = '';

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
    'service_date',
    'order_time',
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
  // todayFilltered = 0;
  todayFilltered;

  clearDate = '';
  techniciansArray = [];
  technicianId = '';
  countPerPage = [];
  i;
  statisticsRow = false;
  getOrdersResponseTotal;

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
  current_page = '';
  totalPage = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private router: Router,
    private paginationService: PaginationService,
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

  //
  // ─── START ONINIT ────────────────────────────────────────────────
  //

  ngOnInit() {
    this.startLoading();
    this.getOrderStatusTypes();
    this.getServicesWithTechnicians();
    this.todayOrdersPage();
    this.pageCountOptions();
    this.listenOrdersUpdates();
  }
  //
  // ─────────────────────────────────────────────────────────────── END ONINIT ─────
  //

  //
  // ─── START LISTEN FOR ORDERS UPDATES ────────────────────────────────────────────
  //

  listenOrdersUpdates() {
    this.messagingService.orderUpdatedNotification.subscribe(
      (orderUpdate: any) => {
        console.log(orderUpdate);
        if (orderUpdate.order_status === 'admin_approved') {
          this.startLoading();
          this.getAllOrders();
        } else {
          this.ordersArray.forEach(order => {
            if (order.id === +orderUpdate.id) {
              this.startLoading();
              this.getAllOrders();
            }
          });
        }
      }
    );
  }

  //
  // ──────────────────────────────────────────── END LISTEN FOR ORDERS UPDATES ─────
  //

  //
  // ─── START PAGE COUNT OPTIONS ───────────────────────────────────────────────────
  //

  pageCountOptions() {
    for (let option = 10; option <= 50; option += 10) {
      this.countPerPage.push(option);
    }
  }
  //
  // ─────────────────────────────────────────────────── END PAGE COUNT OPTIONS ─────
  //
  //
  // ─── START TODAY ORDERS PAGE ────────────────────────────────────────────────────
  //

  todayOrdersPage() {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.todayOrders) {
        this.todayOrdersToggelChecked = true;
        this.todayFilltered = 1;

        this.filterForm.controls.startDateFilter.disable();
        this.filterForm.controls.endDateFilter.disable();
        (document.getElementById('filterStartDate') as HTMLInputElement).value =
          '';
        this.filteredFromDate = '';
        this.filteredToDate = '';
      } else if (!queryParams.todayOrders) {
        this.todayFilltered = 0;
      }
      this.pageId = 1;
      this.getAllOrders();
    });
  }
  //
  // ───────────────────────────────────────────────────── END TODAY ORDER PAGE ─────
  //

  //
  // ─── FILTER NAME ────────────────────────────────────────────────────────────────
  //

  filterClientName() {
    const filterName = document.getElementById('filterName');
    const filterNameListner = fromEvent(filterName, 'keyup');
    filterNameListner
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        this.pageId = 1;
        this.filteredClientData = value;
        this.getAllOrders();
      });
  }
  //
  // ─────────────────────────────────────────────── FILTER NAME ─────
  //

  //
  // ─── START FILTER ORDER NUMBER ────────────────────────────────────────────────────────
  //

  filterOrderNumber() {
    const filterOrdernumber = document.getElementById('ordersNumberObj');
    const filterOrdernumberListner = fromEvent(filterOrdernumber, 'keyup');
    filterOrdernumberListner
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(200),
        distinctUntilChanged()
      )

      .subscribe((value: any) => {
        this.pageId = 1;
        this.filtersOrderNumberData = value;
        this.getAllOrders();
      });
  }

  //
  // ────────────────────────────────────────────────── END FILTER ORDER NUMBER ─────
  //

  //
  // ─── STRAT MULTIFILTER SEARCH ───────────────────────────────────────────────────
  //

  search(selectedData) {
    if (selectedData.type === this.filterStatusComponentId) {
      this.filterStatus = selectedData.data;
    } else if (selectedData.type === this.filterTechniciansComponentId) {
      this.filterTechnicians = selectedData.data;
    }
    this.getAllOrders();
  }

  //
  // ───────────────────────────────────────────── END STRAT MULTIFILTER SEARCH ─────
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
  // ─── START X RESET INPUTS ────────────────────────────────────────
  //

  xResetInputs(key) {
    if (key === 'filterName') {
      this.filterForm.patchValue({
        filteredClientData: '',
        filterName: ''
      });
      this.filteredClientData = '';
    } else if (key === 'startDateFilter') {
      this.filterForm.patchValue({ filteredFromDate: '', startDateFilter: '' });
      this.filteredFromDate = '';
    } else if (key === 'endDateFilter') {
      this.filterForm.patchValue({ filteredToDate: '', endDateFilter: '' });
      this.filteredToDate = '';
    } else if (key === 'ordersNumberObj') {
      this.filterForm.patchValue({
        filterOrdernumber: '',
        ordersNumberObj: ''
      });
      this.filtersOrderNumberData = '';
    }
    this.pageId = 1;
    this.getAllOrders();
  }
  //
  // ──────────────────────────────────────── END X RESET INPUTS ─────
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
  // ─── START TODAY FILLTER FUNCTION ────────────────────────────────
  //

  //
  // ─── START FILTER'S TODAY ORDERS ────────────────────────────────────────────────────────
  //

  todayDateFillterToggle(e) {
    this.todayFilltered = e.checked === true ? 1 : 0;
    if (this.todayFilltered === 1) {
      this.filterForm.controls.startDateFilter.disable();
      this.filterForm.controls.endDateFilter.disable();
      (document.getElementById('filterStartDate') as HTMLInputElement).value =
        '';
      this.filteredFromDate = '';
      this.filteredToDate = '';
    } else {
      this.filterForm.controls.startDateFilter.enable();
      this.filterForm.controls.endDateFilter.enable();
    }
    this.pageId = 1;
    this.getAllOrders();
  }

  //
  // ──────────────────────────────────────────────── END FILTER'S TODAY ORDERS ─────
  //

  //
  // ─── START GET ALL ORDERS ──────────────────────────────────────────
  //

  getAllOrders(...option) {
    let perPage;
    option.length > 0 ? (perPage = +option[0]) : (perPage = 10);
    this.loaderService.startLoading();
    this.coreService
      .getMethod('orders?page=' + this.pageId, {
        client: this.filteredClientData,
        from: this.filteredFromDate,
        to: this.filteredToDate,
        today: this.todayFilltered,
        'technician_ids[]': this.filterTechnicians,
        'statuses[]': this.filterStatus,
        order_id: this.filtersOrderNumberData,
        per_page: perPage
      })
      .subscribe((getOrdersResponse: any) => {
        // Start Assign Data
        this.ordersArray = getOrdersResponse.orders.data;
        this.getOrdersResponseTotal = getOrdersResponse.orders;
        this.current_page = getOrdersResponse.orders.current_page;
        this.totalPage = getOrdersResponse.orders.last_page;

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
  nextPage(pageNum) {
    this.pageId = +pageNum + 1;
    this.getAllOrders();
  }
  prevPage(pageNum) {
    this.pageId = +pageNum - 1;
    this.getAllOrders();
  }
  //
  // ──────────────────────────────────────── END GET ALL ORDERS ─────
  //

  //
  // ─── START FILTER ORDER DATE ────────────────────────────────────────────────────
  //

  orderDateChanged(event, type) {
    console.log(event);

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
