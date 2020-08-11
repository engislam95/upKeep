import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { emptyValidator } from '../../../tools/shared_validators/Empty.validator';
import { LoaderService } from '../../../tools/shared-services/loader.service';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';
import { CoreService } from '../../../tools/shared-services/core.service';
import '@ckeditor/ckeditor5-build-classic/build/translations/ar';
import { fade } from '../../../tools/shared_animations/fade';
@Component({
  selector: 'app-add-classification',
  templateUrl: './add-classification.component.html',
  styleUrls: ['./add-classification.component.scss'],
  animations: [fade]
})
export class AddClassificationComponent implements OnInit {
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
  updatedClassID: any = '';
  accept: boolean = false;
  /* ------------------------ Users Form ------------------------ */
  classificationForm = new FormGroup({
    name: new FormControl('', Validators.required),
    usersStatus: new FormControl(),
    active: new FormControl(''),
  });
  /* ------------------ Constructor ------------------------ */
  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
  }
  /* -------------------- Oninit ------------------------ */
  ngOnInit() {
    /* ------------------ Scrolling ----------------------- */
    window.scroll({ top: 0, behavior: 'auto' });
    /* ------------------ Start Loading ------------------------- */
    this.startLoading();
    // this.statusFilteredOptions = this.classificationForm
    //   .get('usersStatus')
    //   .valueChanges.pipe(
    //     startWith(''),
    //     map(value => this.filterUsersStatus(value))
    //   );
    /* ----------------------- End Loading ---------------------- */
    this.endLoading();

    /* ----------------------------- Update Mode --------------------------- */
    this.activatedRoute.queryParams.subscribe(queryParams => {
      console.log(queryParams)
      if (queryParams.updateMode) {
        this.updateMode = queryParams.updateMode === 'true';
        this.updatedClassID = queryParams.classificationID;
        this.startLoading();
        this.coreService.superGet('owner/classification/show/' + this.updatedClassID).subscribe(classificaion => {
          console.log(classificaion);
          this.classificationForm.controls.name.setValue(classificaion['data'].name);
          this.accept = true;
          this.endLoading();
        });
      }
    });
  }
  /* ------------------- Filter Status ------------------- */
  // filterUsersStatus(value: any) {
  //   if (typeof value === 'object') {
  //     this.filteredStatusId = value.id;
  //   }
  //   if (value === '') {
  //     this.filteredStatusId = '';
  //   }
  //   return this.statusArray.filter(option => option.name.includes(value));
  // }
  // /* ----------------------------- Display Options ---------------------- */
  // displayOptionsFunction(state) {
  //   if (state !== null) {
  //     return state.name;
  //   }
  // }

  /* -------------------- Reset ---------------------- */
  xResetInputs(key) {
    console.log(key)
    if (key === 'name') {
      (document.getElementById('name') as HTMLInputElement).value = '';
      this.classificationForm.patchValue({ name: '' });
    }
    // if (key === 'usersStatus') {
    //   (document.getElementById('usersStatus') as HTMLInputElement).value = '';
    //   this.classificationForm.patchValue({ usersStatus: '' });
    // } 
    else {
      (document.getElementById(key) as HTMLInputElement).value = '';
      this.classificationForm.controls[key].patchValue('');
    }
  }
  /* -------------------- Get User Details ---------------------------- */
  // getUpdatedUserDetails() {
  //   this.coreService.getMethod('users/' + this.updateUserID, {}).subscribe((updatedUser: any) => {
  //     this.updatedUserDataLoaded = true;
  //     this.updatedUserData = updatedUser.data;
  //     // Start End Loading
  //     this.endLoading();
  //     // End End Loading
  //     this.assignUpdatedData();
  //   });
  // }

  /* ------------------------- Assign Updated User Data ---------------------- */
  // assignUpdatedData() {
  //   const data = this.updatedUserData;
  //   this.countryPhoneKey = data.city.country.phone_code;
  //   this.mobileNumber = data.mobile;
  //   this.showCountryPhoneKey = true;
  // }
  /* ----------------------- Update User --------------------------- */
  // onUpdate() {
  //   this.submitted = true;
  //   this.startLoading();
  //   this.coreService.updateMethod('users/' + this.updateUserID, this.usersForm.value).subscribe(
  //     () => {
  //       this.showSuccess('تم تعديل المستخدم بنجاح');
  //       setTimeout(() => {
  //         this.router.navigate(['/users/all-users']);
  //       }, 2500);
  //     },
  //     error => {
  //       if (error.error.errors) {
  //         this.showErrors(error.error.errors);
  //       } else {
  //         this.showErrors(error.error.message);
  //       }
  //     }
  //   );
  // }

  /* --------------------- Check Accept --------------------- */
  acceptance(event) {
    console.log(event);
    if (event.checked == true) {
      this.accept = true;
    }
    else if (event.checked == false) {
      this.accept = false;
    }
  }
  /* ---------------------- Create New Calssifications ------------------------- */
  submitClassifiaction() {
    console.log(this.classificationForm.controls.name.value);
    this.submitted = true;
    this.startLoading();
    this.coreService.superPost('owner/classification/create', { name: this.classificationForm.controls.name.value }).subscribe(
      () => {
        this.showSuccess('تم تسجيل التصنيف بنجاح');
        setTimeout(() => {
          this.router.navigate(['/classifications/all-classifications']);
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
    console.log(this.classificationForm.controls.name.value);
    this.submitted = true;
    this.startLoading();
    this.coreService.superUpdate('owner/classification/update/' + this.updatedClassID, { name: this.classificationForm.controls.name.value }).subscribe(
      () => {
        this.showSuccess('تم تعديل التصنيف بنجاح');
        setTimeout(() => {
          this.router.navigate(['/classifications/all-classifications']);
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
    this.responseStateService.responseState(this.responseState, this.responseData);
  }
  /* ----------------------------- Show Success Messages --------------------- */
  showSuccess(successText) {
    this.endLoading();
    this.submitted = false;
    this.responseState = 'success';
    this.responseData = successText;
    this.responseStateService.responseState(this.responseState, this.responseData);
  }
}
