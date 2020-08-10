import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/tools/shared-services/loader.service';
import { ResponseStateService } from 'src/app/tools/shared-services/response-state.service';
import { CoreService } from 'src/app/tools/shared-services/core.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PaginationService } from 'src/app/tools/shared-services/pagination.service';

@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.scss']
})
export class AddModelComponent implements OnInit {
  mainService: any = [];
  subServices: any = [];
  services: any = [];
  mainServiceID: any = '';
  subServiceID: any = '';
  serviceID: any = '';
  updatedMode: boolean = false;
  pageLoaded: boolean = false;
  hideme: any = [];
  responseState;
  responseData;
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
  showDeletePopup: boolean = false;
  deletedUserName: any = '';
  deletedUserID: any = '';
  showOrdercontrolst: boolean = false;
  updatedID: any = '';

  modelForm: FormGroup = new FormGroup({
    service_parent_id: new FormControl(''),
    service_id: new FormControl(''),
    set_name: new FormControl(''),
    set_type_id: new FormControl('')
  });
  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private paginationService: PaginationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
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
    /* ----------------------------- Update Mode --------------------------- */
    this.activatedRoute.queryParams.subscribe(queryParams => {
      console.log(queryParams);
      if (queryParams.updatedMode == 'true') {
        this.updatedMode = true;
        this.updatedID = +queryParams.companyId;
        this.coreService
          .getMethod('invoiceSets/show/' + this.updatedID)
          .subscribe(company => {
            console.log(company);
            this.coreService
              .getMethod('services/children/' + company['data'].mainservice.id)
              .subscribe(data => {
                console.log(data['data']);
                this.subServices = data['data'];
                this.endLoading();
                this.getAllData(this.pageId);
                this.pageCountOptions();
              });
            this.mainServiceID = company['data'].mainservice.id;
            this.subServiceID = company['data'].childservice.id;
            this.serviceID = company['data'].set_type_id;
            this.modelForm.controls.service_parent_id.setValue(
              company['data'].mainservice.id
            );
            console.log(company['data'].childservice.id);
            this.modelForm.controls.service_id.setValue(
              company['data'].childservice.id
            );
            this.modelForm.controls.set_name.setValue(company['data'].set_name);
            this.modelForm.controls.set_type_id.setValue(
              +company['data'].set_type_id
            );
          });
      }
    });
  }

  getSubService(event) {
    this.subServiceID = event;
    // Get Sub Services
    this.startLoading();
    this.coreService.getMethod('services/children/' + event).subscribe(data => {
      console.log(data['data']);
      this.subServices = data['data'];
      this.endLoading();
    });
  }

  getSubServiceID(event) {
    this.subServiceID = event;
  }

  getServiceID(event) {
    this.serviceID = event;
  }

  ngOnInit() {}

  saveModel(form) {
    this.startLoading();
    console.log(form);
    this.coreService.postMethod('invoiceSets/add', form).subscribe(
      data => {
        console.log(data);
        this.showSuccess('تم تسجيل النموذج بنجاح');
        setTimeout(() => {
          this.router.navigateByUrl('/receipts-managment/all-models');
        }, 1000);
        this.getAllData(this.pageId);
        this.pageCountOptions();
        this.modelForm.reset();
      },
      error => {
        if (error.error.errors) {
          this.showErrors(error.error.errors);
        } else {
          this.showErrors(error.error.message);
        }
      }
    );
    this.endLoading();
  }
  updatingModel(form) {
    this.startLoading();
    console.log(form);

    this.coreService
      .updateMethod('invoiceSets/update/' + this.updatedID, form)
      .subscribe(
        data => {
          console.log(data);
          this.showSuccess('تم تعديل النموذج بنجاح');
          setTimeout(() => {
            this.router.navigateByUrl('/receipts-managment/all-models');
          }, 1000);
          this.getAllData(this.pageId);
          this.pageCountOptions();
          this.modelForm.reset();
          this.updatedMode = false;
        },
        error => {
          if (error.error.errors) {
            this.showErrors(error.error.errors);
          } else {
            this.showErrors(error.error.message);
          }
        }
      );
    this.endLoading();
  }
  updateModel(row) {
    console.log(row);
    this.updatedID = row.id;
    this.updatedMode = true;
    this.modelForm.controls.service_parent_id.setValue(row.mainservice.id);
    this.modelForm.controls.service_id.setValue(row.childservice.id);
    this.modelForm.controls.set_name.setValue(row.set_name);
    console.log(row.set_type_id);
    console.log(+row.set_type_id);

    this.modelForm.controls.set_type_id.setValue(+row.set_type_id);
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
    console.log(this.responseData);
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
