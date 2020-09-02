import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, fromEvent } from 'rxjs';
import {
  startWith,
  map,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';
import { SelectSearchService } from './../../../tools/shared-services/select-search.service';
import { emptyValidator } from '../../../tools/shared_validators/Empty.validator';
import { LoaderService } from '../../../tools/shared-services/loader.service';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';
import { CoreService } from '../../../tools/shared-services/core.service';
import '@ckeditor/ckeditor5-build-classic/build/translations/ar';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { detailsValidator } from 'src/app/tools/shared_validators/Details.validator';
import { startEndTimeValidator } from 'src/app/tools/shared_validators/StartEndTime.validator';
import { popup } from '../../../tools/shared_animations/popup';
import { fade } from '../../../tools/shared_animations/fade';
import { noAddressValidator } from './../../../tools/shared_validators/NoAddress.validator';
@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.scss'],
  animations: [popup, fade]
})
export class AddSaleComponent implements OnInit, AfterViewInit {
  /* ---------------------- Variables -------------------------- */
  selectedResourceLogo: any = '';
  responseState: any = '';
  responseData: any = '';
  orderClient: any = '';
  orderServiceId: any = '';
  orderDate: any = '';
  pageLoaded: boolean = false;
  selectedResourceLogoShow: boolean = false;
  searchClientStarted: boolean = false;
  selectMainService: boolean = false;
  selectDate: boolean = false;
  viewMapsPopup: boolean = false;
  order_add: boolean = false;
  order_all: boolean = false;
  order_update: boolean = false;
  choosenOffer: any = '';
  orders: any = [];
  showNote = false;
  updatePhone = false;
  user: any = '';
  todayDate: Date = new Date();
  // Clients
  clientsArray: any = [];
  clientsFilteredOptions: Observable<any>;
  clientsArrayLoaded: boolean = false;
  // Resourecs
  sourcesArray: any = [];
  orderNumbersArray: any = [];
  sourcesFilteredOptions: Observable<any>;
  orderNumbersFilteredOptions: Observable<any>;
  sourcesArrayLoaded: boolean = false;
  // Services
  servicesArray: any = [];
  servicesFilteredOptions: Observable<any>;
  servicesArrayLoaded: boolean = false;
  // Sub-Services
  subServicesArray: any = [];
  subServicesFilteredOptions: Observable<any>;
  technicalArray: any = [];
  technicalFilteredOptions: Observable<any>;
  orderNumberControl = new FormControl();
  // Offers
  noOffers: any = '';
  currentOffer: any = '';
  offersArray: any = [];
  offersFilteredOptions: Observable<any>;
  offersLoaded: boolean = false;
  techniciansLoaded: boolean = false;
  submitted: boolean = false;
  viewOfferDetailsPopup: boolean = false;
  viewOfferDetailsPopupButton: boolean = false;
  viewClientDetails: boolean = false;
  selectClient: boolean = false;
  /* --------------------- Update Data Variables ----------------- */
  updatedOrderId: any = '';
  updatedOrderData: any = '';
  updateMode: boolean = false;
  updateButton: boolean = false;
  updatedOrderDataLoaded: boolean = false;
  selectedUpdatedResourceChanged: boolean = false;
  selectedUpdatedMainServiceChanged: boolean = false;
  /* ------------------ Map Show ----------------------- */
  clientDetailsData: any = '';
  showMapPopup: boolean = false;
  overLayShow: boolean = false;
  vidCoordinates: any = {
    long: 39.2107495,
    lat: 21.6145938
  };
  clientLocationsArray: any = [];
  selectedClientLocationsArray: any = [];
  selectedLocationId: any = '';
  multiAddressButtondisabled: boolean = true;
  selectSubLocations: boolean = false;
  selectedLocationIndexInUpdateMode: any = '';
  lastOrderClient: any = '';
  technical_id: any = '';
  resouceObject: any = '';
  serviceObject: any = '';
  subServiceObject: any = '';
  /* ---------------Editor --------------- */
  public Editor = ClassicEditor;
  public config = {
    language: 'ar'
  };
  /* ----------------- Time -------------- */
  // dayStart = 9; ------> OLD VERSION
  // dayEnd = 22; ------> OLD VERSION
  dayStart: any = 0;
  dayEnd: any = 23;
  dayHoursArray: any = [];
  darkTheme: any = {
    container: {
      bodyBackgroundColor: '#424242',
      buttonColor: '#fff'
    },
    dial: {
      dialBackgroundColor: '#555'
    },
    clockFace: {
      clockFaceBackgroundColor: '#555',
      clockHandColor: '#f6a811',
      clockFaceTimeInactiveColor: '#fff'
    }
  };
  /* ------------------- Time Table ---------------------- */
  @ViewChild('loopContainer') loopContainer: ElementRef;
  loopCellWidth: any;
  hideme: any = [];
  minutes: any = [];
  hours: any = [];
  technicians: any = [];
  client_city_id: any = '';
  color = '#FF0000';
  safetyOrder: any = false;
  addNumber: any = false;
  addColor: any = false;
  techFlage: any = false;
  clientMobiles: any = [];
  periodsArray: any = [];
  orderStatusArray: any = [];
  showMobilePopup: any = false;
  clientMobile_id: any = '';
  numberOrder: any = '';
  showAddNumberPopup = false;
  phonesForm = new FormGroup({
    mobile: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]* || [٠-٩]*'),
      Validators.minLength(9),
      Validators.maxLength(9)
    ]),
    name: new FormControl('')
  });
  setError = false;
  errorMessage: string = 'هذا الرقم غير صحيح او موجود بالفعل ';

  /* -------------------- Order Form ------------------------ */
  salesForm = new FormGroup(
    {
      client_id: new FormControl('', Validators.required),
      clientIdObj: new FormControl('', [emptyValidator, Validators.required]),
      technician_id: new FormControl(null, [Validators.required]),
      start: new FormControl(''),
      startObj: new FormControl('', [Validators.required]),
      end: new FormControl(''),
      endObj: new FormControl('', [Validators.required]),
      details: new FormControl('', [detailsValidator, Validators.required]),
      location_id: new FormControl(''),
      period_id: new FormControl(''),
      clientAddMobile: new FormControl(''),
      technical_id: new FormControl('', [emptyValidator, Validators.required]),
      status_id: new FormControl(''),
      main_service_id: new FormControl(),
      subServicesObj: new FormControl('', [
        emptyValidator,
        Validators.required
      ]),
      service_id: new FormControl(),
      offer_id: new FormControl(),
      offersObj: new FormControl(''),
      source_id: new FormControl(''),
      sourceObj: new FormControl('', [Validators.required]),
      servicesObj: new FormControl('', [emptyValidator, Validators.required]),
      order_date: new FormControl(''),
      urgent: new FormControl(false),
      color: new FormControl(this.color),
      clientContact: new FormControl(false),
      orderDateObj: new FormControl('', [Validators.required])
    },
    [noAddressValidator, startEndTimeValidator]
  );
  numberOrder_id: any = '';
  /* -------------------;--- Constructor -------------------------- */
  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private actvatdRoute: ActivatedRoute,
    private selectSearchService: SelectSearchService
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.user);
    this.orders = this.user.modules.orders;
    if (this.orders) {
      this.orders.map(ele => {
        switch (ele) {
          case 'create':
            this.order_add = true;
            break;
          case 'show':
            this.order_all = true;
            break;
          case 'update':
            this.order_update = true;
            break;
        }
      });
    }
    // Periods
    this.startLoading();
    this.coreService.getMethod('lookup/periods').subscribe(data => {
      console.log(data);
      this.periodsArray = data['data'];
      this.endLoading();
    });
    // status
    this.startLoading();
    this.coreService.getMethod('lookup/sales-order-status').subscribe(data => {
      console.log(data);
      this.orderStatusArray = data['data'];
      this.endLoading();
    });
  }
  /* ---------------- After Init ------------------- */
  ngAfterViewInit() {}
  filterationClient(value) {
    console.log(value);
    this.getClients(value);
  }
  openMobilePopup() {
    this.showMobilePopup = true;
  }
  // add phone number
  addPhoneNumber() {
    console.log(this.orderClient);

    this.coreService
      .postMethod('clients/mobile/' + this.orderClient.id, {
        name: this.phonesForm.controls.name.value,
        mobile: +(966 + this.phonesForm.controls.mobile.value)
      })
      .subscribe(
        (clientDetails: any) => {
          console.log(clientDetails);
          this.setError = false;
          this.phonesForm.controls.name.setValue('');
          this.phonesForm.controls.mobile.setValue('');
          this.coreService
            .getMethod('clients/' + this.orderClient.id)
            .subscribe(mobiles => {
              console.log(mobiles['data']['mobiles']);
              this.clientMobiles = mobiles['data']['mobiles'];
            });
          this.updatePhone = false;
          this.endLoading();
          this.showSuccess('تم إضافة  رقم التليفون بنجاح');
          this.showAddNumberPopup = false;
        },
        error => {
          if (error.error.errors) {
            this.showErrors(error.error.errors);
            this.setError = true;
          } else {
            this.showErrors(error.error.message);
          }
        }
      );
  }
  /* ----------------- Oninit -------------------- */
  ngOnInit() {
    window.scroll({ top: 0, behavior: 'auto' });
    this.startLoading();
    this.generateTime();
    this.getSources();
    this.initTechniciansTableHours();
    // Client Filter
    // const clientIdObj = document.getElementById('clientIdObj');
    // const clientIdObjEvent = fromEvent(clientIdObj, 'keyup');
    // clientIdObjEvent
    //   .pipe(
    //     map((event: any) => event.target.value),
    //     debounceTime(500),
    //     distinctUntilChanged()
    //   )
    //   .subscribe((value: any) =>
    //     this.selectClient ? null : this.getClients(value)
    //   );
    /* --------------------- Update Mode ------------------- */
    this.actvatdRoute.queryParams.subscribe(params => {
      console.log(params);
      this.updateMode = params.updateMode === 'true';
      this.updateButton = params.updateMode === 'true';
      this.updatedOrderId = +params.updatedOrderId;
      if (
        (this.updateMode && this.order_update) ||
        this.user.privilege == 'super-admin'
      ) {
        this.getUpdatedOrderDetails();
      }
    });
  }
  // Change Color
  changeColor(value) {
    this.color = value;
  }
  // Change Safety
  changeSafetyOrder(event) {
    this.safetyOrder = event;
  }
  // Change Number
  changePhone(event) {
    this.addNumber = event;
  }
  // Change Number
  changeColorStatus(event) {
    this.addColor = event;
  }
  // Change Technical
  chooseTechnical(event) {
    this.techFlage = event;
  }
  /* ------------------------- Reset Values ------------------------ */
  xResetInputs(key) {
    if (key === 'orderDateObj') {
      this.resetInputs('date');
    }
    (document.getElementById(key) as HTMLInputElement).value = '';
    if (this.salesForm.controls[key]) {
      this.salesForm.controls[key].patchValue('');
    }
    if (key === 'clientIdObj') {
      this.multiAddressButtondisabled = true;
      this.selectedClientLocationsArray = [];
      this.clientMobiles = [];
      this.salesForm.controls.client_id.setValue('');
      this.lastOrderClient = '';
      this.orderClient = '';
      this.clientsArray = [];
      // Client Filter
      const clientIdObj = document.getElementById('clientIdObj');
      const clientIdObjEvent = fromEvent(clientIdObj, 'keyup');
      clientIdObjEvent
        .pipe(
          map((event: any) => event.target.value),
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe((value: any) => {
          console.log(value);
          this.selectClient ? null : this.getClients(value);
        });
    }
  }
  resetInputs(inputRole) {
    this.updateMode = false;
    if (inputRole === 'date') {
      this.technicians = [];
      this.patchForm({ technician_id: '' });
    }
    if (inputRole === 'resource') {
      this.servicesArray = [];
      this.patchForm({ servicesObj: '', main_service_id: '' });
    }
    if (inputRole === 'mainService' || inputRole === 'resource') {
      this.subServicesArray = [];
      this.technicians = [];
      this.patchForm({
        subServicesObj: '',
        service_id: '',
        technician_id: '',
        offersObj: '',
        offer_id: ''
      });
    }
    if (
      inputRole === 'subService' ||
      inputRole === 'mainService' ||
      inputRole === 'resource' ||
      inputRole === 'offer' ||
      inputRole === 'date'
    ) {
      this.offersArray = [];
      this.patchForm({ offersObj: '' });
      this.currentOffer = '';
      this.viewOfferDetailsPopupButton = false;
    }
  }
  /* ----------------------- Filter Sub-Services ----------------------- */
  filterSubServices(value: any) {
    if (typeof value === 'object') {
      this.subServiceObject = value;
      this.patchForm({ service_id: value.id });
      this.getOffers();
    } else {
      this.resetInputs('subService');
      return this.selectSearchService.filterOptions(
        value,
        this.subServicesArray
      );
    }
  }
  chooseOffer(offer, i) {
    console.log(offer);
    this.filterOffers(offer);
    this.choosenOffer = offer.name;
    console.log(this.salesForm.controls.offer_id.value);
    this.viewOfferDetailsPopup = false;
    this.offersArray.map(ele => {
      ele.choosen = 0;
    });
    this.offersArray[i].choosen = 1;
    console.log(this.offersArray);
  }
  /* ----------------- Get Offers -------------------------- */
  getOffers() {
    const serviceId = this.salesForm.value.service_id;
    const subServiceStatus = this.salesForm.get('subServicesObj').status;
    const orderDate = this.salesForm.value.order_date;
    const orderDateStatus = this.salesForm.get('orderDateObj').status;
    if (subServiceStatus === 'VALID' && orderDateStatus === 'VALID') {
      this.startLoading();
      this.coreService
        .getMethod('offers/active', {
          service_id: serviceId,
          order_date: orderDate
        })
        .subscribe((offersResponse: any) => {
          console.log(offersResponse);

          this.offersArray = offersResponse.data;
          this.endLoading();
          this.updateMode ? null : this.listenInputChanges('', 'offer');
          if (this.offersArray.length === 0) {
            this.salesForm.controls.offersObj.disable();
            this.patchForm({ offersObj: '' });
            this.noOffers = 'لا يوجد عروض فى هذا اليوم';
          } else {
            this.salesForm.controls.offersObj.enable();
            this.noOffers = '';
          }
        });
    }
  }
  /* -------------------- Filter Offers ------------------------- */
  filterOffers(value: any) {
    if (typeof value === 'object') {
      this.viewOfferDetails(value);
      this.viewOfferDetailsPopupButton = true;
      this.patchForm({ offer_id: value.id });
    } else {
      this.viewOfferDetailsPopupButton = false;
      return this.selectSearchService.filterOptions(value, this.offersArray);
    }
  }
  /* -------------- View Offer Details -------------------- */
  viewOfferDetails(orderDetails) {
    this.currentOffer = orderDetails;
  }
  /* -------------- Open Details Popup ------------------ */
  openOfferDetailsPopup() {
    this.viewOfferDetailsPopup = true;
  }
  /* ----------------- Close Details Popup --------------------- */
  closePopup() {
    this.viewOfferDetailsPopup = false;
  }
  /* --------------------- Select Technical ------------------------ */
  selectBestTechnical(event) {
    this.patchForm({
      technician_id: event.technicalId.toString(),
      start: event.startTime,
      startObj: event.startTime,
      end: event.endTime,
      endObj: event.endTime
    });
    this.viewMapsPopup = false;
  }
  /* -------------------- Get Resources -------------------------- */
  getSources() {
    this.coreService
      .getMethod('resources/active', {})
      .subscribe((sourcesResponse: any) => {
        this.sourcesArray = sourcesResponse.data;
        this.endLoading();
        this.sourcesArrayLoaded = true;
        if (!this.updateMode) {
          this.listenInputChanges('', 'resource');
        }
      });
  }
  /* -------------------- Get Client Location --------------------- */
  getClientlocationsArray(e) {
    if (!this.updateMode) {
      this.selectedClientLocationsArray = [];
      this.multiAddressButtondisabled = true;
      this.listenInputChanges('', 'client');
    }
  }
  /* ---------------------- Filter Resources ---------------------- */
  filterSources(value: any) {
    if (typeof value === 'object') {
      this.getResourceServices(value.id);
      this.resouceObject = value;
      this.selectedResourceLogo = value.logo;
      setTimeout(() => {
        this.selectedResourceLogoShow = true;
      }, 200);
      this.patchForm({ source_id: value.id });
    } else {
      this.resetInputs('resource');
      this.selectedResourceLogoShow = false;
      this.selectedResourceLogo = '';
      return this.selectSearchService.filterOptions(value, this.sourcesArray);
    }
  }
  /* ---------------------- Filter Resources ---------------------- */
  filterOrderNumber(value: any) {
    console.log(value);
    this.numberOrder = value;
    this.numberOrder_id = value;
    console.log(this.orderNumbersArray);
    return this.orderNumbersArray.filter(option =>
      option.toString().includes(value)
    );
  }
  displayOrderNumberFunction = state => {
    console.log(state);
    return state;
  };

  /* ------------------- Get Services By Resources ------------------*/
  getResourceServices(resourceId) {
    if (!this.updateMode) {
      this.startLoading();
    }
    this.coreService
      .getMethod('resources/' + resourceId + '/services', {})
      .subscribe((services: any) => {
        this.servicesArray = services.data;
        this.servicesArrayLoaded = true;
        this.endLoading();
        if (this.updateMode) {
          this.getOrderTechnicians();
          this.servicesArray.forEach(service => {
            if (
              service.id === this.updatedOrderData.service.parent_service.id
            ) {
              this.subServicesArray = service.children;
            }
          });
        } else {
          this.listenInputChanges('', 'mainService');
        }
      });
  }
  /* --------------------- Filter Services -------------------------- */
  filterServices(value: any) {
    if (typeof value === 'object') {
      this.serviceObject = value;
      this.subServicesArray = value.children;
      if (!this.updateMode) {
        this.patchForm({ main_service_id: value.id });
        this.orderServiceId = value.id;
        this.listenInputChanges('', 'subService');
      }
      this.getOrderTechnicians();
      this.selectMainService = true;
    } else {
      this.selectMainService = false;
      this.resetInputs('mainService');
      return this.selectSearchService.filterOptions(value, this.servicesArray);
    }
  }
  /* ----------------- Input Changes ---------------------- */
  listenInputChanges(value, input) {
    switch (input) {
      case 'client':
        this.clientsFilteredOptions = this.salesForm
          .get('clientIdObj')
          .valueChanges.pipe(
            startWith(value),
            map(filterValue => this.filterClients(filterValue))
          );
        break;
      case 'resource':
        this.sourcesFilteredOptions = this.salesForm
          .get('sourceObj')
          .valueChanges.pipe(
            startWith(value),
            map(filterValue => this.filterSources(filterValue))
          );
        break;
      case 'mainService':
        this.servicesFilteredOptions = this.salesForm
          .get('servicesObj')
          .valueChanges.pipe(
            startWith(value),
            map(filterValue => this.filterServices(filterValue))
          );
        break;
      case 'subService':
        this.subServicesFilteredOptions = this.salesForm
          .get('subServicesObj')
          .valueChanges.pipe(
            startWith(value),
            map(filterValue => this.filterSubServices(filterValue))
          );
        break;
      case 'offer':
        this.offersFilteredOptions = this.salesForm
          .get('offersObj')
          .valueChanges.pipe(
            startWith(value),
            map(filterValue => this.filterOffers(filterValue))
          );
        break;
    }
  }
  /* ------------------- Patch Form --------------------- */
  patchForm(data) {
    this.salesForm.patchValue({ ...data });
  }
  /* ----------------------- Display Options ------------------------ */
  displayOptionsFunction = state => {
    return this.selectSearchService.displaySelected(state);
  };
  /* ------------------------- Get Update Data ----------------------- */
  getUpdatedOrderDetails() {
    this.coreService
      .getMethod('sales/orders/' + this.updatedOrderId)
      .subscribe((updatedOrder: any) => {
        console.log(updatedOrder);

        this.endLoading();
        this.updatedOrderDataLoaded = true;
        this.updatedOrderData = updatedOrder.data;
        // this.selectedLocationId = this.updatedOrderData.location.id;
        // this.selectedClientLocationsArray = this.updatedOrderData.client.locations;
        if (this.selectedClientLocationsArray.length > 0) {
          this.multiAddressButtondisabled = false;
          this.selectedClientLocationsArray.forEach(element => {
            element.default = 0;
          });
          this.selectedClientLocationsArray.forEach(element => {
            if (element.id === this.updatedOrderData.location.id) {
              this.selectedLocationIndexInUpdateMode = this.selectedClientLocationsArray.indexOf(
                element
              );
            }
          });
          this.selectedClientLocationsArray[
            this.selectedLocationIndexInUpdateMode
          ].default = 1;
        }
        this.assignUpdatedData();
      });
  }
  /* -------------------------- Assign Updated Data --------------------------- */
  assignUpdatedData() {
    this.viewClientDetails = true;
    const start = this.updatedOrderData.start.split(':');
    const end = this.updatedOrderData.end.split(':');
    let startObj = this.updatedOrderData.start.split(':');
    let endObj = this.updatedOrderData.end.split(':');
    if (this.updatedOrderData.fromH === 12) {
      startObj =
        this.updatedOrderData.fromH + ':' + this.updatedOrderData.fromM + ' pm';
    } else {
      startObj =
        this.updatedOrderData.fromH + ':' + this.updatedOrderData.fromM;
    }
    if (this.updatedOrderData.toH === 12) {
      endObj =
        this.updatedOrderData.toH + ':' + this.updatedOrderData.toM + ' pm';
    } else {
      endObj = this.updatedOrderData.toH + ':' + this.updatedOrderData.toM;
    }
    this.listenInputChanges(this.updatedOrderData.source, 'resource');
    this.listenInputChanges(
      this.updatedOrderData.service.parent_service,
      'mainService'
    );
    this.listenInputChanges(this.updatedOrderData.service, 'subService');
    if (this.updatedOrderData.offer) {
      this.listenInputChanges(this.updatedOrderData.offer, 'offer');
    }
    this.orderDateChanged(this.updatedOrderData.order_date, 'updateMode');
    if (this.updatedOrderData.offer !== null) {
      this.currentOffer = this.updatedOrderData.offer;
      this.viewOfferDetailsPopupButton = true;
    }
    this.addColor = true;
    if (this.updatedOrderData.offer_id == null) {
      this.salesForm.controls.offersObj.disable();
    }
    this.color = this.updatedOrderData['label-color'];
    this.patchForm({
      period_id: this.updatedOrderData.period_id,
      status_id: this.updatedOrderData.status
        ? this.updatedOrderData.status.id
        : '',
      clientContact: this.updatedOrderData.contacted,
      urgent: this.updatedOrderData.urgent,
      color: this.updatedOrderData['label-color'],
      client_id: this.updatedOrderData.client_id
        ? this.updatedOrderData.client_id
        : '',
      clientIdObj: this.updatedOrderData.client
        ? this.updatedOrderData.client
        : '',
      details: this.updatedOrderData.details,
      technical_id: this.updatedOrderData.technician_id,
      startObj,
      start: start[0] + ':' + start[1],
      endObj,
      end: end[0] + ':' + end[1],

      sourceObj: this.updatedOrderData.source
        ? this.updatedOrderData.source
        : '',
      source_id: this.updatedOrderData.source.id
        ? this.updatedOrderData.source.id
        : '',

      offer_id:
        this.updatedOrderData.offer === null
          ? null
          : this.updatedOrderData.offer.id,
      offersObj: this.updatedOrderData.offer,
      servicesObj: this.updatedOrderData.service
        ? this.updatedOrderData.service.parent_service
        : '',
      main_service_id: this.updatedOrderData.service
        ? this.updatedOrderData.service.parent
        : '',
      subServicesObj: this.updatedOrderData.service
        ? this.updatedOrderData.service
        : '',
      service_id: this.updatedOrderData.service
        ? this.updatedOrderData.service.id
        : ''
    });
    if (this.updatedOrderData.order_related) {
      this.safetyOrder = true;
    }
    this.numberOrder_id = this.updatedOrderData.order_related;
    this.orderNumberControl.setValue(this.updatedOrderData.order_related);
    this.patchForm({
      technical_id: this.updatedOrderData.technician_id
    });
    this.numberOrder = this.updatedOrderData.order_related;
    if (this.updatedOrderData.technician_id) {
      this.techFlage = true;
    }
    this.filterClients(this.updatedOrderData.client);
    this.technical_id = this.updatedOrderData.technician_id;
    this.selectClient = true;
    this.selectMainService = true;
    this.selectDate = true;
    this.orderClient = this.updatedOrderData.client;
    console.log(this.orderClient);
    this.orderServiceId = this.updatedOrderData.service.parent;
  }
  /* --------------------- Date Change ----------------------- */
  orderDateChanged(event, ...mode) {
    let orderDateArray;
    let orderDate;
    this.selectDate = true;
    if (mode[0] === 'updateMode') {
      orderDateArray = event.split('-');
      orderDate =
        orderDateArray[0] + '/' + orderDateArray[1] + '/' + orderDateArray[2];
      this.salesForm.patchValue({
        order_date: orderDate,
        orderDateObj: this.updatedOrderData.order_date
      });
    } else {
      orderDateArray = event.targetElement.value.split('/');
      orderDate =
        orderDateArray[2] + '/' + orderDateArray[0] + '/' + orderDateArray[1];
      this.salesForm.patchValue({
        order_date: orderDate
      });
    }
    this.orderDate = orderDate;
    this.getOrderTechnicians();
    this.getOffers();
  }
  /* --------------------------- Get Order Technicians -------------------- */
  getOrderTechnicians() {
    const mainServiceId = this.salesForm.value.main_service_id;
    const MainServiceStatus = this.salesForm.get('servicesObj').status;
    const orderDate = this.salesForm.value.order_date;
    const orderDateStatus = this.salesForm.get('orderDateObj').status;
    if (
      MainServiceStatus === 'VALID' &&
      orderDateStatus === 'VALID' &&
      mainServiceId !== null
    ) {
      this.startLoading();
      this.coreService
        .getMethod('orders/technicians', {
          service_id: mainServiceId,
          order_date: orderDate,
          city_id: this.client_city_id
        })
        .subscribe((orderTechnicians: any) => {
          this.technicians = orderTechnicians.data;
          console.log(this.technicians);

          this.technicalFilteredOptions = this.salesForm
            .get('technical_id')
            .valueChanges.pipe(
              startWith(''),
              map(filterValue => this.filterTechnical(filterValue))
            );
          this.endLoading();
          setTimeout(() => {
            this.cdr.detectChanges();
          }, 500);
        });
    }
  }
  filterTechnical(value: any) {
    if (typeof value === 'object') {
      this.technical_id = value.id;
    }
    return this.technicians.filter(option => option.name.includes(value));
  }
  /* ---------------------------- Get All Clients -------------------- */
  getClients(value) {
    if (value === '') {
      this.clientsArray = [];
      this.viewClientDetails = false;
    } else {
      this.loaderService.startLoading();
      this.searchClientStarted = true;
      this.coreService
        .getMethod('clients/active', { name: value })
        .subscribe((clientsResponse: any) => {
          this.clientsArray = clientsResponse;
          this.clientsArrayLoaded = true;
          this.listenInputChanges('', 'client');
          if (!this.updateMode) {
            this.loaderService.endLoading();
            this.searchClientStarted = false;
          }
        });
    }
  }
  /* ------------------ Client Detals --------------------- */
  viewClientDetailsFunction() {
    const clientId = this.salesForm.value.client_id;
    window.open('/clients/client-details?clientId=' + clientId, '_blank');
  }
  openClientLocations() {
    this.showMapPopup = true;
  }
  changeMobile(id, i) {
    this.clientMobile_id = id;
    this.showMobilePopup = false;
    this.showSuccess('تم اختيار الرقم البديل');
    this.clientMobiles.forEach(ele => {
      ele.default = 0;
    });
    this.clientMobiles[i].default = 1;
  }
  // edit phone number
  editPhoneNumber(element) {
    console.log(element);

    this.phonesForm.controls.name.setValue(element.name);
    this.phonesForm.controls.mobile.setValue(
      element.mobile
        .split('')
        .slice(3)
        .join('')
    );
    console.log(this.phonesForm.controls.mobile.value);

    this.updatePhone = true;
    // this.fetchedPhone = element;
  }

  // delte phone number
  deletePhoneNumber(phoneId) {
    this.coreService.deleteMethod('clients/mobile/' + phoneId).subscribe(
      (clientDetails: any) => {
        console.log(clientDetails);
        this.endLoading();
        this.showSuccess('تم إزالة  رقم التليفون بنجاح');
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
  /* ------------------------ Filter Clients --------------------- */
  filterClients(value: any) {
    if (typeof value === 'object') {
      console.log('Client');
      this.selectClient = true;
      console.log(value);
      //Get Client Mobile
      this.coreService.getMethod('clients/' + value.id).subscribe(mobiles => {
        console.log(mobiles['data']['mobiles']);
        this.clientMobiles = mobiles['data']['mobiles'];
      });
      // Get Client Details and Last Order Details
      this.startLoading();
      this.coreService
        .getMethod('clients/lastorder?client_id=' + value.id)
        .subscribe(client => {
          console.log(client['data']);
          this.lastOrderClient = client['data'];
          this.orderNumbersArray = client['data']['OrdersNumbers'];
          console.log(this.orderNumbersArray);
          this.orderNumbersFilteredOptions = this.orderNumberControl.valueChanges.pipe(
            startWith(''),
            map(value => this.filterOrderNumber(value))
          );
          this.showNote = true;
          this.endLoading();
        });
      this.searchClientStarted = false;
      this.getClientlocationsArray(value.user.id);
      if (!this.updateMode) {
        this.selectedClientLocationsArray = value.locations;

        this.selectedClientLocationsArray.forEach(element => {
          console.log('Location ID ->', element);
          if (element.default) {
            this.selectedLocationId = element.id;
            this.client_city_id = element.city_id;
          }
        });
      }
      if (this.selectedClientLocationsArray.length > 0) {
        this.multiAddressButtondisabled = false;
      }
      this.orderClient = value;
      this.salesForm.patchValue({
        client_id: value.id,
        location_id: value.locations.length > 0 ? value.locations[0].id : null
      });
      this.viewClientDetails = true;
      this.selectClient = true;
      if (this.clientsArray !== null) {
        return this.clientsArray.filter(option =>
          option.user.name.includes(value)
        );
      }
    } else if (typeof value == 'string') {
      this.viewClientDetails = false;
      // this.selectClient = false;
      return this.clientsArray.filter(
        option =>
          option.user.name.includes(value) || option.user.mobile.includes(value)
      );
    }
  }
  /* ---------------------- Technicians Table Hours --------------------------- */
  initTechniciansTableHours() {
    let dayStart = this.dayStart - 1;
    for (let i = 1; i <= this.dayEnd - this.dayStart + 1; i++) {
      this.dayHoursArray.push(dayStart + 1);
      dayStart++;
    }
  }
  /* ---------------------- Add New Client --------------------------- */
  addNewClient() {
    this.router.navigate(['/clients/add-client'], {
      queryParams: { addOrderClient: true }
    });
  }
  /* ------------------- Time Change ---------------------- */
  timeChanged(time, type) {
    let pmTime;
    let amTime;
    let splitPMTimeHours;
    let splitPMTimeMinutes;
    const splitedTime = time.split(' ');
    console.log(type);
    splitPMTimeHours = splitedTime[0].split(':')[0];
    if (splitedTime[1] === 'pm') {
      splitPMTimeHours = splitedTime[0].split(':')[0];
      splitPMTimeMinutes = splitedTime[0].split(':')[1];
      if (splitedTime[0].split(':')[0] === '12') {
        pmTime = +splitPMTimeHours + ':' + splitPMTimeMinutes;
      } else {
        pmTime = +splitPMTimeHours + 12 + ':' + splitPMTimeMinutes;
      }
      if (type === 'start') {
        this.startTimeChanged(pmTime);
        localStorage.setItem('startTimeType', splitedTime[1]);
      } else {
        this.endTimeChanged(pmTime);
        localStorage.setItem('endTimeType', splitedTime[1]);
      }
    } else {
      amTime = splitedTime[0];
      console.log(amTime);
      if (type === 'start') {
        const typeOfTime = splitedTime[1];
        localStorage.setItem('startTimeType', typeOfTime);
        console.log(typeOfTime);
        this.startTimeChanged(amTime);
      } else {
        const typeOfTime = splitedTime[1];
        localStorage.setItem('endTimeType', typeOfTime);
        console.log(typeOfTime);
        this.endTimeChanged(amTime);
      }
    }
  }
  /* ---------------------- Start Time -------------------------- */
  startTimeChanged(time) {
    this.salesForm.patchValue({
      start: time
    });
  }
  /* ---------------------- End Time -------------------------- */
  endTimeChanged(time) {
    this.salesForm.patchValue({
      end: time
    });
  }
  /* ---------------------------- Update Order ------------------------- */
  onUpdate() {
    this.startLoading();
    this.submitted = true;
    this.salesForm.patchValue({
      technician_id: +this.salesForm.value.technician_id
    });
    if (this.selectedClientLocationsArray.length > 1) {
      this.salesForm.value.location_id = this.selectedLocationId;
    }
    this.coreService
      .updateMethod('orders/' + this.updatedOrderId, this.salesForm.value)
      .subscribe(
        () => {
          this.endLoading();
          this.showSuccess('تم تعديل الطلب بنجاح');
          setTimeout(() => {
            this.router.navigate(['/orders/all-orders']);
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
  /* ------------------- Update Address ------------------- */
  onSelectAddress(locationId, i, locations) {
    console.log(locations);
    this.client_city_id = locations.city_id;
    this.selectedLocationId = locationId;
    this.showMapPopup = false;
    this.selectSubLocations = true;
    this.showSuccess('تم اختيار العنوان البديل');
    this.selectedClientLocationsArray.forEach(element => {
      element.default = 0;
    });
    this.selectedClientLocationsArray[i].default = 1;
  }
  /* ------------------------------ Create Order ------------------------- */
  onSubmit() {
    this.startLoading();
    console.log(this.salesForm.value);
    console.log(this.salesForm.value.start);
    let am = this.salesForm.value.startObj.split(' ')[1];
    if (am == 'am') {
      let startHour = this.salesForm.value.start.split(':')[0];
      const startMin = this.salesForm.value.start.split(':')[1];
      if (startHour == 12 && localStorage.getItem('startTimeType') == 'am') {
        startHour = 0;
        this.salesForm.value.start = startHour + '0' + ':' + startMin;
      }
      let endHour = this.salesForm.value.end.split(':')[0];
      const endMin = this.salesForm.value.end.split(':')[1];
      if (endHour == 12 && localStorage.getItem('endTimeType') == 'am') {
        endHour = 0;
        this.salesForm.value.end = endHour + '0' + ':' + endMin;
      }
    }
    console.log(this.salesForm.value.end);
    this.submitted = true;
    this.salesForm.value.location_id = this.selectedLocationId;
    console.log(this.numberOrder);

    this.coreService
      .postMethod('sales/orders/create', {
        client_id: this.orderClient.id,
        service_id: this.subServiceObject.id,
        source_id: this.resouceObject.id,
        offer_id: this.salesForm.value.offer_id,
        technician_id: this.technical_id,
        order_date: this.salesForm.value.order_date,
        start: this.salesForm.value.start,
        end: this.salesForm.value.end,
        details: this.salesForm.value.details,
        location_id: this.client_city_id,
        status: this.salesForm.value.status_id,
        period_id: this.salesForm.value.period_id,
        order_related: this.numberOrder,
        contacted: this.salesForm.value.clientContact,
        urgent: this.salesForm.value.urgent,
        'label-color': this.color
      })
      .subscribe(
        () => {
          this.endLoading();
          this.showSuccess('تم تسجيل الطلب بنجاح');
          setTimeout(() => {
            this.router.navigate(['/sales/all-sales']);
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
  /* ------------------- Generate Time ------------------------- */
  generateTime() {
    for (let index = 1; index <= 60; index++) {
      this.minutes.push(index);
    }
    for (let index = this.dayStart; index <= this.dayEnd; index++) {
      this.hours.push(index);
    }
  }
  /* --------------------- Start Loading ------------------- */
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  /* ------------------- End Loading ---------------------- */
  endLoading() {
    if (
      this.updateMode &&
      this.updatedOrderDataLoaded &&
      this.sourcesArrayLoaded &&
      this.offersLoaded &&
      this.techniciansLoaded &&
      this.servicesArrayLoaded
    ) {
      this.pageLoaded = true;
      this.loaderService.endLoading();
    } else {
      this.pageLoaded = true;
      this.loaderService.endLoading();
    }
  }
  /* --------------------- Show Error Messages ------------------------- */
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
  /* ----------------- Show Success Messages ------------------------- */
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
