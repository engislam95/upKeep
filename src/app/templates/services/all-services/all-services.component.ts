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
  selector: 'app-all-services',
  templateUrl: './all-services.component.html',
  styleUrls: ['./all-services.component.scss'],
  animations: [popup]
})
export class AllServicesComponent implements OnInit {
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
  updateCompanyID: number;
  displayedColumns = [
    'ID',
    'classification',
    'mainService',
    'services',
    'companies',
    'orders',
    'active',
    'details'
  ];
  dataSource: any = [];
  pagesNumbers: any = [];
  countPerPage: any = [];
  pageId: any = 1;
  firstPage: any;
  lastPage: any;
  user: any = '';
  roleFilteredOptions: Observable<any>;
  classificationArray: any = [];
  per_page: any = 10;
  filterServiceID: any = '';
  counts: any = '';
  /* ---------------------- Filter Form ------------------------ */
  filterForm = new FormGroup({
    filterName: new FormControl(),
    usedService: new FormControl()
  });
  /* ----------------------- Constructor ----------------------- */
  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private paginationService: PaginationService
  ) {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    /*-------------------------- Count ---------------------------- */
    this.coreService.superGet('owner/services/counts').subscribe(counts => {
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
        filterName: ''
      });
      this.filterCompaniesData = '';
    } else if (key === 'usedService') {
      this.filterForm.patchValue({
        usedService: ''
      });
      this.filterServiceID = '';
    }
    this.pageId = 1;
    this.getAllData(this.pageId);
  }
  /* ----------------------------- Get All Data --------------------- */
  getAllData(pageId) {
    this.loaderService.startLoading();
    this.coreService
      .superGet('owner/services?page=' + pageId, {
        name: this.filterCompaniesData,
        classification_id: this.filterServiceID,
        per_page: this.per_page
      })
      .subscribe((getTechniciansResponse: any) => {
        console.log(getTechniciansResponse);
        this.dataSource = getTechniciansResponse.data.data;
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
          getTechniciansResponse.data.total,
          getTechniciansResponse.data.per_page
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
  /* ------------------------- Open Delete Popup ------------------------------ */
  openDeletePopup(id, name) {
    this.deletedCompaniesName = name;
    this.deletedCompaniesID = id;
    this.showDeletePopup = true;
  }
  /* ------------------------ Delete Company ---------------------------- */
  deleteCompany() {
    this.closePopup();
    this.startLoading();
    this.coreService
      .deleteMethod('technicians/' + this.deletedCompaniesID)
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
  /* ------------------------ Close Popup ------------------------ */
  closePopup() {
    this.showDeletePopup = false;
  }
  /* ------------------ Set Count Per Page -------------------------- */
  setCountPerPage(option) {
    this.startLoading();
    this.pageId = 1;
    this.per_page = option;
    this.getAllData(this.pageId);
    this.endLoading();
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
