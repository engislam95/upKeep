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
import { PaginationService } from 'src/app/tools/shared-services/pagination.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-all-charts',
  templateUrl: './all-charts.component.html',
  styleUrls: ['./all-charts.component.scss'],
  animations: fade
})
export class ChartsComponent implements OnInit {
  showOrdercontrolst = false;
  pageLoaded = false;
  hideme: any = [];
  responseState: any = '';
  responseData: any = '';

  // tslint:disable-next-line: max-line-length
  displayedColumns: string[] = [
    'id',
    'duration_of_research',
    'number_of_bills',
    'total_bills',
    'total_invoices_without_added_value',
    'total_services',
    'tota_spare_parts',
    'total_added_value',
    'total_invoices_canceled'
  ];
  dataSource: any = [];
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
  chartOptions: any = '';
  serviceID: any = '';
  services: any = [];
  mainServiceID: any = '';
  subServices: any = [];
  fromDate: any = '';
  toDate: any = '';
  allData: any = '';
  chartForm = new FormGroup({
    collection: new FormControl(''),
    service_id: new FormControl(''),
    subService_id: new FormControl(''),
    from_date: new FormControl(''),
    to_date: new FormControl('')
  });

  @ViewChild('TABLE') TABLE: ElementRef;
  @ViewChild(MatPaginator, {}) paginator: MatPaginator;

  title = 'Excel';

  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private router: Router,
    private paginationService: PaginationService
  ) {
    // Get Services
    this.coreService.getMethod('lookup/receipt-item-types').subscribe(data => {
      console.log(data['data']);
      this.services = data['data'];
    });
  }

  ngOnInit() {
    this.startLoading();
    this.getAllData(this.pageId);
    this.applySearch();
    this.pageCountOptions();
    this.endLoading();
  }
  getDate(event) {
    console.log(event);
  }
  /* --------------------------- Date ------------------------------- */
  orderDateChanged(event, ...mode) {
    let orderDateArray;
    let orderDate;
    if (mode[0] === 'updateMode') {
      orderDateArray = event.split('-');
      orderDate =
        orderDateArray[0] + '/' + orderDateArray[1] + '/' + orderDateArray[2];
      this.chartForm.patchValue({
        from_date: orderDate
      });
    } else {
      orderDateArray = event.targetElement.value.split('/');
      orderDate =
        orderDateArray[2] + '/' + orderDateArray[0] + '/' + orderDateArray[1];
      this.chartForm.patchValue({
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
      this.chartForm.patchValue({
        to_date: orderDate
      });
    } else {
      orderDateArray = event.targetElement.value.split('/');
      orderDate =
        orderDateArray[2] + '/' + orderDateArray[0] + '/' + orderDateArray[1];
      this.chartForm.patchValue({
        to_date: orderDate
      });
    }
    this.toDate = orderDate;
  }

  applySearch(form?) {
    console.log(form);
    this.coreService
      .getMethod('Reports/chart', {
        date_from: this.chartForm.controls.from_date.value,
        date_to: this.chartForm.controls.to_date.value,
        collection: this.chartForm.controls.collection.value
      })
      .subscribe(data => {
        console.log(data);
        this.allData = data['data'];
        let obj = {
          labels: this.allData.labels,
          datasets: [
            {
              label: 'اجمالى الفواتير',
              backgroundColor: '#AF12A5',
              borderColor: '#AF12A5',
              data: this.allData.total,
              barPercentage: 0.1,
              barThickness: 10
            },
            {
              label: 'اجمالى القيمة المضافة',
              backgroundColor: '#236BE6',
              borderColor: '#236BE6',
              data: this.allData.totalWithoutTax,
              barPercentage: 0.1,
              barThickness: 10
            },
            {
              label: 'اجمالى الخدمات',
              backgroundColor: '#E62323',
              borderColor: '#E62323',
              data: this.allData.totalService,
              barPercentage: 0.1,
              barThickness: 10
            },
            {
              label: 'قطع الغيار',
              backgroundColor: '#11BEB2',
              borderColor: '#11BEB2',
              data: this.allData.totalSpare,
              barPercentage: 0.1,
              barThickness: 10
            },
            {
              label: 'اجمالى القيمة المضافة',
              backgroundColor: '#8AA129',
              borderColor: '#8AA129',
              data: this.allData.totalTax,
              barPercentage: 0.1,
              barThickness: 10
            },
            {
              label: 'عدد الفواتير',
              backgroundColor: 'yellow',
              borderColor: 'yellow',
              data: this.allData.totalReceipts,
              barPercentage: 0.1,
              barThickness: 10
            }
          ]
        };
        console.log(obj);
        this.data = obj;
        this.chartOptions = {
          scales: {
            // xAxes: [
            //   {
            //     barPercentage: 10,
            //     categoryPercentage: 10
            //   }
            // ]
          }
        };
      });
    setTimeout(() => {
      let arr = [];
      for (let i = 0; i < this.allData.labels.length; i++) {
        let objectTable = {
          id: i,
          duration_of_research: this.allData.labels[i],
          number_of_bills: this.allData.totalReceipts[i],
          total_bills: this.allData.total[i],
          total_invoices_without_added_value: this.allData.totalWithoutTax[i],
          total_services: this.allData.totalService[i],
          tota_spare_parts: this.allData.totalSpare[i],
          total_added_value: this.allData.totalTax[i],
          total_invoices_canceled: this.allData.total[i]
        };
        arr.push(objectTable);
      }
      console.log(arr);
      this.dataSource = new MatTableDataSource(arr);
      this.dataSource.paginator = this.paginator;
    }, 2000);
  }
  /* ------------ PDF ------------------ */
  captureScreen() {
    this.startLoading();
    const data = document.getElementById('content');
    console.log(data);
    html2canvas(data).then(canvas => {
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('Invoices.pdf'); // Generated PDF
      this.endLoading();
    });
  }
  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.TABLE.nativeElement
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Invoices.xlsx');
  }
  /* ---------------------- Get Count ------------------------------ */
  pageCountOptions() {
    for (let option = 10; option <= 50; option += 10) {
      this.countPerPage.push(option);
    }
  }

  /* ----------------------------- Get All Data --------------------- */
  getAllData(pageId) {
    this.loaderService.startLoading();
    this.coreService
      .getMethod('Taxes/all?page=' + pageId, {
        per_page: this.per_page
        // service_parent_id: this.mainServiceID,
        // service_id: this.subServiceID,
        // set_type_id: this.serviceID,
      })
      .subscribe((getTechniciansResponse: any) => {
        console.log(getTechniciansResponse);
        // this.dataSource = getTechniciansResponse.data;
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
      .deleteMethod('Taxes/delete/' + this.deletedUserID)
      .subscribe(
        () => {
          this.showSuccess('تم حذف الضريبة بنجاح');
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
}
