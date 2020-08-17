import { MessagingService } from './../../../tools/shared-services/messaging.service';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatInput } from '@angular/material';
@Component({
  selector: 'app-all-companies',
  templateUrl: './all-companies.component.html',
  styleUrls: ['./all-companies.component.scss'],
  animations: [popup]
})
export class AllCompaniesComponent implements OnInit {
  /* --------------------------- Variables ------------------------ */
  hideme: any = [];
  showOrdercontrolst: boolean = false;
  showFilter: boolean = false;
  filterCompaniesData = '';
  pageLoaded: boolean = false;
  responseState: any = '';
  responseData: any = '';
  deletedCompaniesName: string = '';
  deletedCompaniesID: any = '';
  showDeletePopup: boolean = false;
  orderDate: any = '';
  orderDate2: any = '';
  updateCompanyID: number;
  displayedColumns = [
    'ID',
    'company_name',
    'category',
    'contract_start',
    'contract_end',
    'country_city',
    'owner_status',
    'contact_number',
    'owner_details'
  ];
  dataSource: any = [];
  pagesNumbers: any = [];
  countPerPage: any = [];
  pageId: any = 1;
  firstPage: any;
  lastPage: any;
  user: any = '';
  statusArray = [{ name: 'نشط', id: 1 }, { name: 'غير نشط', id: 0 }];
  statusFilteredOptions: Observable<any>;
  filteredStatusId: any = '';
  classificationArray: any = [];
  roleFilteredOptions: Observable<any>;
  filterServiceID: any = '';
  serviceFilteredOptions: Observable<any>;
  citiesFilteredOptions: Observable<any>;
  filterMainServiceID: any = '';
  servicesArray: any = [];
  citiesArray: any = [];
  deletedUserName: any = '';
  deletedUserID: any = '';
  per_page: any = 10;
  city_id: any = '';
  counts: any = '';
  /* ---------------------- Filter Form ------------------------ */
  filterForm = new FormGroup({
    filterName: new FormControl(),
    filterCompaniesData: new FormControl(),
    userStatus: new FormControl(),
    usedService: new FormControl(),
    order_date: new FormControl(''),
    order_date2: new FormControl(''),
    usedMainService: new FormControl(),
    startDate: new FormControl(),
    city_id: new FormControl()
  });
  @ViewChild('fromInput', {
    read: MatInput
  })
  fromInput: MatInput;

  @ViewChild('toInput', {
    read: MatInput
  })
  toInput: MatInput;
  /* ----------------------- Constructor ----------------------- */
  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private paginationService: PaginationService
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    /*-------------------------- Count ---------------------------- */
    this.coreService.superGet('owner/company/counts').subscribe(counts => {
      console.log(counts);
      this.counts = counts['data'];
    });
    /* --------------------- Get Classifications ------------------------- */
    this.coreService
      .superGet('owner/classification/all')
      .subscribe(classification => {
        console.log(classification);
        this.classificationArray = classification;
        this.roleFilteredOptions = this.filterForm
          .get('usedService')
          .valueChanges.pipe(
            startWith(''),
            map(value => this.filterService(value))
          );
      });
    /* --------------------- Get Moin Services ------------------------- */
    this.coreService.superGet('owner/services').subscribe(classification => {
      this.startLoading();
      console.log(classification);
      this.servicesArray = classification['data'];
      this.endLoading();
      this.serviceFilteredOptions = this.filterForm
        .get('usedMainService')
        .valueChanges.pipe(
          startWith(''),
          map(value => this.filterMainService(value))
        );
    });
    // Filter Cities
    this.coreService
      .getMethod('countries/191/cities', {})
      .subscribe((cities: any) => {
        console.log(cities);
        this.citiesArray = cities.data;
      });
    setTimeout(() => {
      this.citiesFilteredOptions = this.filterForm
        .get('city_id')
        .valueChanges.pipe(
          startWith(''),
          map(value => this.filterCities(value))
        );
    }, 2000);
  }
  /*----------------------- Service Filter ----------------------- */
  filterMainService(value: any) {
    if (typeof value === 'object') {
      this.filterMainServiceID = value.id;
      this.pageId = 1;
      this.getAllData(this.pageId);
    }
    if (value === '') {
      this.filterMainServiceID = '';
      this.pageId = 1;
      this.getAllData(this.pageId);
    }
    return this.servicesArray.filter(option => option.name.includes(value));
  }
  /* ------------------------------ Filter Cities ------------------------ */
  filterCities(value: any) {
    if (typeof value == 'object') {
      this.city_id = value.id;
      this.pageId = 1;
      this.getAllData(this.pageId);
    } else if (typeof value == 'string') {
      const val = value.toLowerCase().trim();
      if (this.citiesArray !== null) {
        this.pageId = 1;
        this.getAllData(this.pageId);
      }
    }
    if (value === '') {
      this.city_id = '';
      this.pageId = 1;
      this.getAllData(this.pageId);
    }
    return this.citiesArray.filter(option =>
      option.name.toLowerCase().includes(value)
    );
  }
  /*----------------------- Service Filter ----------------------- */
  filterService(value: any) {
    if (typeof value === 'object') {
      this.filterServiceID = value.id;
      this.pageId = 1;
      this.getAllData(this.pageId);
    }
    if (value === '') {
      this.filterServiceID = '';
      this.pageId = 1;
      this.getAllData(this.pageId);
    }
    return this.classificationArray.filter(option =>
      option.name.includes(value)
    );
  }
  /* --------------------- Show Filter Inputs ------------------------ */
  showFilterInputs(event) {
    console.log(event);
    const filterName = document.getElementById('forms');
    if (event.checked == true) {
      this.showFilter = true;
      filterName.style.display = 'flex';
    } else if (event.checked == false) {
      this.showFilter = false;
      filterName.style.display = 'none';
    }
  }
  /* ----------------------- Oninit -------------------------------- */
  ngOnInit() {
    this.startLoading();
    this.getAllData(this.pageId);
    this.pageCountOptions();
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
        this.filterCompaniesData = value;
        this.getAllData(this.pageId);
      });
    /* ----------------------- Filter Status --------------------- */
    this.statusFilteredOptions = this.filterForm
      .get('userStatus')
      .valueChanges.pipe(
        startWith(''),
        map(value => this.filterUsersStatus(value))
      );
  }
  /* ------------------- Filter Status ------------------- */
  filterUsersStatus(value: any) {
    if (typeof value === 'object') {
      this.filteredStatusId = value.id;
      this.pageId = 1;
      this.getAllData(this.pageId);
    }
    if (value === '') {
      this.filteredStatusId = '';
      this.pageId = 1;
      this.getAllData(this.pageId);
    }
    return this.statusArray.filter(option => option.name.includes(value));
  }
  /* ---------------------- Get Count ------------------------------ */
  pageCountOptions() {
    for (let option = 10; option <= 50; option += 10) {
      this.countPerPage.push(option);
    }
  }
  /* ------------------------ Display Option ----------------------------- */
  displayOptionsFunction(state) {
    if (state !== null) {
      return state.name;
    }
  }
  /* --------------------------- Reset Value ---------------------------- */
  xResetInputs(key) {
    if (key === 'filterName') {
      this.filterForm.patchValue({
        filterCompaniesData: '',
        filterName: ''
      });
      this.filterCompaniesData = '';
    } else if (key === 'techniciansStatusObj') {
      this.filterForm.patchValue({
        filteredStatusId: '',
        techniciansStatusObj: ''
      });
    } else if (key === 'order_date') {
      this.fromInput.value = '';
      this.orderDate = '';
    } else if (key === 'order_date2') {
      this.toInput.value = '';
      this.orderDate2 = '';
    } else {
      (document.getElementById(key) as HTMLInputElement).value = '';
      this.filterForm.controls[key].patchValue('');
    }
    this.pageId = 1;
    this.getAllData(this.pageId);
  }
  /* --------------------------- Date ------------------------------- */
  orderDateChanged(event, ...mode) {
    let orderDateArray;
    let orderDate;
    if (mode[0] === 'updateMode') {
      orderDateArray = event.split('-');
      orderDate =
        orderDateArray[0] + '/' + orderDateArray[1] + '/' + orderDateArray[2];
      this.filterForm.patchValue({
        order_date: orderDate
        // orderDateObj: this.updatedOrderData.order_date
      });
    } else {
      orderDateArray = event.targetElement.value.split('/');
      orderDate =
        orderDateArray[2] + '/' + orderDateArray[0] + '/' + orderDateArray[1];
      this.filterForm.patchValue({
        order_date: orderDate
      });
    }
    this.orderDate = orderDate;
    this.getAllData(this.pageId);
    console.log(this.orderDate);
  }
  /* --------------------------- Date ------------------------------- */
  orderDateChanged2(event, ...mode) {
    let orderDateArray;
    let orderDate;
    if (mode[0] === 'updateMode') {
      orderDateArray = event.split('-');
      orderDate =
        orderDateArray[0] + '/' + orderDateArray[1] + '/' + orderDateArray[2];
      this.filterForm.patchValue({
        order_date2: orderDate
        // orderDateObj: this.updatedOrderData.order_date
      });
    } else {
      orderDateArray = event.targetElement.value.split('/');
      orderDate =
        orderDateArray[2] + '/' + orderDateArray[0] + '/' + orderDateArray[1];
      this.filterForm.patchValue({
        order_date2: orderDate
      });
    }
    this.orderDate2 = orderDate;
    this.getAllData(this.pageId);
    console.log(this.orderDate2);
  }
  /* ----------------------------- Get All Data --------------------- */
  getAllData(pageId) {
    this.loaderService.startLoading();
    this.coreService
      .superGet('owner/company/all?page=' + pageId, {
        per_page: this.per_page,
        name: this.filterCompaniesData,
        active: this.filteredStatusId,
        created_at: this.orderDate,
        end_date: this.orderDate2,
        services_ids: this.filterForm.controls.usedMainService.value,
        city_id: this.city_id,
        classification_id: this.filterServiceID
      })
      .subscribe((getTechniciansResponse: any) => {
        console.log(getTechniciansResponse);
        this.dataSource = getTechniciansResponse.data;
        if (this.dataSource.length === 0 && this.pageId === 1) {
        }
        if (this.dataSource.length === 0 && this.pageId > 1) {
          // last page
          this.pageId -= 1;
          this.pagesNumbers.splice(-1);
          this.goPage(this.pageId);
        }
        this.endLoading();
        this.pagination(
          getTechniciansResponse.total,
          getTechniciansResponse.per_page
        );
      });
  }
  /* ----------------------- Pagination ---------------------------- */
  pagination(totalTechniciansNumber, techniciansPerPAge) {
    this.pagesNumbers = [];
    const totalPages = Math.ceil(totalTechniciansNumber / techniciansPerPAge);
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      this.pagesNumbers.push(pageNumber);
    }
    this.checkPagination(this.pageId);
  }
  goPage(i) {
    if (i >= 1 && i <= this.pagesNumbers.length) {
      this.pageId = i;
      this.checkPagination(i);
      this.startLoading();
      this.getAllData(this.pageId);
    }
  }
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
    this.getAllData(this.pageId);
    this.endLoading();
  }
  /* ------------------------ Open Delete Popup ---------------------- */
  openDeletePopup(id, name) {
    this.deletedUserName = name;
    this.deletedUserID = id;
    this.showDeletePopup = true;
  }
  /* ------------------------- Delete User --------------------------- */
  deleteTechnical() {
    this.closePopup();
    this.startLoading();
    this.coreService
      .superDelete('owner/company/destroy/' + this.deletedUserID)
      .subscribe(
        () => {
          this.showSuccess();
          this.getAllData(this.pageId);
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
  /* ----------------------------- Close Popup --------------------------- */
  closePopup() {
    this.showDeletePopup = false;
  }
  /* --------------------------- Start Loading -------------------------- */
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  /* ----------------------- End Loading -------------------------- */
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
  }
  /* --------------------- Show Error Message ----------------------- */
  showErrors(errors) {
    this.endLoading();
    this.responseState = 'error';
    this.responseData = errors;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  /* --------------------- Show Success Message ----------------------- */
  showSuccess() {
    this.endLoading();
    this.responseState = 'success';
    this.responseData = 'تم حذف الشركة بنجاح';
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
}
