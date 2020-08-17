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
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
  animations: [fade]
})
export class AddCompanyComponent implements OnInit {
  /* ---------------------- Variables --------------------------- */
  modeTitle: any = 'إضافة مستخدم';
  imagePlaceHolder: any = 'إرفق صورة';
  responseState: any = '';
  mobileNumber: any;
  responseData: any = '';
  countryPhoneKey: any = '';
  updatedID: any = '';
  updatedUserData: any = '';
  pageLoaded: boolean = false;
  mainServicesLoaded: boolean = false;
  countriesLoaded: boolean = false;
  accept: boolean = false;
  showCountryPhoneKey: boolean = false;
  canUpdatePassword: boolean = false;
  mobileReserved: boolean = false;
  mobileCheckLoaded: boolean = false;
  emailReserved: boolean = false;
  emailCheckLoaded: boolean = false;
  submitted: boolean = false;
  updateMode: boolean = false;
  mainServiceArray: any = [];
  countriesArray = [];
  countriesFilteredOptions: Observable<any>;
  citiesFilteredOptions: Observable<any>;
  ClassiciationFilteredOptions: Observable<any>;
  updatedUserDataLoaded: boolean = false;
  user: any = '';
  citiesArray: any = [];
  todayDate: Date = new Date();
  city_id: any = '';
  filterServiceID: any = '';
  classificationArray: any = [];
  statusArray = [{ name: 'نشط', id: 1 }, { name: 'غير نشط', id: 0 }];
  statusFilteredOptions: Observable<any>;
  filteredStatusId: any = '';
  orderDate: any = '';
  currencyFilteredOptions: Observable<any>;
  currencyArray: any = [];
  filteredCurrencyId: any = '';
  timeZoneFilteredOptions: Observable<any>;
  timeZoneArray: any = [];
  filteredTimeZoneId: any = '';
  adminResevered: boolean = false;
  company: any = '';
  delete_image: boolean = false;
  /* ------------------------ Users Form ------------------------ */
  companyForm = new FormGroup({
    name: new FormControl('', Validators.required),
    username: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z][a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}')
    ]),
    city_id: new FormControl('', [emptyValidator, Validators.required]),
    address: new FormControl('', [Validators.required]),
    admin: new FormControl('', [Validators.required]),
    usedService: new FormControl('', [Validators.required]),
    website: new FormControl('', [Validators.required]),
    slug: new FormControl('', [Validators.required]),
    userStatus: new FormControl('', [Validators.required]),
    currency_id: new FormControl('', [Validators.required]),
    timeZone: new FormControl('', [Validators.required]),
    commerceNo: new FormControl('', [Validators.required]),
    password: new FormControl(
      { value: '', disabled: !this.canUpdatePassword },
      [Validators.required, Validators.minLength(8)]
    ),
    change_password: new FormControl(false),
    rePassword: new FormControl(
      { value: '', disabled: !this.canUpdatePassword },
      [Validators.required, Validators.minLength(8)]
    ),
    order_date: new FormControl(''),
    orderDateObj: new FormControl('', [Validators.required]),
    mobile: new FormControl(''),
    mobileKey: new FormControl(
      '', //
      [
        Validators.required,
        Validators.pattern('[0-9]* || [٠-٩]*'),
        Validators.minLength(9),
        Validators.maxLength(9)
      ]
    ),
    email: new FormControl('', [
      Validators.email,
      Validators.required,
      Validators.pattern('^[a-zA-Z][a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}')
    ]),
    active: new FormControl(true),
    image: new FormControl(''),
    imageInput: new FormControl('')
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
    // Filter Cities
    this.coreService
      .getMethod('countries/191/cities', {})
      .subscribe((cities: any) => {
        console.log(cities);
        this.citiesArray = cities.data;
      });
    setTimeout(() => {
      this.citiesFilteredOptions = this.companyForm
        .get('city_id')
        .valueChanges.pipe(
          startWith(''),
          map(value => this.filterCities(value))
        );
    }, 2000);
    /* ----------------------- Get All Countries ------------------ */
    this.coreService.getMethod('countries', {}).subscribe((countries: any) => {
      console.log(countries);
      this.countriesArray = countries.data;
      this.countryPhoneKey = countries['data'][0]['phone_code'];
      this.showCountryPhoneKey = true;
    });
    /* --------------------- Get Classifications ------------------------- */
    this.coreService
      .superGet('owner/classification/all')
      .subscribe(classification => {
        console.log(classification);
        this.classificationArray = classification;
        this.ClassiciationFilteredOptions = this.companyForm
          .get('usedService')
          .valueChanges.pipe(
            startWith(''),
            map(value => this.filterService(value))
          );
      });
    /* ------------------------ Get Currencey ----------------------- */
    this.coreService.superGet('currency').subscribe(currecny => {
      console.log(currecny);
      this.currencyArray = currecny['data'];
      this.currencyFilteredOptions = this.companyForm
        .get('currency_id')
        .valueChanges.pipe(
          startWith(''),
          map(value => this.filterCurrencey(value))
        );
    });
    /* ------------------------ Get Time Zone ----------------------- */
    this.coreService.superGet('timezone').subscribe(time => {
      console.log(time);
      this.timeZoneArray = time['data'];
      this.timeZoneFilteredOptions = this.companyForm
        .get('timeZone')
        .valueChanges.pipe(
          startWith(''),
          map(value => this.filterTimeZone(value))
        );
    });
  }
  /* -------------------- Oninit ------------------------ */
  ngOnInit() {
    /* ------------------ Scrolling ----------------------- */
    window.scroll({ top: 0, behavior: 'auto' });
    /* ------------------ Start Loading ------------------------- */
    this.startLoading();
    /* ----------------------- Filter Status --------------------- */
    this.statusFilteredOptions = this.companyForm
      .get('userStatus')
      .valueChanges.pipe(
        startWith(''),
        map(value => this.filterUsersStatus(value))
      );
    /* ----------------------- End Loading ---------------------- */
    this.endLoading();

    /* ----------------------------- Update Mode --------------------------- */
    this.activatedRoute.queryParams.subscribe(queryParams => {
      console.log(queryParams);
      if (queryParams.updateMode == 'true') {
        this.updateMode = queryParams.updateMode === 'true';
        this.updatedID = +queryParams.companyId;
        this.coreService
          .superGet('owner/company/show/' + this.updatedID)
          .subscribe(company => {
            console.log(company);
            this.company = company;
            this.filteredCurrencyId = company['currency']['id'];
            console.log(this.filteredCurrencyId);
            this.companyForm.controls.name.setValue(company['name']);
            this.companyForm.controls.slug.setValue(company['slug']);
            this.companyForm.controls.address.setValue(company['address']);
            this.companyForm.controls.website.setValue(company['website']);
            this.companyForm.controls.mobile.setValue(company['phone']);
            this.companyForm.controls.timeZone.setValue(company['timezone']);
            console.log(company['phone']);
            console.log(
              company['phone']
                .split('')
                .slice(3)
                .join('')
            );
            this.mobileNumber = company['phone']
              .split('')
              .slice(3)
              .join('');
            console.log(this.mobileNumber);
            this.companyForm.controls.mobileKey.setValue(
              company['phone']
                .split('')
                .slice(3)
                .join('')
            );
            this.companyForm.controls.email.setValue(company['email']);
            this.companyForm.controls.commerceNo.setValue(
              company['commercial_register']
            );
            this.companyForm.controls.username.setValue(
              company['super_admin'][0]['email']
            );
            this.companyForm.controls.admin.setValue(
              company['super_admin'][0]['email']
            );
            this.companyForm.controls.orderDateObj.setValue(
              company['end_date']
            );
            this.filterServiceID = company['classification']['id'];
            this.filteredStatusId = company['active'];
            this.accept = true;
            this.companyForm.controls.image.setValue('');
            this.city_id = company['city']['id'];
            this.filteredTimeZoneId = company['timezone'];
            this.orderDate = company['end_date'];
          });
      } else {
        this.updatedUserDataLoaded = true;
        this.canUpdatePassword = true;
        this.companyForm.controls.password.enable();
        this.companyForm.controls.rePassword.enable();
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
    if (value === '' && !this.updateMode) {
      this.filterServiceID = '';
    }
    return this.classificationArray.filter(option =>
      option.name.includes(value)
    );
  }
  /* ----------------------------- Filter Currency --------------------------- */
  filterCurrencey(value: any) {
    if (typeof value === 'object') {
      this.filteredCurrencyId = value.id;
    }
    if (value === '' && !this.updateMode) {
      this.filteredCurrencyId = '';
    }
    return this.currencyArray.filter(option => option.name.includes(value));
  }
  /* ----------------------- Filter Time Zone ------------------------ */
  filterTimeZone(value: any) {
    if (typeof value === 'string' && !this.updateMode) {
      this.filteredTimeZoneId = value;
    }
    if (value === '' && !this.updateMode) {
      this.filteredTimeZoneId = '';
    }
    return this.timeZoneArray.filter(option => option.includes(value));
  }
  /* ------------------------ Display Option ----------------------------- */
  displayOptionsFunction(state) {
    if (state !== null) {
      return state.name;
    }
  }
  /* ------------------------- Display Time ---------------------- */
  displayTime(state) {
    if (state != null) {
      return state;
    }
  }
  /* ------------------------------ Filter Cities ------------------------ */
  filterCities(value: any) {
    if (typeof value == 'object') {
      this.city_id = value.id;
    } else if (typeof value == 'string') {
      const val = value.toLowerCase().trim();
      if (this.citiesArray !== null) {
        return this.citiesArray.filter(option =>
          option.name.toLowerCase().includes(val)
        );
      }
    }
  }
  /* ------------------ Check Mobile Unique ------------------------ */
  checkReservation(value, type: string) {
    if (type === 'phone') {
      value = this.countryPhoneKey + this.mobileNumber;
    }
    this.coreService
      .superGet(`owner/company/check-unique/${type}`, {
        [type]: value,
        id: this.updateMode ? this.updatedUserData.id : ''
      })
      .subscribe(
        () => {
          if (type === 'phone') {
            this.mobileReserved = false;
            this.mobileCheckLoaded = true;
          } else {
            this.emailReserved = false;
            this.emailCheckLoaded = true;
          }
        },
        () => {
          if (type === 'phone') {
            this.mobileReserved = true;
            this.mobileCheckLoaded = true;
          } else {
            this.emailReserved = true;
            this.emailCheckLoaded = true;
          }
        }
      );
  }
  /* --------------------- Check Email Admain ------------------ */
  checkRese(value) {
    this.coreService
      .superGet('owner/company/check-superadmin/email', {
        email: value,
        id: this.updateMode ? this.updatedUserData.id : ''
      })
      .subscribe(
        () => {
          this.adminResevered = false;
        },
        () => {
          this.adminResevered = true;
        }
      );
  }
  /* -------------------- Reset ---------------------- */
  xResetInputs(key) {
    if (key === 'name') {
      (document.getElementById('name') as HTMLInputElement).value = '';
      this.companyForm.patchValue({ name: '' });
    }
    if (key === 'address') {
      (document.getElementById('address') as HTMLInputElement).value = '';
      this.companyForm.patchValue({ address: '' });
    }
    if (key === 'city') {
      (document.getElementById('city') as HTMLInputElement).value = '';
      this.companyForm.patchValue({ city: '' });
      this.companyForm.patchValue({ city: '' });
    }
    if (key === 'mobileKey') {
      (document.getElementById('mobileKey') as HTMLInputElement).value = '';
      this.companyForm.patchValue({ mobile: '' });
    }
    if (key === 'password') {
      (document.getElementById('password') as HTMLInputElement).value = '';
      this.companyForm.patchValue({ password: '' });
    }
    if (key === 'email') {
      (document.getElementById('email') as HTMLInputElement).value = '';
      this.companyForm.patchValue({ email: '' });
    }
    if (key === 'imageInput') {
      (document.getElementById('imageInput') as HTMLInputElement).value = '';
      this.imagePlaceHolder = ' إرفق صورة';
      this.companyForm.patchValue({ image: '' });
    } else {
      (document.getElementById(key) as HTMLInputElement).value = '';
      this.companyForm.controls[key].patchValue('');
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
  /* --------------------------- Date ------------------------------- */
  orderDateChanged(event, ...mode) {
    let orderDateArray;
    let orderDate;
    if (mode[0] === 'updateMode') {
      orderDateArray = event.split('-');
      orderDate =
        orderDateArray[0] + '/' + orderDateArray[1] + '/' + orderDateArray[2];
      this.companyForm.patchValue({
        order_date: orderDate
        // orderDateObj: this.updatedOrderData.order_date
      });
    } else {
      orderDateArray = event.targetElement.value.split('/');
      orderDate =
        orderDateArray[2] + '/' + orderDateArray[0] + '/' + orderDateArray[1];
      this.companyForm.patchValue({
        order_date: orderDate
      });
    }
    this.orderDate = orderDate;
    console.log(this.orderDate);
  }

  /* ------------------------- Assign Updated User Data ---------------------- */
  assignUpdatedData() {
    const data = this.updatedUserData;
    this.countryPhoneKey = data.city.country.phone_code;
    this.mobileNumber = data.mobile;
    this.mobileChanged(data.mobile);
    this.companyForm.patchValue({
      name: data.name,
      email: data.email,
      mobile: +(this.countryPhoneKey + data.mobile),
      mobileKey: data.mobile,
      country: data.city.country,
      active: data.active === 1 ? true : false
    });
    this.showCountryPhoneKey = true;
  }
  displayCities(state) {
    if (state !== null) {
      return state.name;
    }
  }
  /* --------------------------- Update Password ---------------------- */
  canUpdatePasswordToggle(e) {
    let pw = this.companyForm.controls.password;
    let repw = this.companyForm.controls.rePassword;
    this.canUpdatePassword = e.checked;
    if (this.canUpdatePassword) {
      this.companyForm.patchValue({
        change_password: this.canUpdatePassword
      });
      pw.enable();
      repw.enable();
    } else {
      this.companyForm.patchValue({
        password: '',
        rePassword: '',
        change_password: this.canUpdatePassword
      });
      pw.disable();
      repw.disable();
    }
  }
  /* ------------------ Username ------------------------ */
  sameUsername(event) {
    if (event.checked == true) {
      this.companyForm.controls.username.setValue(
        this.companyForm.controls.email.value
      );
    }
  }
  /* ------------------------- Delete Image --------------------------- */
  deleteIMG() {
    this.company.image = '';
    this.companyForm.controls.image.setValue('');
    this.delete_image = true;
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
  submitCompany() {
    this.companyForm.patchValue({
      mobile: +(this.countryPhoneKey + this.mobileNumber)
    });
    this.submitted = true;
    console.log({
      name: this.companyForm.controls.name.value,
      currency_id: this.filteredCurrencyId,
      slug: this.companyForm.controls.slug.value,
      smsName: '',
      timezone: this.filteredTimeZoneId,
      phone: +(this.countryPhoneKey + this.mobileNumber),
      last_receipt_number: '',
      city_id: this.city_id,
      address: this.companyForm.controls.address.value,
      active: this.filteredStatusId,
      end_date: this.orderDate,
      classification_id: this.filterServiceID,
      logo: this.companyForm.controls.image.value,
      website: this.companyForm.controls.website.value,
      commercial_register: this.companyForm.controls.commerceNo.value,
      admin_email: this.companyForm.controls.username.value,
      email: this.companyForm.controls.email.value,
      admin_password: this.companyForm.controls.password.value,
      password_confirmation: this.companyForm.controls.rePassword.value
    });
    this.startLoading();
    this.coreService
      .superPost('owner/company/create', {
        name: this.companyForm.controls.name.value,
        currency_id: this.filteredCurrencyId,
        slug: this.companyForm.controls.slug.value,
        smsName: '',
        timezone: this.filteredTimeZoneId,
        phone: +(this.countryPhoneKey + this.mobileNumber),
        last_receipt_number: '',
        city_id: this.city_id,
        address: this.companyForm.controls.address.value,
        active: this.filteredStatusId,
        end_date: this.orderDate,
        classification_id: this.filterServiceID,
        logo: this.companyForm.controls.image.value,
        website: this.companyForm.controls.website.value,
        commercial_register: this.companyForm.controls.commerceNo.value,
        admin_email: this.companyForm.controls.username.value,
        email: this.companyForm.controls.email.value,
        admin_password: this.companyForm.controls.password.value,
        password_confirmation: this.companyForm.controls.rePassword.value,
        admin: this.companyForm.controls.admin.value
      })
      .subscribe(
        () => {
          this.showSuccess('تم تسجيل الشركة بنجاح');
          setTimeout(() => {
            this.router.navigate(['/companies/all-companies']);
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
  updateCompany() {
    this.submitted = true;
    console.log(this.countryPhoneKey);
    console.log(this.mobileNumber);

    console.log({
      name: this.companyForm.controls.name.value,
      currency_id: this.filteredCurrencyId,
      slug: this.companyForm.controls.slug.value,
      smsName: '',
      timezone: this.filteredTimeZoneId,
      phone: +(this.countryPhoneKey + this.mobileNumber),
      last_receipt_number: '',
      city_id: this.city_id,
      address: this.companyForm.controls.address.value,
      active: this.filteredStatusId,
      end_date: this.orderDate,
      classification_id: this.filterServiceID,
      logo: this.companyForm.controls.image.value,
      website: this.companyForm.controls.website.value,
      commercial_register: this.companyForm.controls.commerceNo.value,
      admin_email: this.companyForm.controls.username.value,
      email: this.companyForm.controls.email.value,
      admin_password: this.companyForm.controls.password.value,
      password_confirmation: this.companyForm.controls.rePassword.value,
      admin: this.companyForm.controls.admin.value
    });
    this.startLoading();
    this.coreService
      .superUpdate('owner/company/update/' + this.updatedID + '/' + this.company['super_admin'][0]['id'], {
        name: this.companyForm.controls.name.value,
        currency_id: this.filteredCurrencyId,
        slug: this.companyForm.controls.slug.value,
        smsName: '',
        timezone: this.filteredTimeZoneId,
        phone: +(this.countryPhoneKey + this.mobileNumber),
        last_receipt_number: '',
        city_id: this.city_id,
        address: this.companyForm.controls.address.value,
        active: this.filteredStatusId,
        end_date: this.orderDate,
        classification_id: this.filterServiceID,
        logo: this.companyForm.controls.image.value,
        website: this.companyForm.controls.website.value,
        commercial_register: this.companyForm.controls.commerceNo.value,
        admin_email: this.companyForm.controls.username.value,
        email: this.companyForm.controls.email.value,
        admin_password: this.companyForm.controls.password.value,
        password_confirmation: this.companyForm.controls.rePassword.value,
        delete_image: this.delete_image,
        admin: this.companyForm.controls.admin.value,
      })
      .subscribe(
        () => {
          this.showSuccess('تم تعديل الشركة بنجاح');
          setTimeout(() => {
            this.router.navigate(['/companies/all-companies']);
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
  changeActive(e) {
    this.companyForm.patchValue({
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
    this.companyForm.patchValue({
      image: e[0].base64
    });
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
