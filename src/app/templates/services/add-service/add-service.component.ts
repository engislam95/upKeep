import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { LoaderService } from 'src/app/tools/shared-services/loader.service';
import { Observable, fromEvent } from 'rxjs';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from '@angular/forms';
import { ResponseStateService } from 'src/app/tools/shared-services/response-state.service';
import { CoreService } from 'src/app/tools/shared-services/core.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { fade } from 'src/app/tools/shared_animations/fade';
@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss'],
  animations: fade
})
export class AddServiceComponent implements OnInit {
  /* ---------------------- Variables --------------------------- */
  statusArray = [{ name: 'مفعل', id: 1 }, { name: 'غير مفعل', id: 0 }];
  statusFilteredOptions: Observable<any>;
  filteredStatusId: any = '';
  responseState: any = '';
  responseData: any = '';
  pageLoaded: boolean = false;
  submitted: boolean = false;
  updateMode: boolean = false;
  user: any = '';
  accept: boolean = false;
  classificationArray: any = [];
  roleFilteredOptions: Observable<any>;
  filterServiceID: any = '';
  addToAllCompany: boolean = false;
  updatedID: any = '';
  serviceObject: any = '';
  /* ------------------------ Users Form ------------------------ */
  classificationForm = new FormGroup({
    name: new FormControl('', Validators.required),
    usedService: new FormControl(),
    usersStatus: new FormControl(),
    active: new FormControl('')
  });
  /* ------------------ Constructor ------------------------ */
  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    /* --------------------- Get Classifications ------------------------- */
    this.coreService
      .superGet('owner/classification/all')
      .subscribe(classification => {
        console.log(classification);
        this.classificationArray = classification;
        this.roleFilteredOptions = this.classificationForm
          .get('usedService')
          .valueChanges.pipe(
            startWith(''),
            map(value => this.filterService(value))
          );
      });
  }

  /* -------------------- Oninit ------------------------ */
  ngOnInit() {
    /* ------------------ Scrolling ----------------------- */
    window.scroll({ top: 0, behavior: 'auto' });
    /* ------------------ Start Loading ------------------------- */
    this.startLoading();
    this.statusFilteredOptions = this.classificationForm
      .get('usersStatus')
      .valueChanges.pipe(
        startWith(''),
        map(value => this.filterUsersStatus(value))
      );
    /* ----------------------- End Loading ---------------------- */
    this.endLoading();
    /* ----------------------------- Update Mode --------------------------- */
    this.activatedRoute.queryParams.subscribe(queryParams => {
      console.log(queryParams);
      if (queryParams.updateMode) {
        this.startLoading();
        this.updateMode = queryParams.updateMode === 'true';
        this.updatedID = queryParams.serviceID;
        this.coreService
          .superGet('owner/services/show/' + this.updatedID)
          .subscribe(service => {
            console.log(service['data']);
            this.serviceObject = service['data'];
            this.classificationForm.controls.name.setValue(
              service['data'].name
            );
            if (service['data']['classification']) {
              this.classificationForm.controls.usedService.setValue(
                service['data']['classification'].name
              );
              this.filterServiceID = service['data']['classification'].id;
            }
            if (this.serviceObject.active == 1) {
              this.filteredStatusId = 1;
              this.classificationForm.controls.usersStatus.setValue('مفعل');
            }
            this.accept = true;
            this.endLoading();
          });
      }
    });
  }
  /* ------------------- Filter Status ------------------- */
  filterUsersStatus(value: any) {
    if (typeof value === 'object') {
      this.filteredStatusId = value.id;
    }
    if (value === '') {
      this.filteredStatusId = '';
    }
    return this.statusArray.filter(option => option.name.includes(value));
  }
  /*----------------------- Service Filter ----------------------- */
  filterService(value: any) {
    if (typeof value === 'object') {
      this.filterServiceID = value.id;
    }
    if (value === '') {
      this.filterServiceID = '';
    }
    return this.classificationArray.filter(option =>
      option.name.includes(value)
    );
  }
  /* ------------------------ Display Option ----------------------------- */
  displayOptionsFunction(state) {
    if (state !== null) {
      return state.name;
    }
  }
  /* -------------------- Reset ---------------------- */
  xResetInputs(key) {
    console.log(key);
    if (key === 'name') {
      (document.getElementById('name') as HTMLInputElement).value = '';
      this.classificationForm.patchValue({ name: '' });
    } else if (key === 'usersStatus') {
      (document.getElementById('usersStatus') as HTMLInputElement).value = '';
      this.classificationForm.patchValue({ usersStatus: '' });
    } else if (key === 'usedService') {
      (document.getElementById('usedService') as HTMLInputElement).value = '';
      this.classificationForm.patchValue({ usedService: '' });
    } else {
      (document.getElementById(key) as HTMLInputElement).value = '';
      this.classificationForm.controls[key].patchValue('');
    }
  }

  /* --------------------- Check Accept --------------------- */
  acceptance(event) {
    console.log(event);
    if (event.checked == true) {
      this.accept = true;
    } else if (event.checked == false) {
      this.accept = false;
    }
  }
  /* ------------------------ Add To All Companies --------------------- */
  addToAllCompanies(event) {
    console.log(event);
    if (event.checked == true) {
      this.addToAllCompany = true;
    } else if (event.checked == false) {
      this.addToAllCompany = false;
    }
  }
  /* ---------------------- Create New Calssifications ------------------------- */
  submitService() {
    console.log({
      name: this.classificationForm.controls.name.value,
      classificationID: this.filterServiceID,
      active: this.filteredStatusId,
      add_to_all: this.addToAllCompany
    });
    this.submitted = true;
    this.startLoading();
    this.coreService
      .superPost('owner/services', {
        name: this.classificationForm.controls.name.value,
        classification_id: this.filterServiceID,
        active: this.filteredStatusId,
        add_to_all: this.addToAllCompany
      })
      .subscribe(
        () => {
          this.showSuccess('تم تسجيل الخدمة بنجاح');
          setTimeout(() => {
            this.router.navigate(['/services/all-services']);
          }, 2500);
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
  updateClassification() {
    this.submitted = true;
    this.startLoading();
    this.coreService
      .superUpdate('owner/services/' + this.updatedID, {
        name: this.classificationForm.controls.name.value,
        classification_id: this.filterServiceID,
        active: this.filteredStatusId,
        add_to_all: this.addToAllCompany
      })
      .subscribe(
        () => {
          this.showSuccess('تم تعديل الخدمة بنجاح');
          setTimeout(() => {
            this.router.navigate(['/services/all-services']);
          }, 2500);
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
  /* ----------------------- Active Status ----------------------- */
  // changeActive(e) {
  //   this.usersForm.patchValue({
  //     active: e.checked
  //   });
  // }
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
    this.submitted = false;
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
    this.submitted = false;
    this.responseState = 'success';
    this.responseData = successText;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
}
