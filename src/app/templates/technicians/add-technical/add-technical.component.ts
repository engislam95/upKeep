import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { fade } from '../../../tools/shared_animations/fade';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { emptyValidator } from '../../../tools/shared_validators/Empty.validator';
import { LoaderService } from '../../../tools/shared-services/loader.service';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';
import { CoreService } from '../../../tools/shared-services/core.service';

@Component({
  selector: 'app-add-technical',
  templateUrl: './add-technical.component.html',
  styleUrls: ['./add-technical.component.scss'],
  animations: fade
})
export class AddTechnicalComponent implements OnInit {
  modeTitle = 'إضافة فنى';
  //  ################################### Start General Data ###################################
  responseState;
  responseData;
  uploadedImage;
  imagePlaceHolder = 'إرفق صورة';
  imagePlaceHolderPin = 'إرفق دبوس';
  pageLoaded = false;
  mainServicesLoaded = false;
  countriesLoaded = false;
  showCountryPhoneKey = false;
  countryPhoneKey = '';
  mobileNumber;
  canUpdatePassword = false;
  // mobile & email reservation
  mobileReserved = false;
  mobileCheckLoaded = false;
  emailReserved = false;
  emailCheckLoaded = false;
  imageUpdated = false;
  imageUpdated2 = false;
  // mobile & email reservation
  //  ############################ End General Data ############################
  //  ############################ Start Form Data ############################
  techniciansForm = new FormGroup({
    name: new FormControl('', Validators.required),
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
      Validators.pattern('^[a-zA-Z][a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}')
    ]),
    password: new FormControl(
      { value: '', disabled: !this.canUpdatePassword },
      Validators.required
    ),
    service_id: new FormControl(),
    serviceObj: new FormControl('', [emptyValidator, Validators.required]),
    countriesObj: new FormControl('', [emptyValidator, Validators.required]),
    change_password: new FormControl(false),
    active: new FormControl(true),
    image: new FormControl(''),
    imagePin: new FormControl(''),
    imageInputObj: new FormControl(''),
    imageInputObjPin: new FormControl(''),
    delete_image: new FormControl(false),
    delete_pin: new FormControl(false),
    city_tech_id: new FormControl('')
  });
  submitted = false;
  //  ############################ End Form Data ############################
  //  ###################### Start Select Main Services ######################
  mainServiceArray = [];
  mainServiceFilteredOptions: Observable<any>;
  citiesFilteredOptions: Observable<any>;
  //  ###################### End Select Main Services ######################
  //  ###################### Start Select Country ######################
  countriesArray = [];
  countriesFilteredOptions: Observable<any>;
  //  ###################### End Select Country ######################
  //  ############################ Start Update Data ############################
  updateMode = false;
  updatedTechnicalId;
  updatedTechnicalDataLoaded = false;
  updatedTechnicalData = '';
  technician_add: boolean = false;
  technician_all: boolean = false;
  technician_update: boolean = false;
  technician_delete: boolean = false;
  user: any = '';
  technicians: any = [];
  citiesArray = [];
  city_tech_id = '';
  //  ############################ End Update Data ############################
  constructor(
    //
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.user);
    this.technicians = this.user.modules.technicians;
    if (this.technicians) {
      this.technicians.map(ele => {
        switch (ele) {
          case 'add':
            this.technician_add = true;
            break;
          case 'all':
            this.technician_all = true;
            break;
          case 'update':
            this.technician_update = true;
            break;
          case 'delete':
            this.technician_delete = true;
            break;
        }
      });
    }
    this.coreService.getMethod('cities', {}).subscribe((cities: any) => {
      this.citiesArray = cities.data;
      console.log(this.citiesArray);
      this.citiesFilteredOptions = this.techniciansForm
        .get('city_tech_id')
        .valueChanges.pipe(
          startWith(''),
          map(value => this.filterCities(value))
        );
    });
  }
  filterCities(value: any) {
    if (typeof value === 'object') {
      this.city_tech_id = value.id;
    }

    if (this.citiesArray !== null) {
      return this.citiesArray.filter(option => option.name.includes(value));
    }
  }
  /* -------------------------- Display ----------------------------- */
  displayOptionsFunction(state) {
    if (state !== null && state !== undefined) {
      return state.name;
    }
  }
  //  ################################### Start OnInit ###################################
  ngOnInit() {
    window.scroll({ top: 0, behavior: 'auto' });
    // Start START Loading
    this.startLoading();
    // End START Loading
    // Start Get All Services
    this.coreService
      .getMethod('services/active', {})
      .subscribe((services: any) => {
        this.mainServiceArray = services.data;
        this.mainServicesLoaded = true;
        // Start End Loading
        this.endLoading();
        // End End Loading
        // Start Select Search For Main Services
        this.mainServiceFilteredOptions = this.techniciansForm
          .get('serviceObj')
          .valueChanges.pipe(
            startWith(''),
            map(value => this.filterMainService(value))
          );
        // End Select Search For Main Services
      });
    // End Get All Services
    //  Start Get Countries
    this.coreService.getMethod('countries', {}).subscribe((countries: any) => {
      this.countriesArray = countries.data;
      this.countriesLoaded = true;
      // Start End Loading
      this.endLoading();
      // End End Loading
      if (!this.updateMode) {
        // Start Select Search For Main Services
        this.countriesFilteredOptions = this.techniciansForm
          .get('countriesObj')
          .valueChanges.pipe(
            startWith(''),
            map(value => this.filterCountries(value))
          );
        // End Select Search For Main Services
      }
    });
    //  End Get Countries
    // Start Update Mode
    this.activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.updateMode) {
        this.updateMode = queryParams.updateMode === 'true';
        this.updatedTechnicalId = +queryParams.updatedTechnicalId;
        // Get Order Details
        if (this.updateMode) {
          this.getUpdatedTechnicalDetails();
        }
        this.modeTitle = 'تعديل الفنى';
        // Get Order Details
      } else {
        // end loading in add technicians
        this.updatedTechnicalDataLoaded = true;
        this.canUpdatePassword = true;
        this.techniciansForm.controls.password.enable();
      }
    });
    // Start Update Mode
  }
  //  ################################### Start OnInit ###################################
  //  ################### Start Check Mobile & Email Reservation ###################
  checkReservation(value, type: string) {
    // convert number from arabic
    if (type === 'mobile') {
      value = this.countryPhoneKey + this.mobileNumber;
    }
    // convert number from arabic
    this.coreService
      .getMethod(`technicians/check-unique/${type}`, {
        [type]: value,
        id: this.updateMode ? this.updatedTechnicalData['id'] : ''
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
  //  ################### Start Check Mobile & Email Reservation ###################
  //  ############################# Start X Reset Inputs #############################
  xResetInputs(key) {
    if (key === 'name') {
      (document.getElementById('name') as HTMLInputElement).value = '';
      this.techniciansForm.patchValue({ name: '' });
    }
    if (key === 'countriesObj') {
      (document.getElementById('countriesObj') as HTMLInputElement).value = '';
      this.techniciansForm.patchValue({ country: '' });
      this.techniciansForm.patchValue({ country_id: '' });
    }
    if (key === 'mobileKey') {
      (document.getElementById('mobileKey') as HTMLInputElement).value = '';
      this.techniciansForm.patchValue({ mobile: '' });
    }
    if (key === 'serviceObj') {
      (document.getElementById('serviceObj') as HTMLInputElement).value = '';
      this.techniciansForm.patchValue({ service: '' });
      this.techniciansForm.patchValue({ service_id: '' });
    }
    if (key === 'password') {
      (document.getElementById('password') as HTMLInputElement).value = '';
      this.techniciansForm.patchValue({ password: '' });
    }
    if (key === 'city_tech_id') {
      (document.getElementById('password') as HTMLInputElement).value = '';
      this.techniciansForm.patchValue({ city_tech_id: '' });
      this.city_tech_id = '';
    }
    if (key === 'email') {
      (document.getElementById('email') as HTMLInputElement).value = '';
      this.techniciansForm.patchValue({ email: '' });
    }
    if (key === 'imageInputObjPin') {
      (document.getElementById('imageInputObjPin') as HTMLInputElement).value =
        '';
      this.imagePlaceHolderPin = ' إرفق صورة';
      this.techniciansForm.patchValue({ imagePin: '' });
    }
    if (key === 'imageInputObj') {
      (document.getElementById('imageInputObj') as HTMLInputElement).value = '';
      this.imagePlaceHolder = ' إرفق صورة';
      this.techniciansForm.patchValue({ image: '' });
    } else {
      (document.getElementById(key) as HTMLInputElement).value = '';
      this.techniciansForm.controls[key].patchValue('');
    }
  }
  //  ############################# End X Reset Inputs #############################
  //  ############################# Start Get Technical Details #############################
  getUpdatedTechnicalDetails() {
    this.coreService
      .getMethod('technicians/' + this.updatedTechnicalId, {})
      .subscribe((updatedTechnical: any) => {
        this.updatedTechnicalDataLoaded = true;
        this.updatedTechnicalData = updatedTechnical.data;
        console.log(this.updatedTechnicalData);
        // Start End Loading
        this.endLoading();
        // End End Loading
        this.assignUpdatedData();
      });
  }
  //  ############################# End Get Technical Details #############################
  //  ############################# End Assign Updated Data #############################
  assignUpdatedData() {
    const data = this.updatedTechnicalData;
    this.countryPhoneKey = data['city'].country.phone_code;
    this.mobileNumber = data['mobile'];
    // Start Select Search For Main Services
    this.countriesFilteredOptions = this.techniciansForm
      .get('countriesObj')
      .valueChanges.pipe(
        startWith(data['city'].country),
        map(value => this.filterCountries(value))
      );
    // End Select Search For Main Services
    this.mobileChanged(data['mobile']);
    this.city_tech_id = data['city']['id'];
    this.techniciansForm.patchValue({
      // image: data.image,
      // imagePin:data.imagePin ,
      name: data['name'],
      email: data['email'],
      mobile: +(this.countryPhoneKey + data['mobile']),
      mobileKey: data['mobile'],
      countriesObj: data['city'].country,
      service_id: data['service'].id,
      serviceObj: data['service'],
      city_tech_id: data['city']['id'],
      active: data['active'] === 1 ? true : false
    });
    this.imagePlaceHolder = data['image'];
    this.imagePlaceHolderPin = data['imagePin'];
    this.showCountryPhoneKey = true;
  }
  //  ############################# End Assign Updated Data #############################
  //  ######################### Start OnUpdate Form #########################
  onUpdate() {
    this.techniciansForm.controls.city_tech_id.setValue(this.city_tech_id);
    this.techniciansForm.patchValue({
      mobile: +(this.countryPhoneKey + this.mobileNumber)
    });
    this.submitted = true;
    this.startLoading();
    this.coreService
      .updateMethod(
        'technicians/' + this.updatedTechnicalId,
        this.techniciansForm.value
      )
      .subscribe(
        () => {
          this.showSuccess('تم تعديل الفني بنجاح');
          setTimeout(() => {
            this.router.navigate(['/technicians/all-technicians']);
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

  deleteIMG() {
    this.imageUpdated2 = true;
    this.updatedTechnicalData['image'] = '';
    this.techniciansForm.controls.image.setValue('');
    this.imagePlaceHolder = ' إرفق صورة';
    this.techniciansForm.patchValue({ image: '' });
    this.techniciansForm.controls.delete_image.setValue(true);
  }
  deleteIMGPin() {
    this.imageUpdated = true;
    this.updatedTechnicalData['imagePin'] = '';
    this.techniciansForm.controls.imagePin.setValue('');
    this.imagePlaceHolderPin = ' إرفق صورة';
    this.techniciansForm.patchValue({ imagePin: '' });
    this.techniciansForm.controls.delete_pin.setValue(true);
  }

  //  ######################### Start OnUpdate Form #########################
  //  ######################### Start Can Update Password Function #########################
  canUpdatePasswordToggle(e) {
    let pw = this.techniciansForm.controls.password;
    this.canUpdatePassword = e.checked;
    if (this.canUpdatePassword) {
      this.techniciansForm.patchValue({
        change_password: this.canUpdatePassword
      });
      pw.enable();
    } else {
      this.techniciansForm.patchValue({
        password: '',
        change_password: this.canUpdatePassword
      });
      pw.disable();
    }
  }

  //  ######################### End Can Update Password Function #########################
  // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  //            DONE SECTION
  // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  //  ######################### Start Mobile Changed #########################
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
  //  ######################### Start Mobile Changed #########################
  //  ######################### Start OnSubmit Form #########################
  onSubmit() {
    this.techniciansForm.controls.city_tech_id.setValue(this.city_tech_id);
    this.techniciansForm.patchValue({
      mobile: +(this.countryPhoneKey + this.mobileNumber)
    });
    this.submitted = true;
    this.startLoading();
    this.coreService
      .postMethod('technicians', this.techniciansForm.value)
      .subscribe(
        () => {
          this.showSuccess('تم تسجيل الفني بنجاح');
          setTimeout(() => {
            this.router.navigate(['/technicians/all-technicians']);
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
  //  ######################### End OnSubmit Form #########################
  //  ######################### Start Filter Services #########################
  filterMainService(value: any) {
    if (value !== '') {
      this.techniciansForm.patchValue({
        service_id: value.id
      });
    }
    if (this.mainServiceArray !== null) {
      return this.mainServiceArray.filter(option =>
        option.name.includes(value)
      );
    }
  }
  displayMainServices(state) {
    if (state !== null) {
      return state.name;
    }
  }
  //  ######################### End Filter Services #########################
  //  ######################### Start Filter Countries #########################
  filterCountries(value: any) {
    if (typeof value === 'object') {
      this.showCountryPhoneKey = true;
      this.countryPhoneKey = value.phone_code;
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
  //  ######################### End Filter Countries #########################
  //  ######################### Start Change Active State #########################
  changeActive(e) {
    this.techniciansForm.patchValue({
      active: e.checked
    });
  }
  //  ######################### End Change Active State #########################
  //  ######################### Start Loading Functions #########################
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  endLoading() {
    if (
      this.mainServicesLoaded &&
      this.countriesLoaded &&
      this.updatedTechnicalDataLoaded
    ) {
      this.pageLoaded = true;
      this.loaderService.endLoading();
    }
  }
  //  ######################### End Loading Functions #########################
  //  ######################### Start Handle Image Base64 #########################
  onUploadImage(e) {
    this.imagePlaceHolder = e[0].name;
    this.techniciansForm.patchValue({
      image: e[0].base64
    });
    this.imageUpdated2 = false;
    this.techniciansForm.controls.delete_image.setValue(false);
  }

  onUploadImagePin(e) {
    this.imagePlaceHolderPin = e[0].name;
    this.techniciansForm.patchValue({
      imagePin: e[0].base64
    });
    this.imageUpdated = false;
    this.techniciansForm.controls.delete_pin.setValue(false);
  }
  //  ######################### End Handle Image Base64 #########################
  //  ######################### Start Response Messeges #########################
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
  //  ######################### End Response Messeges #########################
}
