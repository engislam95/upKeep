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
  selector: 'app-all-classifications',
  templateUrl: './all-classifications.component.html',
  styleUrls: ['./all-classifications.component.scss'],
  animations: [popup]
})
export class AllClassificationsComponent implements OnInit {
  /* --------------------------- Variables ------------------------ */
  hideme: any = [];
  showOrdercontrolst: boolean = false;
  showFilter: boolean = false;
  pageLoaded: boolean = false;
  filterClassificationData: any = '';
  responseState: any = '';
  responseData: any = '';
  per_page: any = 10;
  displayedColumns = ['ID', 'name', 'services', 'owner_details'];
  dataSource: any = [];
  pagesNumbers: any = [];
  countPerPage: any = [];
  pageId: any = 1;
  firstPage: any;
  lastPage: any;
  /* ------------------- Filter Form ------------------------ */
  filterForm = new FormGroup({
    filterName: new FormControl()
  });
  statusArray = [{ name: 'مفعل', id: 1 }, { name: 'غير مفعل', id: 0 }];
  statusFilteredOptions: Observable<any>;
  filteredStatusId = '';
  total: any = '';
  user: any = '';
  /* --------------------- Constructor ------------------------- */
  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private paginationService: PaginationService
  ) {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
  }
  /* ---------------- Oninit ----------------------- */
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
        console.log(value);
        this.pageId = 1;
        this.filterClassificationData = value;
        this.getAllData(this.pageId);
      });
    this.endLoading();
  }
  /* --------------------- Show Filter Inputs ------------------------ */
  showFilterInputs(event) {
    console.log(event);
    const filterName = document.getElementById('smallFillterInputStyle');
    if (event.checked == true) {
      this.showFilter = true;
      filterName.style.display = 'block';
    } else if (event.checked == false) {
      this.showFilter = false;
      filterName.style.display = 'none';
    }
  }
  /* --------------- Get Count -------------------- */
  pageCountOptions() {
    for (let option = 10; option <= 50; option += 10) {
      this.countPerPage.push(option);
    }
  }
  /* -------------------- Reset ---------------------------- */
  xResetInputs(key) {
    console.log(key);
    if (key === 'filterName') {
      this.filterForm.patchValue({
        filterName: ''
      });
      this.filterClassificationData = '';
      this.pageId = 1;
      this.getAllData(this.pageId);
    }
  }
  /* --------------------- Get All Data -------------------- */
  getAllData(pageId, per_page?) {
    this.loaderService.startLoading();
    this.coreService
      .superGet('owner/classification/all?page=' + pageId, {
        name: this.filterClassificationData,
        per_page: this.per_page
      })
      .subscribe((classification: any) => {
        console.log(classification);
        this.dataSource = classification.data;
        this.total = classification.total;
        if (this.dataSource.length === 0 && this.pageId === 1) {
        }
        if (this.dataSource.length === 0 && this.pageId > 1) {
          this.pageId -= 1;
          this.pagesNumbers.splice(-1);
          this.goPage(this.pageId);
        }
        this.endLoading();
        this.pagination(classification.total, classification.per_page);
      });
  }
  /* ---------------------- Pagination -------------------- */
  pagination(totalNumber, perPage) {
    this.pagesNumbers = [];
    const totalPages = Math.ceil(totalNumber / perPage);
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
  setCountPerPage(option) {
    this.startLoading();
    this.pageId = 1;
    this.per_page = option;
    this.getAllData(this.pageId, this.per_page);
    this.endLoading();
  }
  /* ---------------- Start Loading ------------------- */
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  /* ---------------- End Loading ------------------- */
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
  }
  /* ------------------ Show Error Messsage ---------------------- */
  // showErrors(errors) {
  //   this.endLoading();
  //   this.responseState = 'error';
  //   this.responseData = errors;
  //   this.responseStateService.responseState(
  //     this.responseState,
  //     this.responseData
  //   );
  // }
  /* ---------------------- Show Success Message ----------------------- */
  // showSuccess() {
  //   this.endLoading();
  //   this.responseState = 'success';
  //   this.responseData = 'تم حذف الفني بنجاح';
  //   this.responseStateService.responseState(
  //     this.responseState,
  //     this.responseData
  //   );
  // }
}
