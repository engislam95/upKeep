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
  selector: 'app-all-blocks',
  templateUrl: './all-blocks.component.html',
  styleUrls: ['./all-blocks.component.scss'],
  animations: fade
})
export class AllBlockComponent implements OnInit {
  showOrdercontrolst: boolean = false;
  pageLoaded: boolean = false;
  hideme: any = [];
  responseState: any = '';
  responseData: any = '';
  displayedColumns: string[] = [
    'id',
    'name',
    'type',
    'mobile',
    'date_block',
    'tax_details'
  ];
  dataSource: any = [];
  pagesNumbers: any = [];
  countPerPage: any = [];
  pageId: any = 1;
  firstPage: any;
  lastPage: any;
  per_page: any = 10;
  showDeletePopup: boolean = false;
  deletedUserName: any = '';
  deletedUserID: any = '';
  current_page = '';
  totalPage = '';

  blockForm = new FormGroup({
    client_id: new FormControl('', [Validators.required])
  });

  clientsFilteredOptions: Observable<any>;
  clientID: any = '';
  clientArray: any = [];
  clientName: any = [];

  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private router: Router,
    private paginationService: PaginationService
  ) {
    this.startLoading();
    this.coreService.getMethod('clients/active').subscribe(data => {
      console.log(data);
      this.clientArray = data;
      this.clientsFilteredOptions = this.blockForm
        .get('client_id')
        .valueChanges.pipe(
          startWith(''),
          map(value => this.filterClients(value))
        );
      this.endLoading();
    });
  }

  ngOnInit() {
    this.getAllData(this.pageId);
    this.pageCountOptions();
  }

  addBlock() {
    this.startLoading();
    this.coreService
      .postMethod('ClientInvoice/addban', {
        client_id: this.clientID
      })
      .subscribe(
        data => {
          console.log(data);
          this.clientName = '';
          document.getElementById('clientIdObj')['value'] = '';
          this.getAllData(this.pageId);
          this.endLoading();
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

  filterClients(value) {
    if (typeof value === 'object') {
      this.clientID = value.id;
    }
    if (value === '') {
      this.clientID = '';
    }
    if (typeof value == 'string') {
      this.clientName = value;
    }
    this.startLoading();
    console.log(this.clientArray[0]);
    this.getAllData(this.pageId);
    this.endLoading();
    return this.clientArray.filter(option => option.user.name.includes(value));
  }
  /* ------------------------ Display Option ----------------------------- */
  displayOptionsFunction(state) {
    console.log(state);

    if (state !== null) {
      if (state.user) {
        return state.user.name;
      }
    }
  }

  /* ---------------------- Get Count ------------------------------ */
  pageCountOptions() {
    for (let option = 10; option <= 50; option += 10) {
      this.countPerPage.push(option);
    }
  }

  /* ----------------------------- Get All Data --------------------- */
  getAllData(pageId) {
    this.startLoading();
    this.coreService
      .getMethod('ClientInvoice/allClients?page=' + pageId, {
        per_page: this.per_page,
        name: this.clientName
        // service_id: this.subServiceID,
        // set_type_id: this.serviceID,
      })
      .subscribe((getTechniciansResponse: any) => {
        console.log(getTechniciansResponse);
        this.dataSource = getTechniciansResponse.data['data'];
        this.current_page = getTechniciansResponse.data.current_page;
        this.totalPage = getTechniciansResponse.data.last_page;
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
          getTechniciansResponse['data'].total,
          getTechniciansResponse['data'].per_page
        );
      });
  }
  nextPage(pageNum) {
    this.getAllData(+pageNum + 1);
  }
  prevPage(pageNum) {
    this.getAllData(+pageNum - 1);
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
      .postMethod('ClientInvoice/deleteban', {
        client_id: this.deletedUserID
      })
      .subscribe(
        () => {
          this.showSuccess('تم حذف حظر العميل بنجاح');
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
