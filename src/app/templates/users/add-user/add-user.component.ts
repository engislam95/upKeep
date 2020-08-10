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
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  animations: [fade]
})
export class AddUserComponent implements OnInit {
  /* ---------------------- Variables --------------------------- */
  modeTitle: any = 'إضافة مستخدم';
  imagePlaceHolder: any = 'إرفق صورة';
  responseState: any = '';
  responseData: any = '';
  mobileNumber: any;
  countryPhoneKey: any = '';
  updatedUserID: any = '';
  updatedUserData: any = '';
  country_id: any = '';
  city_id: any = '';
  role_id: any = '';
  pageLoaded: boolean = false;
  mainServicesLoaded: boolean = false;
  countriesLoaded: boolean = false;
  showCountryPhoneKey: boolean = false;
  canUpdatePassword: boolean = false;
  mobileReserved: boolean = false;
  mobileCheckLoaded: boolean = false;
  emailReserved: boolean = false;
  emailCheckLoaded: boolean = false;
  submitted: boolean = false;
  updateMode: boolean = false;
  mainServiceArray: any = [];
  countriesArray: any = [];
  rolesArray: any = [];
  companiesArray: any = [];
  citiesArray: any = [];
  countriesFilteredOptions: Observable<any>;
  rolesFilteredOptions: Observable<any>;
  companiesFilteredOptions: Observable<any>;
  citiesFilteredOptions: Observable<any>;
  updatedUserDataLoaded: boolean = false;
  /* ------------------------ Users Form ------------------------ */
  usersForm = new FormGroup({
    name: new FormControl('', Validators.required),
    country_id: new FormControl('', [emptyValidator, Validators.required]),
    mobile: new FormControl(''),
    mobileKey: new FormControl(
      '',
      [Validators.required, Validators.pattern('[0-9]* || [٠-٩]*'), Validators.minLength(9), Validators.maxLength(9)]
    ),
    email: new FormControl('', [
      Validators.email,
      Validators.required,
      Validators.pattern('^[a-zA-Z][a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}')
    ]),
    password: new FormControl({ value: '', disabled: !this.canUpdatePassword }, Validators.required),
    change_password: new FormControl(false),
    active: new FormControl(true),
    image: new FormControl(''),
    imageInput: new FormControl(''),
    role_id: new FormControl('', [emptyValidator, Validators.required]),
    city_id: new FormControl('', [emptyValidator, Validators.required])
  });
  /* ------------------ Constructor ------------------------ */
  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  /* -------------------- Oninit ------------------------ */
  ngOnInit() {
    /* ------------------ Scrolling ----------------------- */
    window.scroll({ top: 0, behavior: 'auto' });
    /* ------------------ Start Loading ------------------------- */
    this.startLoading();
    /* ----------------------- Get All Countries ------------------ */
    this.coreService.getMethod('countries', {}).subscribe((countries: any) => {
      this.countriesArray = countries.data;
      this.countriesLoaded = true;
      /* ------------------------- Filter Countries -------------------------- */
      if (!this.updateMode) {
        this.countriesFilteredOptions = this.usersForm.get('country_id').valueChanges.pipe(
          startWith(''),
          map(value => this.filterCountries(value))
        );
      }
    });
    /* ----------------------- Get All Roles ------------------ */
    this.coreService.getMethod('role/all', {}).subscribe((roles: any) => {
      console.log(roles);
      this.rolesArray = roles;
      /* ------------------------- Filter Roles -------------------------- */
      if (!this.updateMode) {
        this.rolesFilteredOptions = this.usersForm.get('role_id').valueChanges.pipe(
          startWith(''),
          map(value => this.filterRoles(value))
        );
      }
    });
    /* ----------------------- End Loading ---------------------- */
    this.endLoading();
    /* ----------------------------- Update Mode --------------------------- */
    this.activatedRoute.queryParams.subscribe(queryParams => {
      console.log(queryParams);
      if (queryParams.updateMode) {
        this.updateMode = queryParams.updateMode == 'true';
        this.updatedUserID = +queryParams.updatedUserID;
        // Get User Details
        if (this.updateMode) {
          this.getUpdatedUserDetails();
        }
        this.modeTitle = 'تعديل المستخدم';
      } else {
        this.updatedUserDataLoaded = true;
        this.canUpdatePassword = true;
        this.usersForm.controls.password.enable();
      }
    });
  }
  /* ------------------ Check Mobile Unique ------------------------ */
  checkReservation(value, type: string) {
    if (type === 'mobile') {
      value = this.countryPhoneKey + this.mobileNumber;
    }
    this.coreService
      .getMethod(`user/check-unique/${type}`, {
        [type]: value,
        id: this.updateMode ? this.updatedUserData.id : ''
      })
      .subscribe(
        () => {
          if (type === 'mobile') {
            this.mobileReserved = false;
            this.mobileCheckLoaded = true;
          } else {
            this.emailReserved = false;
            this.emailCheckLoaded = true;
          }
        },
        () => {
          if (type === 'mobile') {
            this.mobileReserved = true;
            this.mobileCheckLoaded = true;
          } else {
            this.emailReserved = true;
            this.emailCheckLoaded = true;
          }
        }
      );
  }
  /* -------------------- Reset ---------------------- */
  xResetInputs(key) {
    if (key === 'name') {
      (document.getElementById('name') as HTMLInputElement).value = '';
      this.usersForm.patchValue({ name: '' });
    }
    if (key === 'country_id') {
      (document.getElementById('country_id') as HTMLInputElement).value = '';
      this.usersForm.patchValue({ country_id: '' });
      this.usersForm.patchValue({ country_id_id: '' });
    }
    if (key === 'city_id') {
      (document.getElementById('city_id') as HTMLInputElement).value = '';
      this.usersForm.patchValue({ city_id: '' });
      this.usersForm.patchValue({ city_id: '' });
    }
    if (key === 'mobileKey') {
      (document.getElementById('mobileKey') as HTMLInputElement).value = '';
      this.usersForm.patchValue({ mobile: '' });
    }
    if (key === 'password') {
      (document.getElementById('password') as HTMLInputElement).value = '';
      this.usersForm.patchValue({ password: '' });
    }
    if (key === 'email') {
      (document.getElementById('email') as HTMLInputElement).value = '';
      this.usersForm.patchValue({ email: '' });
    }
    if (key === 'role_id') {
      (document.getElementById('role_id') as HTMLInputElement).value = '';
      this.usersForm.patchValue({ role_id: '' });
      this.usersForm.patchValue({ role_id: '' });
    }
    if (key === 'imageInput') {
      (document.getElementById('imageInput') as HTMLInputElement).value = '';
      this.imagePlaceHolder = ' إرفق صورة';
      this.usersForm.patchValue({ image: '' });
    } else {
      (document.getElementById(key) as HTMLInputElement).value = '';
      this.usersForm.controls[key].patchValue('');
    }
  }
  /* -------------------- Get User Details ---------------------------- */
  getUpdatedUserDetails() {
    this.startLoading();
    this.coreService.getMethod('user/show/' + this.updatedUserID, {}).subscribe((updatedUser: any) => {
      console.log(updatedUser);
      this.updatedUserDataLoaded = true;
      this.updatedUserData = updatedUser;
      // Filter Countreis
      this.countriesFilteredOptions = this.usersForm.get('country_id').valueChanges.pipe(
        startWith(updatedUser.country),
        map(value => this.filterCountries(value))
      );
      // Filter Cities
      this.coreService.getMethod('countries/191/cities', {}).subscribe((cities: any) => {
        console.log(cities);
        this.citiesArray = cities.data;
      });
      this.citiesFilteredOptions = this.usersForm.get('city_id').valueChanges.pipe(
        startWith(updatedUser.city),
        map(value => this.filterCities(value))
      );
      // Filter  Roles
      this.rolesFilteredOptions = this.usersForm.get('role_id').valueChanges.pipe(
        startWith(updatedUser.role),
        map(value => this.filterRoles(value))
      );
      /* ------------- Assign Data -------------------- */
      this.usersForm.controls.image.setValue(updatedUser.image);
      this.usersForm.controls.name.setValue(updatedUser.name);
      this.usersForm.controls.email.setValue(updatedUser.email);
      this.usersForm.controls.password.setValue(updatedUser.password);
      this.usersForm.controls.mobile.setValue(updatedUser.mobileKey);
      this.usersForm.controls.mobileKey.setValue(updatedUser.mobile);
      this.usersForm.controls.country_id.setValue(updatedUser.country);
      this.usersForm.controls.city_id.setValue(updatedUser.city);
      this.usersForm.controls.role_id.setValue(updatedUser.role);
      if (updatedUser.active == 1) {
        this.usersForm.controls.active.setValue(true);
      }
      else if (updatedUser.active == 0) {
        this.usersForm.controls.active.setValue(false);
      }
      this.city_id = updatedUser.city_id;
      this.role_id = updatedUser.role_id;
      this.showCountryPhoneKey = true;
      this.countryPhoneKey = updatedUser.phone_code;
      this.mobileChanged(updatedUser.mobile);
      this.endLoading();

    });
    this.endLoading();
  }

  /* ----------------------- Update User --------------------------- */
  onUpdate() {
    this.usersForm.patchValue({
      mobile: +(this.countryPhoneKey + this.mobileNumber)
    });
    if (this.usersForm.controls.image.value.includes('data:image')) {
      console.log('BASE 64');
    } else {
      console.log(this.usersForm.controls.image.setValue(''));
    }
    this.submitted = true;
    this.startLoading();
    this.coreService.updateMethod('user/update/' + this.updatedUserID, {
      name: this.usersForm.controls.name.value,
      city_id: this.city_id,
      phone: this.usersForm.controls.mobile.value,
      email: this.usersForm.controls.email.value,
      role_id: this.role_id,
      image: this.usersForm.controls.image.value,
      password: this.usersForm.controls.password.value,
      active: this.usersForm.controls.active.value
    }).subscribe(
      () => {
        this.showSuccess('تم تعديل المستخدم بنجاح');
        setTimeout(() => {
          this.router.navigate(['/users/all-users']);
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
  /* --------------------------- Update Password ---------------------- */
  canUpdatePasswordToggle(e) {
    let pw = this.usersForm.controls.password;
    this.canUpdatePassword = e.checked;
    if (this.canUpdatePassword) {
      this.usersForm.patchValue({
        change_password: this.canUpdatePassword
      });
      pw.enable();
    } else {
      this.usersForm.patchValue({
        password: '',
        change_password: this.canUpdatePassword
      });
      pw.disable();
    }
  }
  /* ------------------------- Check Mobile Number Validtion ------------------- */
  mobileChanged(str) {
    this.mobileNumber = Number(
      str
        .replace(/[٠١٢٣٤٥٦٧٨٩]/g, d => {
          return d.charCodeAt(0) - 1632; // Convert Arabic numbers
        })
        .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, d => {
          return d.charCodeAt(0) - 1776; // Convert Persian numbers
        })
    );
  }
  /* ---------------------- Create New User ------------------------- */
  onSubmit() {
    this.usersForm.patchValue({
      mobile: +(this.countryPhoneKey + this.mobileNumber)
    });
    this.submitted = true;
    console.log(this.usersForm.value);
    this.startLoading();
    this.coreService.postMethod('user/create', {
      name: this.usersForm.controls.name.value,
      country_id: this.country_id,
      city_id: this.city_id,
      phone: this.usersForm.controls.mobile.value,
      email: this.usersForm.controls.email.value,
      password: this.usersForm.controls.password.value,
      role_id: this.role_id,
      image: this.usersForm.controls.image.value,
      active: this.usersForm.controls.active.value
    }).subscribe(
      () => {
        this.showSuccess('تم تسجيل المستخدم بنجاح');
        setTimeout(() => {
          this.router.navigate(['/users/all-users']);
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
  /* ------------------------------ Filter Country ------------------------ */
  filterCountries(value: any) {
    if (typeof value === 'object') {
      this.country_id = value.id;
      this.showCountryPhoneKey = true;
      this.countryPhoneKey = value.phone_code;
      /* ----------------------- Get All Cities ------------------ */
      this.coreService.getMethod('countries/191/cities', {}).subscribe((cities: any) => {
        console.log(cities);
        this.citiesArray = cities.data;
        /* ------------------------- Filter Roles -------------------------- */
        if (!this.updateMode) {
          this.citiesFilteredOptions = this.usersForm.get('city_id').valueChanges.pipe(
            startWith(''),
            map(value => this.filterCities(value))
          );
        }
      });
    } else {
      this.showCountryPhoneKey = false;
    }
    if (this.countriesArray !== null) {
      return this.countriesArray.filter(option => option.name.includes(value));
    }
  }
  displayCountries(state) {
    if (state !== null) {
      return state.name;
    }
  }
  /* ------------------------------ Filter Roles ------------------------ */
  filterRoles(value: any) {
    if (typeof value === 'object') {
      this.role_id = value.id;
    }
    // else if (typeof value == 'string') {
    //   const val = value.toLowerCase().trim();
    // }
    return this.rolesArray.filter(option => option.name.toLowerCase().includes(value));
  }
  displayRoles(state) {
    if (state !== null) {
      return state.name;
    }
  }
  /* ------------------------------ Filter Cities ------------------------ */
  filterCities(value: any) {
    if (typeof value == 'object') {
      this.city_id = value.id;
    }
    else if (typeof value == 'string') {
      const val = value.toLowerCase().trim();
      if (this.citiesArray !== null) {
        return this.citiesArray.filter(option => option.name.toLowerCase().includes(val));
      }
    }
  }
  displayCities(state) {
    if (state !== null) {
      return state.name;
    }
  }
  /* ----------------------- Active Status ----------------------- */
  changeActive(e) {
    this.usersForm.patchValue({
      active: e.checked
    });
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
  /* -------------------- Upload Image -------------------------- */
  onUploadImage(e) {
    this.imagePlaceHolder = e[0].name;
    this.usersForm.patchValue({
      image: e[0].base64
    });
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
