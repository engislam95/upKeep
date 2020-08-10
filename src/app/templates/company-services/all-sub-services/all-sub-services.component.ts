import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, fromEvent } from 'rxjs';
import { LoaderService } from 'src/app/tools/shared-services/loader.service';
import { ResponseStateService } from 'src/app/tools/shared-services/response-state.service';
import { CoreService } from 'src/app/tools/shared-services/core.service';
import { PaginationService } from 'src/app/tools/shared-services/pagination.service';
import {
  map,
  debounceTime,
  distinctUntilChanged,
  startWith
} from 'rxjs/operators';
import { popup } from 'src/app/tools/shared_animations/popup';

@Component({
  selector: 'app-all-sub-services',
  templateUrl: './all-sub-services.component.html',
  styleUrls: ['./all-sub-services.component.scss'],
  animations: [popup]
})
export class AllSubServicesComponent implements OnInit {
  /* ------------------------ Variables --------------------------- */
  filterServicesData = '';
  pageLoaded = false;
  showOrdercontrolst = false;
  responseState: any = '';
  responseData: any = '';
  service_id: any = '';
  mainServiceName: any = '';
  hideme: any = [];
  // tslint:disable-next-line: no-inferrable-types
  showUpdatePopup: boolean = false;
  /* ------------------------- Mat Table ----------------------- */
  displayedColumns = [
    //
    'ID',
    'name',
    'count',
    'details',
  ];
  dataSource = [];
  /* -------------------- Pagination ------------------------ */
  pagesNumbers = [];
  // tslint:disable-next-line: no-inferrable-types
  pageId: number = 1; // number
  firstPage: any = ''; // any
  lastPage: any = '';
  // tslint:disable-next-line: variable-name
  per_page: any = 10;
  /* --------------------------- Form --------------------------------- */
  filterForm = new FormGroup({
    ServiceTypeObj: new FormControl(),
    filterName: new FormControl()
  });
  /* ----------------------- Constructor ---------------------- */
  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private route: ActivatedRoute,
    private paginationService: PaginationService
  ) {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.service_id = params.mainServiceID;
      if (params.mainServiceID) {
        this.mainServiceName = params.mainServiceName;
        this.getAllServices(this.pageId);
      }
    });
  }
  /* ------------------------- Pagination ------------------------ */
  checkPagination(pageId) {
    const [firstPage, lastPage] = this.paginationService.checkPaginationButtons(
      pageId,
      this.pagesNumbers.length
    );
    this.firstPage = firstPage;
    this.lastPage = lastPage;
  }
  /* ---------------------- Oninit ----------------------------- */
  ngOnInit() {
    this.startLoading();
    this.getAllServices(this.pageId);
    /* ------------------------ Filter -------------------------- */
    const filterName = document.getElementById('filterName');
    const filterNameListner = fromEvent(filterName, 'input');
    filterNameListner
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        this.pageId = 1;
        this.filterServicesData = value;
        this.getAllServices(this.pageId);
      });
  }
  /* ------------------ Change Number of Pagination list -------------------- */
  setCountPerPage(option) {
    this.startLoading();
    this.pageId = 1;
    this.getAllServices(option);
    this.endLoading();
  }
  /* --------------------------------- Clear Text -------------------------- */
  xResetInputs(key) {
    if (key === 'filterName') {
      this.filterForm.patchValue({
        filterServicesData: '',
        filterName: ''
      });
      this.filterServicesData = '';
    }
    this.pageId = 1;
    this.getAllServices(this.pageId);
  }
  /* ------------------------------ Get Services Data ---------------------- */
  getAllServices(pageId?) {
    this.loaderService.startLoading();
    this.coreService
      .getMethod('services/children/' + this.service_id + '?page=' + pageId, {
        name: this.filterServicesData,
        per_page: this.per_page,
      })
      .subscribe((getServicesResponse: any) => {
        console.log(getServicesResponse);
        this.dataSource = getServicesResponse.data.data;
        if (this.dataSource.length === 0 && this.pageId === 1) {
        }
        if (this.dataSource.length === 0 && this.pageId > 1) {
          this.pageId -= 1;
          this.pagesNumbers.splice(-1);
          this.goPage(this.pageId);
        }
        this.endLoading();
        this.pagination(
          getServicesResponse.data.total,
          getServicesResponse.data.per_page
        );
      });
  }
  /* --------------------------- Get Pagination ----------------------------- */
  pagination(totalServicesNumber, servicesPerPage) {
    this.pagesNumbers = [];
    const totalPages = Math.ceil(totalServicesNumber / servicesPerPage);
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      this.pagesNumbers.push(pageNumber);
    }
  }
  /* ------------------------ Next & Previous ---------------------- */
  goPage(i) {
    if (i >= 1 && i <= this.pagesNumbers.length) {
      this.pageId = i;
      // Start START Loading
      this.startLoading();
      // End START Loading
      this.getAllServices(this.pageId);
    }
  }
  /* ---------------------- Start Loading --------------------- */
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  /* ---------------------- End Loading --------------------- */
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
  }
  /* --------------------------- Show Errors ---------------------- */
  showErrors(errors) {
    this.endLoading();
    this.responseState = 'error';
    this.responseData = errors;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  /* --------------------------- Show Success ---------------------- */
  showSuccess() {
    this.endLoading();
    this.responseState = 'success';
    this.responseData = 'تم حذف الخدمة بنجاح';
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
}
