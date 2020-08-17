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
import '@ckeditor/ckeditor5-build-classic/build/translations/ar';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss'],
  animations: fade
})
export class AddOfferComponent implements OnInit {
  modeTitle = 'إضافة عرض';

  //
  // ─── START CKEDITOR ──────────────────────────────────────────────
  //

  public Editor = ClassicEditor;
  public config = {
    language: 'ar'
  };

  //
  // ────────────────────────────────────────────── END CKEDITOR ─────
  //

  //
  // ─── START GENERAL DATA ──────────────────────────────────────────
  //

  responseState;
  responseData;
  imagePlaceHolder = 'صورة العرض';
  pageLoaded = false;
  resourcesLoaded = false;
  mainServicesLoaded = false;
  todayDate = new Date();

  //
  // ────────────────────────────────────────── END GENERAL DATA ─────
  //

  //
  // ─── START SELECT COUNTRY ────────────────────────────────────────
  //

  resourcesArray = [];
  resourcesFilteredOptions: Observable<any>;

  //
  // ──────────────────────────────────────── END SELECT COUNTRY ─────
  //

  //
  // ─── START SELECT SERVICES ───────────────────────────────────────
  //

  servicesArray = [];
  servicesFilteredOptions: Observable<any>;

  //
  // ─────────────────────────────────────── END SELECT SERVICES ─────
  //

  //
  // ─── START SELECT SUB SERVICES ───────────────────────────────────
  //

  subServicesArray = [];
  subServicesFilteredOptions: Observable<any>;
  //
  // ─────────────────────────────────── END SELECT SUB SERVICES ─────
  //

  //
  // ─── START FORM DATA ─────────────────────────────────────────────
  //

  offersForm = new FormGroup({
    name: new FormControl('', Validators.required),
    source_id: new FormControl(),
    offerEndDateObj: new FormControl(),
    offerStartDateObj: new FormControl(),
    description: new FormControl('', Validators.required),
    start_date: new FormControl(),
    end_date: new FormControl(),
    active: new FormControl(true),
    service_id: new FormControl(), // subservice id
    sourceObj: new FormControl('', [emptyValidator, Validators.required]),
    servicesObj: new FormControl('', [emptyValidator, Validators.required]),
    subServicesObj: new FormControl('', [emptyValidator, Validators.required]),
    image: new FormControl(''),
    imageInputObj: new FormControl('')
  });
  submitted = false;

  //
  // ───────────────────────────────────────────── END FORM DATA ─────
  //

  //
  // ─── START UPDATE DATA ───────────────────────────────────────────
  //

  updateMode = false;
  updatedOfferId;
  updatedOfferDataLoaded = false;
  updatedOfferData;
  assignDataFinished = false;
  updatedResourceChanged = false;
  updatedMainServiceChanged = false;

  //
  // ─────────────────────────────────────────── END UPDATE DATA ─────
  //
  offers: any = [];
  offer_add: boolean = false;
  offer_all: boolean = false;
  offer_update: boolean = false;
  offer_delete: boolean = false;
  user: any = '';

  constructor(
    //
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.offers = this.user.modules.offers;
    if (this.offers) {
      this.offers.map(ele => {
        switch (ele) {
          case 'create':
            this.offer_add = true;
            break;
          case 'show':
            this.offer_all = true;
            break;
          case 'update':
            this.offer_update = true;
            break;
          case 'delete':
            this.offer_delete = true;
            break;
        }
      });
    }
  }

  //
  // ─── START ONINIT ────────────────────────────────────────────────
  //

  ngOnInit() {
    window.scroll({ top: 0, behavior: 'auto' });
    // Start Update
    this.activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.updateMode) {
        this.updateMode = queryParams.updateMode === 'true';
        this.updatedOfferId = +queryParams.updatedOfferId;
        // Get Order Details
        if (this.updateMode) {
          this.getUpdatedOfferDetails();
          this.assignUpdatedServices();
        }
        // Get Order Details
        this.modeTitle = 'تعديل العرض';
      }
    });
    if (!this.updateMode) {
      // add offer mode
      // hack add order page to mak end loading done
      this.updatedOfferDataLoaded = true;
      this.mainServicesLoaded = true;
      this.assignDataFinished = true;
      // Start End Loading
      this.endLoading();
      // End End Loading
    }
    // End Update
    // Start START Loading
    this.startLoading();
    // End START Loading
    //  Start Get Resources
    this.coreService
      .getMethod('resources/active', {})
      .subscribe((resources: any) => {
        this.resourcesArray = resources.data;
        this.resourcesLoaded = true;
        // Start End Loading
        this.endLoading();
        // End End Loading
        if (this.updateMode) {
        } else {
          // Start Select Search For Resources
          this.resourcesFilteredOptions = this.offersForm
            .get('sourceObj')
            .valueChanges.pipe(
              startWith(''),
              map(value => this.filterResources(value))
            );
          // End Select Search For Resources
        }
      });
    //  End Get Resources
  }

  //
  // ──────────────────────────────────────────────── END ONINIT ─────
  //

  //
  // ─── START FILTER RESOURCES ──────────────────────────────────────
  //

  filterResources(value: any) {
    if (typeof value === 'object') {
      this.getResourceServices(value.id);
      if (!this.updateMode) {
        // Start START Loading
        this.startLoading();
        // End START Loading
      }
      this.offersForm.patchValue({
        source_id: value.id
      });
    } else {
      // Rset Inputs
      this.servicesArray = [];
      this.subServicesArray = [];
      this.offersForm.patchValue({
        // sourceObj: '',
        source_id: '',
        servicesObj: '',
        service_id: '',
        subServicesObj: ''
      });
      // Rset Inputs
    }
    if (this.resourcesArray !== null) {
      return this.resourcesArray.filter(option => option.name.includes(value));
    }
  }
  displayResources(state) {
    if (state !== null) {
      return state.name;
    }
  }

  //
  // ────────────────────────────────────── END FILTER RESOURCES ─────
  //

  //
  // ─── START GET RESOURCE SERVICES ─────────────────────────────────
  //

  getResourceServices(resourceId) {
    if (this.updateMode && this.updatedResourceChanged) {
      this.startLoading();
    }
    //  Start Get Services
    this.coreService
      .getMethod('resources/' + resourceId + '/services', {})
      .subscribe((services: any) => {
        this.servicesArray = services.data;
        this.mainServicesLoaded = true;
        if (this.updateMode && !this.updatedResourceChanged) {
          this.assignUpdatedServices();
          //
          const data = this.updatedOfferData;
          if (!this.updatedResourceChanged) {
            this.servicesArray.forEach(service => {
              if (service.id === data.service.parent) {
                // Start Select Search For Services
                this.servicesFilteredOptions = this.offersForm
                  .get('servicesObj')
                  .valueChanges.pipe(
                    startWith(service),
                    map(value => this.filterServices(value))
                  );
                // End Select Search For Services
              }
            });
            this.updatedResourceChanged = true;
            this.updatedMainServiceChanged = true;
          } else {
            this.servicesArray.forEach(service => {
              if (service.id === data.service.parent) {
                // Start Select Search For Services
                this.servicesFilteredOptions = this.offersForm
                  .get('servicesObj')
                  .valueChanges.pipe(
                    startWith(''),
                    map(value => this.filterServices(value))
                  );
                // End Select Search For Services
              }
            });
          }

          //
        } else {
          // Start Select Search For Services
          this.servicesFilteredOptions = this.offersForm
            .get('servicesObj')
            .valueChanges.pipe(
              startWith(''),
              map(value => this.filterServices(value))
            );
          // End Select Search For Services
        }
        // Start End Loading
        this.endLoading();
        // End End Loading
      });
    //  End Get Services
  }

  //
  // ───────────────────────────────── END GET RESOURCE SERVICES ─────
  //

  //
  // ─── START FILTER SERVICES ───────────────────────────────────────
  //

  filterServices(value: any) {
    if (typeof value === 'object') {
      this.subServicesArray = value.children;
      if (this.updateMode) {
        if (!this.updatedMainServiceChanged) {
          // End Select Search For Sub Services
          this.subServicesFilteredOptions = this.offersForm
            .get('subServicesObj')
            .valueChanges.pipe(
              startWith(this.updatedOfferData.service),
              map(values => this.filterSubServices(values))
            );
          // End Select Search For Sub Services
        } else {
          // End Select Search For Sub Services
          this.subServicesFilteredOptions = this.offersForm
            .get('subServicesObj')
            .valueChanges.pipe(
              startWith(''),
              map(values => this.filterSubServices(values))
            );
          // End Select Search For Sub Services
        }
      } else {
        // End Select Search For Sub Services
        this.subServicesFilteredOptions = this.offersForm
          .get('subServicesObj')
          .valueChanges.pipe(
            startWith(''),
            map(values => this.filterSubServices(values))
          );
        // End Select Search For Sub Services
      }
    } else {
      // Rset Inputs
      this.subServicesArray = [];
      this.offersForm.patchValue({
        service_id: '',
        subServicesObj: ''
      });
      // Rset Inputs
    }
    if (this.servicesArray !== null) {
      return this.servicesArray.filter(option => option.name.includes(value));
    }
  }
  displayServices(state) {
    if (state !== null) {
      return state.name;
    }
  }

  //
  // ─────────────────────────────────────── END FILTER SERVICES ─────
  //

  //
  // ─── START FILTER SERVICES ───────────────────────────────────────
  //

  filterSubServices(value: any) {
    if (typeof value === 'object') {
      this.offersForm.patchValue({
        service_id: value.id
      });
    }
    if (this.subServicesArray !== null) {
      return this.subServicesArray.filter(option =>
        option.name.includes(value)
      );
    }
  }
  displaySubServices(state) {
    if (state !== null) {
      return state.name;
    }
  }

  //
  // ─────────────────────────────────────── END FILTER SERVICES ─────
  //

  //
  // ─── START X RESET INPUTS ────────────────────────────────────────
  //

  xResetInputs(key) {
    if (key === 'sourceObj') {
      (document.getElementById('sourceObj') as HTMLInputElement).value = '';
      this.offersForm.patchValue({ source_id: '' });
      (document.getElementById('servicesObj') as HTMLInputElement).value = '';
    }

    if (key === 'offerStartDateObj') {
      this.offersForm.patchValue({ start_date: '' });
    }
    if (key === 'offerEndDateObj') {
      this.offersForm.patchValue({ end_date: '' });
    }
    if (key === 'servicesObj') {
      this.offersForm.patchValue({ service_id: '' });
      (document.getElementById('subServicesObj') as HTMLInputElement).value =
        '';
      this.offersForm.patchValue({ subServicesObj: '' });
    }
    if (key === 'imageInputObj') {
      this.offersForm.patchValue({ image: '' });
      (document.getElementById('imageInputObj') as HTMLInputElement).value = '';
      this.imagePlaceHolder = 'صورة العرض';
    }

    (document.getElementById(key) as HTMLInputElement).value = '';
    this.offersForm.controls[key].patchValue('');
  }
  //
  // ──────────────────────────────────────── END X RESET INPUTS ─────
  //

  //
  // ─── START GET OFFER DETAILS ─────────────────────────────────────
  //

  getUpdatedOfferDetails() {
    this.coreService
      .getMethod('offers/' + this.updatedOfferId, {})
      .subscribe((updatedOffer: any) => {
        this.updatedOfferDataLoaded = true;
        this.updatedOfferData = updatedOffer.data;
        // Start End Loading
        this.endLoading();
        // End End Loading
        this.assignUpdatedData();
      });
  }
  //
  // ───────────────────────────────────── END GET OFFER DETAILS ─────
  //

  //
  // ─── START ASSIGN UPDATED DATA ───────────────────────────────────
  //

  assignUpdatedData() {
    const data = this.updatedOfferData;
    this.dateChanged(data.start_date, 'start', 'updateMode');
    this.dateChanged(data.end_date, 'end', 'updateMode');
    // Start Select Search For Resources
    this.resourcesFilteredOptions = this.offersForm
      .get('sourceObj')
      .valueChanges.pipe(
        startWith(data.source),
        map(value => this.filterResources(value))
      );
    // End Select Search For Resources
    this.offersForm.patchValue({
      name: data.name,
      sourceObj: data.source,
      source_id: data.source.id,
      description: data.description,
      active: data.active === 1 ? true : false
    });
  }

  //
  // ─────────────────────────────────── END ASSIGN UPDATED DATA ─────
  //

  //
  // ─── START ASSIGN MAIN - SUB SERVICE ─────────────────────────────
  //

  assignUpdatedServices() {
    if (this.mainServicesLoaded && this.updatedOfferDataLoaded) {
      const data = this.updatedOfferData;
      let servicesObj;
      this.servicesArray.forEach(service => {
        if (service.id === data.service.parent) {
          servicesObj = service;
          this.offersForm.patchValue({
            servicesObj,
            service_id: data.service.id,
            subServicesObj: data.service
          });
          this.assignDataFinished = true;
          // Start End Loading
          this.endLoading();
          // End End Loading
        }
      });
    }
  }

  //
  // ───────────────────────────── END ASSIGN MAIN - SUB SERVICE ─────
  //

  //
  // ─── START DATE CUSTOMIZE ────────────────────────────────────────
  //

  dateChanged(event, type, ...mode) {
    let dateArray = '';
    let date = '';
    // **   Update Mode   **

    if (mode[0] === 'updateMode') {
      if (event !== null) {
        dateArray = event.split('-');
        date = dateArray[0] + '/' + dateArray[1] + '/' + dateArray[2];
        if (type === 'start') {
          this.offersForm.patchValue({
            start_date: date,
            offerStartDateObj: this.updatedOfferData.start_date
          });
        } else if (type === 'end') {
          this.offersForm.patchValue({
            end_date: date,
            offerEndDateObj: this.updatedOfferData.end_date
          });
        }
      }

      // **   Update Mode   **
    } else {
      dateArray = event.targetElement.value.split('/');
      date = dateArray[2] + '/' + dateArray[0] + '/' + dateArray[1];
      if (type === 'start') {
        this.offersForm.patchValue({
          start_date: date
        });
      } else if (type === 'end') {
        this.offersForm.patchValue({
          end_date: date
        });
      }
    }
  }

  //
  // ──────────────────────────────────────── END DATE CUSTOMIZE ─────
  //

  //
  // ─── START ONUPDATE FORM ─────────────────────────────────────────
  //

  onUpdate() {
    this.submitted = true;
    this.startLoading();
    this.coreService
      .updateMethod('offers/' + this.updatedOfferId, this.offersForm.value)
      .subscribe(
        () => {
          this.showSuccess('تم تعديل العرض بنجاح');
          setTimeout(() => {
            this.router.navigate(['/offers/all-offers']);
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

  //
  // ───────────────────────────────────────── END ONUPDATE FORM ─────
  //

  //
  // ─── START CHANGE ACTIVE STATE ───────────────────────────────────
  //

  changeActive(e) {
    this.offersForm.patchValue({
      active: e.checked
    });
  }

  //
  // ─────────────────────────────────── END CHANGE ACTIVE STATE ─────
  //

  //
  // ─── START ONSUBMIT FORM ─────────────────────────────────────────
  //

  onSubmit() {
    this.submitted = true;
    this.startLoading();
    this.coreService.postMethod('offers', this.offersForm.value).subscribe(
      () => {
        this.showSuccess('تم تسجيل العرض بنجاح');
        setTimeout(() => {
          this.router.navigate(['/offers/all-offers']);
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

  //
  // ───────────────────────────────────────── END ONSUBMIT FORM ─────
  //

  //
  // ─── START HANDLE IMAGE BASE64 ───────────────────────────────────
  //

  onUploadImage(e) {
    // this.imagePlaceHolder = e[0].name;
    this.imagePlaceHolder = e[0].name;
    this.offersForm.patchValue({
      image: e[0].base64
    });
  }
  //
  // ─────────────────────────────────── END HANDLE IMAGE BASE64 ─────
  //

  //
  // ─── START LOADING FUNCTIONS ─────────────────────────────────────
  //

  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  endLoading() {
    if (
      this.updatedOfferDataLoaded &&
      this.resourcesLoaded &&
      this.mainServicesLoaded &&
      this.assignDataFinished
    ) {
      this.pageLoaded = true;
      this.loaderService.endLoading();
    }
  }

  //
  // ───────────────────────────────────── END LOADING FUNCTIONS ─────
  //

  //
  // ─── START RESPONSE MESSEGES ─────────────────────────────────────
  //

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

  //
  // ───────────────────────────────────── END RESPONSE MESSEGES ─────
  //
}
