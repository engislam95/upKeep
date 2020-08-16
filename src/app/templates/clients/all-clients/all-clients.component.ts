import { Component, OnInit } from '@angular/core';

import { CoreService } from './../../../tools/shared-services/core.service';
import { LoaderService } from '../../../tools/shared-services/loader.service';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';
import { popup } from '../../../tools/shared_animations/popup';
import { PaginationService } from './../../../tools/shared-services/pagination.service';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-all-clients',
  templateUrl: './all-clients.component.html',
  styleUrls: ['./all-clients.component.scss'],
  animations: [popup]
})
export class AllClientsComponent implements OnInit {
  //
  // ─── START GENERAL DATA ──────────────────────────────────────────
  //
  showOrdercontrolst = false;
  hideme = [];
  pageLoaded = false;
  responseState;
  responseData;
  countPerPage = [];
  totalSize;

  //
  deletedClientName: string;
  deletedClientId: number;
  showDeletePopup = false;
  //
  updatedTechnicalName: string;
  updatedTechnicalId: number;
  showUpdatePopup = false;
  //  Filter Data
  filteredClientData = '';
  clientStatusArray = [];

  filteredFromDate = '';
  filteredToDate = '';
  clientWayArray = [];
  clientConditionArray = [];

  selectedTypeId = '';
  selectedWayId = null;
  selectedCity = null;
  clientCondition: number;
  clientStatusId = '';
  citiesArray = [];
  cityId = '';
  per_page: any = 10;

  //  Filter Data

  //
  // ────────────────────────────────────────── END GENERAL DATA ─────
  //

  filterForm = new FormGroup({
    filterName: new FormControl(),
    startDateFilter: new FormControl(),
    endDateFilter: new FormControl()
  });
  //
  // ─── START TABLE DATA ─────────────────────────────────────────────────────────────────
  //

  displayedColumns = [
    //
    'ID',
    'client_name',
    'phone',
    // 'edit_order',
    'kind_client',
    'handling_way',
    'order_number',
    'date_registration',
    'date_last_request',
    'status',
    'clients_details'
    // 'delete_order'
  ];
  dataSource = [];
  pagesNumbers = [];
  pageId = 1; // number
  firstPage; // any
  lastPage;
  //
  // ─────────────────────────────────────────────────────────────── END TABLE DATA ─────
  //
  current_page: any = '';
  totalPage: any = '';

  constructor(
    //
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private paginationService: PaginationService
  ) {
    this.clientCondition = 1;
  }

  //
  // ─── START ONINIT ────────────────────────────────────────────────
  //

  ngOnInit() {
    // Start START Loading
    this.startLoading();
    // End START Loading
    // Start Get All Clients
    this.pageCountOptions();
    this.getAllClients(this.pageId);
    this.getClientTypes();
    this.getClientWays();
    this.getCities();
    this.getConditions();
    // End Get All Clients

    //
    // ─── START FILTERS ───────────────────────────────────────────────
    //

    // Start Filter Name
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
        this.getAllClients(this.pageId);
      });
    // End Filter Name

    // Start Filter clint type
    const client_type = document.getElementById('client_type');
    const filterClientListner = fromEvent(client_type, 'keyup');
    filterClientListner
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        this.pageId = 1;
        this.filteredClientData = value;
        this.getAllClients(this.pageId);
      });
    // End Filter clint type

    //
    // ─────────────────────────────────────────────── END FILTERS ─────
    //
  }

  // get client type

  getClientTypes() {
    this.coreService
      .getMethod('lookup/client-status')
      .subscribe((getClientsResponse: any) => {
        console.log(getClientsResponse);
        this.clientStatusArray = getClientsResponse.data;

        // this.clientStatusArray = getClientsResponse;
        //  End Pagination Count
      });
  }

  selectStatus(ev) {
    console.log(ev);
    this.clientStatusId = ev;
    console.log(this.clientStatusId);
    this.getAllClients(1);
  }

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
    this.getAllClients(this.pageId);
  }

  getClientWays() {
    this.coreService
      .getMethod('lookup/client-types')
      .subscribe((getClientsResponse: any) => {
        console.log(getClientsResponse);
        this.clientWayArray = getClientsResponse.data;

        console.log(this.clientWayArray);

        // this.clientStatusArray = getClientsResponse;
        //  End Pagination Count
      });
  }

  getCities() {
    this.coreService.getMethod('cities', {}).subscribe((cities: any) => {
      this.endLoading();
      console.log(cities);
      this.citiesArray = cities.data;
      console.log(this.citiesArray);
    });
  }

  getConditions() {
    console.log(this.clientCondition);

    this.clientCondition = 1;
    console.log(this.clientCondition);
    this.clientConditionArray = ['نشط', 'غير نشط'];
    this.getAllClients(1);
  }

  selectCity(ev) {
    this.cityId = ev;
    this.getAllClients(1);
  }

  selectWay(ev) {
    console.log(ev);
    this.selectedTypeId = ev;
    this.getAllClients(1);
  }

  selectCondition(ev) {
    console.log(ev);
    if (ev == 'نشط') {
      this.clientCondition = 1;
    } else {
      this.clientCondition = 0;
    }

    this.getAllClients(1);
  }

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
    }

    if (key == 'startDateFilter') {
      this.filterForm.patchValue({ startDateFilter: '' });
      this.filteredFromDate = '';
    }

    if (key == 'endDateFilter') {
      this.filterForm.patchValue({ endDateFilter: '' });
      this.filteredToDate = '';
    }

    this.getAllClients(this.pageId);
  }

  //
  // ──────────────────────────────────────── END X RESET INPUTS ─────
  //

  //
  // ─── START GET ALL CLIENTS ───────────────────────────────────────
  //

  getAllClients(pageId) {
    // let perPage;
    // console.log(option);

    // option.length > 0 ? (perPage = +option[0]) : (perPage = 10);
    this.loaderService.startLoading();
    this.coreService
      .getMethod('clients?page=' + pageId, {
        name: this.filteredClientData,
        client_type: this.selectedTypeId, // طريقة التعاقد
        status: this.clientStatusId, // نوع العميل
        registration_from: this.filteredFromDate,
        registration_to: this.filteredToDate,
        active: this.clientCondition,
        city_id: this.cityId,
        per_page: this.per_page
      })
      .subscribe((getClientsResponse: any) => {
        // Start Assign Data
        this.dataSource = getClientsResponse.data.data;
        console.log(getClientsResponse);
        this.totalSize = getClientsResponse.data.total;
        this.current_page = getClientsResponse.data.current_page;
        this.totalPage = getClientsResponse.data.last_page;
        if (this.dataSource.length === 0 && this.pageId === 1) {
          // empty data array
        }
        if (this.dataSource.length === 0 && this.pageId > 1) {
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
          getClientsResponse.data.total,
          getClientsResponse.data.per_page
        );
        //  End Pagination Count
      });
  }
  nextPage(pageNum) {
    this.getAllClients(+pageNum + 1);
  }
  prevPage(pageNum) {
    this.getAllClients(+pageNum - 1);
  }
  //
  // ─────────────────────────────────────── END GET ALL CLIENTS ─────
  //

  //
  // ─── START DELETE CLIENT ─────────────────────────────────────────
  //

  openDeletePopup(id, name) {
    name === undefined
      ? (this.deletedClientName = '')
      : (this.deletedClientName = name);

    this.deletedClientId = id;
    this.showDeletePopup = true;
  }
  deleteClient() {
    this.closePopup();
    this.startLoading();
    this.coreService.deleteMethod('clients/' + this.deletedClientId).subscribe(
      () => {
        this.showSuccess();
        this.getAllClients(this.pageId);
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
  }

  //
  // ────────────────────────────────────── END DELETE TECHNICAL ─────
  //

  //
  // ─── START PAGINATION ────────────────────────────────────────────
  //

  pagination(totalClientsNumber, clientsPerPage) {
    this.pagesNumbers = [];
    const totalPages = Math.ceil(totalClientsNumber / clientsPerPage);
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
      this.getAllClients(this.pageId);
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

  /* ------------------ Set Count Per Page -------------------------- */
  setCountPerPage(option) {
    this.startLoading();
    this.pageId = 1;
    this.per_page = option;
    this.getAllClients(this.pageId);
    this.endLoading();
  }

  pageCountOptions() {
    for (let option = 10; option <= 50; option += 10) {
      this.countPerPage.push(option);
    }
  }

  //
  // ────────────────────────── END CHECK FOR PAGINATION BUTTONS ─────
  //

  //
  // ─── START LOADING FUNCTIONS ─────────────────────────────────────
  //

  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
  }

  //
  // ───────────────────────────────────── END LOADING FUNCTIONS ─────
  //

  //
  // ─── START RESPONSE MESSEGES ─────────────────────────────────────
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
    this.responseData = 'تم حذف العميل بنجاح';
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }

  //
  // ───────────────────────────────────── END RESPONSE MESSEGES ─────
  //
}
