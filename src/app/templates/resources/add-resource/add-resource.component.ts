import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { fade } from '../../../tools/shared_animations/fade';

import { LoaderService } from '../../../tools/shared-services/loader.service';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';
import { CoreService } from '../../../tools/shared-services/core.service';
import { emptyValidator } from '../../../tools/shared_validators/Empty.validator';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.scss'],
  animations: fade
})
export class AddResourceComponent implements OnInit {
  modeTitle = 'إضافة مصدر';
  //  ############################ Start General Data ############################
  responseState;
  responseData;
  imagePlaceHolder = 'إرفق لوجو';
  pageLoaded = false;
  countriesLoaded = false;
  mainServicesLoaded = false;
  citiesLoaded = false;
  resourceTypesLoaded = false;
  showCountryPhoneKey = false;
  countryPhoneKey = '';
  mobileNumber;
  // mobile & email reservation
  mobileReserved = false;
  mobileCheckLoaded = false;
  emailReserved = false;
  emailCheckLoaded = false;
  // mobile & email reservation
  //  ############################ End General Data ############################
  //  ############################ Start Form Data ############################
  resourcesForm = new FormGroup({
    name: new FormControl('', Validators.required),
    location: new FormControl(''),
    address: new FormControl('', Validators.required),
    city_id: new FormControl(),
    citiesObj: new FormControl('', [emptyValidator, Validators.required]),
    country: new FormControl(),
    countriesObj: new FormControl('', [emptyValidator, Validators.required]),
    website: new FormControl(''),
    fax: new FormControl(),
    email: new FormControl('', [Validators.email, Validators.required]),
    type: new FormControl(),
    imageInputObj: new FormControl(''),
    resourceTypesObj: new FormControl('', [emptyValidator, Validators.required]),
    phone: new FormControl(''),
    mobileKey: new FormControl(
      '', //
      [Validators.required, Validators.pattern('[0-9]* || [٠-٩]*'), Validators.minLength(9), Validators.maxLength(9)]
    ),
    logo: new FormControl(''),
    services: new FormControl([]),
    active: new FormControl(true)
  });
  submitted = false;
  //  ############################ End Form Data ############################
  //  ###################### Start Select Country ######################
  countriesArray = [];
  countriesFilteredOptions: Observable<any>;
  //  ###################### End Select Country ######################
  //  ###################### Start Select City ######################
  citiesArray = [];
  citiesFilteredOptions: Observable<any>;
  //  ###################### End Select City ######################
  //  ###################### Start Select Resource Types ######################
  resourceTypesArray = [];
  resourceTypesFilteredOptions: Observable<any>;
  //  ###################### End Select Resource Types ######################
  //  ###################### Start Services Data ######################
  mainServiceArray = [];
  showCheckboxesStatus = false;
  //  ###################### End Services Data ######################
  //  ############################ Start Update Data ############################
  updateMode = false;
  updatedResourceId;
  updatedResourceDataLoaded = false;
  updatedResourceData;
  user: any = '';
  resource_add: boolean = false;
  resources_all: boolean = false;
  resources_update: boolean = false;
  resources_delete: boolean = false;
  resoureces: any = [];
  //  ############################ End Update Data ############################
  constructor(
    //
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    this.resoureces = this.user.modules.resources;
    if (this.resoureces) {
      this.resoureces.map(ele => {
        switch (ele) {
          case 'create': this.resource_add = true;
            break;
          case 'all': this.resources_all = true;
            break;
          case 'delete': this.resources_delete = true;
            break;
          case 'update': this.resources_update = true;
            break;
        }
      });
    }
  }
  //  ################################### Start OnInit ###################################
  ngOnInit() {
    window.scroll({ top: 0, behavior: 'auto' });
    // Start START Loading
    this.startLoading();
    // End START Loading
    //  Start Get Countries
    this.coreService.getMethod('countries', {}).subscribe((countries: any) => {
      this.countriesArray = countries.data;
      this.countriesLoaded = true;
      // Start End Loading
      this.endLoading();
      // End End Loading
      // Start Select Search For Main Services
      this.countriesFilteredOptions = this.resourcesForm.get('countriesObj').valueChanges.pipe(
        startWith(''),
        map(value => this.filterCountries(value))
      );
      // End Select Search For Main Services
    });
    //  End Get Countries
    // Start Get All Services
    this.coreService.getMethod('services/active', {}).subscribe((services: any) => {
      this.mainServiceArray = services.data;
      this.mainServicesLoaded = true;
      this.pushServicesArray();
      // Start End Loading
      this.endLoading();
      // End End Loading
      if (this.resourcesForm.value.services.length === 0 && !this.updateMode) {
        setTimeout(() => {
          this.resourcesForm.get('services').setErrors({ emptyArray: true });
        }, 500);
      }
    });
    // End Get All Services
    // Start Get Resource Types
    this.getResourceTypes();
    // End Get Resource Types
    // Start Update Mode
    this.activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.updateMode) {
        this.updateMode = queryParams.updateMode === 'true';
        this.updatedResourceId = +queryParams.updatedResourceId;
        // Get Order Details
        if (this.updateMode) {
          this.getUpdatedResourceDetails();
        }
        // Get Order Details

        this.modeTitle = 'تعديل المصدر';
      } else {
        // end loading in add technicians
        this.updatedResourceDataLoaded = true;
      }
    });
    // Start Update Mode
  }
  //  ################################### End OnInit ###################################
  //  ################### Start Check Mobile & Email Reservation ###################
  checkReservation(value, type: string) {
    // convert number from arabic
    if (type === 'phone') {
      value = this.countryPhoneKey + this.mobileNumber;
    }

    // convert number from arabic
    this.coreService
      .getMethod(`resources/check-unique/${type}`, {
        [type]: value,
        id: this.updateMode ? this.updatedResourceData.id : ''
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
  //  ################### Start Check Mobile & Email Reservation ###################
  //  ############################# Start X Reset Inputs #############################
  xResetInputs(key) {
    if (key === 'name') {
      (document.getElementById('name') as HTMLInputElement).value = '';
      this.resourcesForm.patchValue({ name: '' });
    }
    if (key === 'email') {
      (document.getElementById('email') as HTMLInputElement).value = '';
      this.resourcesForm.patchValue({ email: '' });
    }
    if (key === 'countriesObj') {
      (document.getElementById('countriesObj') as HTMLInputElement).value = '';
      this.resourcesForm.patchValue({ country: '' });
      this.resourcesForm.patchValue({ citiesObj: '' });
      // (document.getElementById('citiesObj') as HTMLInputElement).value = '';
      this.citiesArray = [];
      this.resourcesForm.patchValue({ city_id: '' });
      this.resourcesForm.controls[key].patchValue('');
    }
    if (key === 'address') {
      (document.getElementById('address') as HTMLInputElement).value = '';
      this.resourcesForm.patchValue({ address: '' });
    }
    if (key === 'mobileKey') {
      (document.getElementById('mobileKey') as HTMLInputElement).value = '';
      this.resourcesForm.patchValue({ phone: '' });
    }
    if (key === 'resourceTypesObj') {
      (document.getElementById('resourceTypesObj') as HTMLInputElement).value = '';
      this.resourcesForm.patchValue({ source_type: '' });
    }
    if (key === 'imageInputObj') {
      (document.getElementById('imageInputObj') as HTMLInputElement).value = '';
      this.resourcesForm.patchValue({ logo: '' });
      this.imagePlaceHolder = ' إرفق لوجو';
    }
    if (key === 'website') {
      (document.getElementById('website') as HTMLInputElement).value = '';
      this.resourcesForm.patchValue({ website: '' });
    }
    if (key === 'location') {
      (document.getElementById('location') as HTMLInputElement).value = '';
      this.resourcesForm.patchValue({ location: '' });
    }
    if (key === 'fax') {
      (document.getElementById('fax') as HTMLInputElement).value = '';
      this.resourcesForm.patchValue({ fax: '' });
    } else {
      (document.getElementById(key) as HTMLInputElement).value = '';
      this.resourcesForm.controls[key].patchValue('');
    }
  }

  //  ############################# End X Reset Inputs #############################
  //  ############################# Start Get Resource Details #############################
  getUpdatedResourceDetails() {
    this.coreService.getMethod('resources/' + this.updatedResourceId, {}).subscribe((updatedResource: any) => {
      this.updatedResourceDataLoaded = true;
      this.updatedResourceData = updatedResource.data;
      this.pushServicesArray();
      // Start End Loading
      this.endLoading();
      // End End Loading
      this.assignUpdatedData();
    });
  }
  //  ############################# End Get Resource Details #############################
  //  ############################# End Assign Updated Data #############################
  assignUpdatedData() {
    const data = this.updatedResourceData;
    this.countryPhoneKey = data.city.country.phone_code;
    this.mobileNumber = data.phone;
    this.showCountryPhoneKey = true;
    this.resourcesForm.patchValue({
      name: data.name,
      email: data.email,
      location: data.location,
      address: data.address,
      phone: +(this.countryPhoneKey + data.phone),
      mobileKey: data.phone,
      website: data.website,
      country: data.city.country.id,
      countriesObj: data.city.country,
      city_id: data.city.id,
      citiesObj: data.city,
      resourceTypesObj: data.source_type,
      type: data.source_type.id,
      active: data.active === 1 ? true : false
    });
    //
    this.updatedResourceData.services.forEach(activeServiceObj => {
      this.resourcesForm.value.services.push(activeServiceObj.id);
    });
    if (this.updatedResourceData.services.length > 0) {
      this.resourcesForm.get('services').setErrors(null);
    }
  }
  //  ############################# End Assign Updated Data #############################

  //  ######################### Start OnUpdate Form #########################
  onUpdate() {
    this.resourcesForm.patchValue({
      phone: +(this.countryPhoneKey + this.mobileNumber)
    });
    this.submitted = true;
    this.startLoading();
    this.coreService.updateMethod('resources/' + this.updatedResourceId, this.resourcesForm.value).subscribe(
      () => {
        this.showSuccess('تم تعديل المصدر بنجاح');
        setTimeout(() => {
          this.router.navigate(['/resources/all-resources']);
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
  //  ######################### Start OnUpdate Form #########################
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
  //  ######################### Start Handle Image Base64 #########################
  onUploadImage(e) {
    this.imagePlaceHolder = e[0].name;
    this.resourcesForm.patchValue({
      logo: e[0].base64
    });
  }
  //  ######################### End Handle Image Base64 #########################
  //  ######################### Start Services CheckBoxes #########################
  checkServices(serviceId, checkedstate) {
    this.showCheckboxesStatus = true;
    if (checkedstate) {
      this.resourcesForm.value.services.push(serviceId);
      if (this.resourcesForm.value.services.length > 0) {
        this.resourcesForm.get('services').setErrors(null);
      }
    } else {
      const index = this.resourcesForm.value.services.indexOf(serviceId);
      this.resourcesForm.value.services.splice(index, 1);
      if (this.resourcesForm.value.services.length === 0) {
        this.resourcesForm.get('services').setErrors({ emptyArray: true });
      }
    }
  }
  pushServicesArray() {
    if (this.updateMode && this.updatedResourceDataLoaded) {
      this.updatedResourceData.services.forEach(activeServiceObj => {
        this.mainServiceArray.forEach(serviceObj => {
          if (activeServiceObj.id === serviceObj.id) {
            serviceObj.status = true;
          }
        });
      });
    } else {
      this.mainServiceArray = this.mainServiceArray.map(serviceObj => {
        return { ...serviceObj, status: false };
      });
    }
  }
  //  ######################### End Services CheckBoxes #########################
  //  ######################### Start OnSubmit Form #########################
  onSubmit() {
    this.showCheckboxesStatus = true;
    this.submitted = true;
    this.resourcesForm.patchValue({
      phone: +(this.countryPhoneKey + this.mobileNumber)
    });
    this.startLoading();
    this.coreService.postMethod('resources', this.resourcesForm.value).subscribe(
      () => {
        this.showSuccess('تم تسجيل المصدر بنجاح');
        setTimeout(() => {
          this.router.navigate(['/resources/all-resources']);
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
  //  ######################### Start Filter Countries #########################
  filterCountries(value: any) {
    if (typeof value === 'object') {
      this.showCountryPhoneKey = true;
      this.countryPhoneKey = value.phone_code;
      this.getCities(value.id);
      // Start START Loading
      this.startLoading();
      // End START Loading
      this.resourcesForm.patchValue({
        country: value.id
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
  //  ######################### End Filter Countries #########################
  //  ######################### Start Get Cities #########################
  getCities(id) {
    this.coreService.getMethod('countries/' + id + '/cities', {}).subscribe((cities: any) => {
      // Start End Loading
      this.endLoading();
      // End End Loading
      this.citiesLoaded = true;
      this.citiesArray = cities.data;
      // Start Select Search For Main Services
      this.citiesFilteredOptions = this.resourcesForm.get('citiesObj').valueChanges.pipe(
        startWith(''),
        map(value => this.filterCities(value))
      );
      // End Select Search For Main Services
    });
  }
  //  ######################### End Get Cities #########################
  //  ######################### Start Filter Countries #########################
  filterCities(value: any) {
    if (typeof value === 'object') {
      this.resourcesForm.patchValue({
        city_id: value.id
      });
    }
    if (this.citiesArray !== null) {
      return this.citiesArray.filter(option => option.name.includes(value));
    }
  }
  displayCities(state) {
    if (state !== null) {
      return state.name;
    }
  }
  //  ######################### End Filter Countries #########################

  //  ######################### Start Get Cities #########################
  getResourceTypes() {
    this.coreService.getMethod('lookup/source-types', {}).subscribe((resourceTypes: any) => {
      // Start End Loading
      this.endLoading();
      // End End Loading
      this.resourceTypesLoaded = true;
      this.resourceTypesArray = resourceTypes.data;
      // Start Select Search For Main Services
      this.resourceTypesFilteredOptions = this.resourcesForm.get('resourceTypesObj').valueChanges.pipe(
        startWith(''),
        map(value => this.filterResourceTypes(value))
      );
      // End Select Search For Main Services
    });
  }
  //  ######################### End Get Cities #########################
  //  ######################### Start Filter Resource Types #########################
  filterResourceTypes(value: any) {
    if (typeof value === 'object') {
      this.resourcesForm.patchValue({
        type: value.id
      });
    }
    if (this.resourceTypesArray !== null) {
      return this.resourceTypesArray.filter(option => option.name.includes(value));
    }
  }
  displayResourceTypes(state) {
    if (state !== null) {
      return state.name;
    }
  }
  //  ######################### End Filter Resource Types #########################
  //  ######################### Start Change Active State #########################
  changeActive(e) {
    this.resourcesForm.patchValue({
      active: e.checked
    });
  }
  //  ######################### End Change Active State #########################
  //  ############################ Start Loading Functions ############################
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  endLoading() {
    setTimeout(() => {
      if (this.mainServicesLoaded && this.countriesLoaded && this.resourceTypesLoaded) {
        this.pageLoaded = true;
        this.loaderService.endLoading();
      }
    }, 300);
  }
  //  ############################ End Loading Functions ############################
  //  ############################ Start Response Messeges ############################
  showErrors(errors) {
    this.endLoading();
    this.submitted = false;
    this.responseState = 'error';
    this.responseData = errors;
    this.responseStateService.responseState(this.responseState, this.responseData);
  }
  showSuccess(successText) {
    this.endLoading();
    this.submitted = false;
    this.responseState = 'success';
    this.responseData = successText;
    this.responseStateService.responseState(this.responseState, this.responseData);
  }
  //  ############################ End Response Messeges ############################
}
