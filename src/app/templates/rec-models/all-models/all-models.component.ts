import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-all-models',
  templateUrl: './all-models.component.html',
  styleUrls: ['./all-models.component.scss'],
  animations: fade
})
export class AllModelsComponent implements OnInit {
  showOrdercontrolst: boolean = false;
  pageLoaded: boolean = false;
  hideme: any = [];
  responseState: any = '';
  responseData: any = '';
  displayedColumns = [
    'ID',
    'name',
    'main_service',
    'service_name',
    'type',
    'volume_use',
    'details'
  ];
  dataSource: any = [];
  pagesNumbers: any = [];
  countPerPage: any = [];
  pageId: any = 1;
  firstPage: any;
  lastPage: any;
  per_page: any = 10;
  mainService: any = [];
  subServices: any = [];
  services: any = [];
  mainServiceID: any = '';
  subServiceID: any = '';
  serviceID: any = '';
  showDeletePopup: boolean = false;
  deletedUserName: any = '';
  deletedUserID: any = '';

  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private router: Router,
    private paginationService: PaginationService
  ) {
    // Get Main Services
    this.coreService.getMethod('services').subscribe(data => {
      console.log(data['data']);
      this.mainService = data['data'];
    });
    // Get Services
    this.coreService.getMethod('lookup/receipt-item-types').subscribe(data => {
      console.log(data['data']);
      this.services = data['data'];
    });
  }

  ngOnInit() {
    this.startLoading();
    this.getAllData(this.pageId);
    this.pageCountOptions();
    this.endLoading();
  }
  /* ---------------------- Get Count ------------------------------ */
  pageCountOptions() {
    for (let option = 10; option <= 50; option += 10) {
      this.countPerPage.push(option);
    }
  }
  /* ----------------- Get ID ----------- */
  getSubService(event) {
    console.log(event);
    this.mainServiceID = event;
    // Get Sub Services
    this.coreService.getMethod('services/children/' + event).subscribe(data => {
      console.log(data['data']);
      this.subServices = data['data'];
    });
    this.getAllData(this.pageId);
  }
  getSubServiceID(event) {
    console.log(event);
    this.subServiceID = event;
    this.getAllData(this.pageId);
  }
  getServiceID(event) {
    console.log(event);
    this.serviceID = event;
    this.getAllData(this.pageId);
  }
  /* ----------------------------- Get All Data --------------------- */
  getAllData(pageId) {
    this.loaderService.startLoading();
    this.coreService
      .getMethod('invoiceSets/all?page=' + pageId, {
        per_page: this.per_page,
        service_parent_id: this.mainServiceID,
        service_id: this.subServiceID,
        set_type_id: this.serviceID
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
      .deleteMethod('invoiceSets/delete/' + this.deletedUserID)
      .subscribe(
        () => {
          this.showSuccess('تم حذف النموذج بنجاح');
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
