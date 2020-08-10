import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  startWith,
  map,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';
import { Observable, fromEvent } from 'rxjs';
import { CoreService } from './../../../tools/shared-services/core.service';
import { ResponseStateService } from './../../../tools/shared-services/response-state.service';
import { LoaderService } from './../../../tools/shared-services/loader.service';
import { fade } from './../../../tools/shared_animations/fade';
import { emptyValidator } from '../../../tools/shared_validators/Empty.validator';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { PaginationService } from '../../../tools/shared-services/pagination.service';

@Component({
  selector: 'app-all-reports',
  templateUrl: './all-reports.component.html',
  styleUrls: ['./all-reports.component.scss'],
  animations: fade
})
export class ReportsComponent implements OnInit {
  showOrdercontrolst = false;
  pageLoaded = false;
  hideme: any = [];
  responseState: any = '';
  responseData: any = '';
  statusArray = [];
  todayFilltered: any = 0;
  tables: any = '';

  // tslint:disable-next-line: max-line-length
  displayedColumns1: string[] = [
    'id',
    'name',
    'service',
    'numbers_of_orders',
    'numbers_of_invoices',
    'total_bills'
  ];
  displayedColumns2: string[] = [
    'id',
    'source_name',
    'number_of_bills',
    'total_bills'
  ];
  dataSource1 = [];
  dataSource2 = [];
  pagesNumbers: any = [];
  countPerPage: any = [];
  pageId: any = 1;
  firstPage: any;
  lastPage: any;
  per_page: any = 10;
  showDeletePopup = false;
  deletedUserName: any = '';
  deletedUserID: any = '';
  data: any = '';
  serviceID: any = '';
  services: any = [];
  mainServiceID: any = '';
  subServices: any = [];
  fromDate: any = '';
  toDate: any = '';
  allData: any = '';
  mainTable: any = [];
  reportForm = new FormGroup({
    collection: new FormControl(''),
    service_id: new FormControl(''),
    subService_id: new FormControl(''),
    from_date: new FormControl(''),
    to_date: new FormControl('')
  });
  techniciansFilterPlaceholder = 'إسم الفني او الخدمة';
  orderStatusFilterPlaceholder = 'حالة الطلب';
  nestedType = 'nested';
  filterStatus = []; // filtered ids
  filterTechniciansComponentId = 'filterTechnicians';
  filterTechnicians = []; // filtered ids
  servicesWithTechniciansList = [];

  filterStatusComponentId = 'filterStatus';

  counter: any = '';

  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private router: Router,
    private paginationService: PaginationService
  ) {
    // Get Services
    this.startLoading();
    this.coreService.getMethod('lookup/receipt-item-types').subscribe(data => {
      console.log(data['data']);
      this.services = data['data'];
      this.endLoading();
    });
  }

  ngOnInit() {
    this.startLoading();
    this.getServicesWithTechnicians();
    this.applySearch();
    this.endLoading();
  }
  todayReport(event) {
    console.log(event);
    this.todayFilltered = event.checked == true ? 1 : 0;
    if (this.todayFilltered === 1) {
      this.reportForm.controls.from_date.disable();
      this.reportForm.controls.to_date.disable();
    } else {
      this.reportForm.controls.from_date.enable();
      this.reportForm.controls.to_date.enable();
    }
    this.pageId = 1;
    this.applySearch();
  }
  search(selectedData) {
    console.log(selectedData);
    if (selectedData.type === this.filterStatusComponentId) {
      this.filterStatus = selectedData.data;
    } else if (selectedData.type === this.filterTechniciansComponentId) {
      this.filterTechnicians = selectedData.data;
    }
  }
  getServicesWithTechnicians() {
    let servicesWithTechnicians = [];
    this.coreService
      .getMethod('services/active', { with_technicians: 1 })
      .subscribe((servicesWithTechniciansResponse: any) => {
        console.log(servicesWithTechniciansResponse);

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
  /* --------------------------- Date ------------------------------- */
  orderDateChanged(event, ...mode) {
    let orderDateArray;
    let orderDate;
    if (mode[0] === 'updateMode') {
      orderDateArray = event.split('-');
      orderDate =
        orderDateArray[0] + '/' + orderDateArray[1] + '/' + orderDateArray[2];
      this.reportForm.patchValue({
        from_date: orderDate
      });
    } else {
      orderDateArray = event.targetElement.value.split('/');
      orderDate =
        orderDateArray[2] + '/' + orderDateArray[0] + '/' + orderDateArray[1];
      this.reportForm.patchValue({
        from_date: orderDate
      });
    }
    this.fromDate = orderDate;
  }
  /* --------------------------- Date ------------------------------- */
  orderDateChanged2(event, ...mode) {
    let orderDateArray;
    let orderDate;
    if (mode[0] === 'updateMode') {
      orderDateArray = event.split('-');
      orderDate =
        orderDateArray[0] + '/' + orderDateArray[1] + '/' + orderDateArray[2];
      this.reportForm.patchValue({
        to_date: orderDate
      });
    } else {
      orderDateArray = event.targetElement.value.split('/');
      orderDate =
        orderDateArray[2] + '/' + orderDateArray[0] + '/' + orderDateArray[1];
      this.reportForm.patchValue({
        to_date: orderDate
      });
    }
    this.toDate = orderDate;
  }

  applySearch(form?) {
    this.startLoading();
    console.log(form);
    this.coreService
      .getMethod('Reports/details', {
        date_from: this.reportForm.controls.from_date.value,
        date_to: this.reportForm.controls.to_date.value,
        'technician_id[]': this.filterTechnicians,
        today: this.todayFilltered
      })
      .subscribe(data => {
        this.endLoading();
        console.log(data);
        this.allData = data['data'];
        this.counter = data['data']['counter'];
        this.tables = data['data']['Table'];
        this.dataSource1 = this.tables.ChildService;
        this.dataSource2 = this.tables.Source;
        console.log(this.dataSource1);
        console.log(this.dataSource2);
        console.log(data['data']['Table']['Mainservice']);
        const arr = [];
        if (data['data']['Table']['Mainservice']) {
          for (const prop in data['data']['Table']['Mainservice']) {
            console.log(prop);
            arr.push(prop);
          }
          console.log(arr);
          console.log(Object.values(data['data']['Table']['Mainservice']));
          const values = Object.values(data['data']['Table']['Mainservice']);
          for (let i = 0; i < values.length; i++) {
            values[i]['techName'] = arr[i];
          }
          console.log(values);
          this.mainTable = values;
        } else {
          this.mainTable = [];
        }
      });
  }

  /* -------------------------- Start Loading --------------------- */
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  /* -------------------------- End Loading --------------------- */
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
  }
  /* ----------------------------- Show Error Messages --------------------- */
  showErrors(errors) {
    this.endLoading();
    this.responseState = 'error';
    this.responseData = errors;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  /* ----------------------------- Show Success Messages --------------------- */
  showSuccess(successText) {
    this.endLoading();
    this.responseState = 'success';
    this.responseData = successText;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }

  /* ----------------------------- Close Popup --------------------------- */
  closePopup() {
    this.showDeletePopup = false;
  }
}
