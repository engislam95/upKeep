import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/tools/shared-services/loader.service';
import { ResponseStateService } from 'src/app/tools/shared-services/response-state.service';
import { CoreService } from 'src/app/tools/shared-services/core.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PaginationService } from 'src/app/tools/shared-services/pagination.service';

@Component({
  selector: 'app-add-tax',
  templateUrl: './add-tax.component.html',
  styleUrls: ['./add-tax.component.scss']
})
export class AddTaxComponent implements OnInit {

  mainService: any = [];
  subServices: any = [];
  services: any = [];
  mainServiceID: any = '';
  subServiceID: any = '';
  serviceID: any = '';
  updatedMode: boolean = false;
  pageLoaded: boolean = false;
  hideme: any = [];
  responseState: any = '';
  responseData: any = '';
  displayedColumns = [
    'ID',
    'tax_name',
    'tax_name_on_invoice',
    'value_tax',
    'details',
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
  showOrdercontrolst: boolean = false;
  updatedID: any = '';

  taxForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    method: new FormControl(''),
    value: new FormControl(''),
    type: new FormControl(''),
  });
  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private paginationService: PaginationService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    /* ----------------------------- Update Mode --------------------------- */
    this.activatedRoute.queryParams.subscribe(queryParams => {
      console.log(queryParams);
      if (queryParams.updatedMode == 'true') {
        this.updatedMode = true;
        this.updatedID = +queryParams.companyId;
        this.coreService
          .getMethod('Taxes/show/' + this.updatedID)
          .subscribe(company => {
            console.log(company);
            this.taxForm.controls.name.setValue(company['data'].name);
            this.taxForm.controls.method.setValue(company['data'].method);
            this.taxForm.controls.value.setValue(company['data'].value);
            this.taxForm.controls.type.setValue(company['data'].type);
          })
      }
    })
  }


  ngOnInit() {
    this.getAllData(this.pageId);
    this.pageCountOptions();
  }

  saveModel(form) {
    this.startLoading();
    console.log(form);
    this.coreService.postMethod('Taxes/add', form).subscribe(data => {
      console.log(data);
      this.showSuccess('تم تسجيل الضريبة بنجاح');
      this.getAllData(this.pageId);
      this.pageCountOptions();
      this.taxForm.reset();
    },
      error => {
        if (error.error.errors) {
          this.showErrors(error.error.errors);
        } else {
          this.showErrors(error.error.message);
        }
      })
    this.endLoading();
  }
  updatingModel(form) {
    this.startLoading();
    console.log(form);
    this.coreService.updateMethod('Taxes/update/' + this.updatedID, form).subscribe(data => {
      console.log(data);
      this.showSuccess('تم تعديل الضريبة بنجاح');
      this.getAllData(this.pageId);
      this.pageCountOptions();
      this.taxForm.reset();
      this.updatedMode = false;
    },
      error => {
        if (error.error.errors) {
          this.showErrors(error.error.errors);
        } else {
          this.showErrors(error.error.message);
        }
      })
    this.endLoading();
  }
  updateModel(row) {
    console.log(row);
    this.updatedID = row.id;
    this.updatedMode = true;
    this.taxForm.controls.name.setValue(row.name);
    this.taxForm.controls.method.setValue(row.method);
    this.taxForm.controls.value.setValue(row.value);
    this.taxForm.controls.type.setValue(row.type);
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
        per_page: this.per_page,
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
    this.responseStateService.responseState(this.responseState, this.responseData);
  }
  /* ----------------------------- Show Success Messages --------------------- */
  showSuccess(successText) {
    this.endLoading();
    this.responseState = 'success';
    this.responseData = successText;
    this.responseStateService.responseState(this.responseState, this.responseData);
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
