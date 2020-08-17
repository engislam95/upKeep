import {
  Component,
  OnInit,
  ViewChild,
  Input,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import { AgmMap } from '@agm/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from './../../tools/shared-services/core.service';
import { startEndTimeValidator } from '../../tools/shared_validators/StartEndTime.validator';
import { fade } from './../../tools/shared_animations/fade';
import { fadeBottomTop } from './../../tools/shared_animations/fade-bottom-top';
import { MessagingService } from 'src/app/tools/shared-services/messaging.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MapsAPILoader, MouseEvent } from '@agm/core';

declare var google: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  animations: [fade, fadeBottomTop]
})
export class MapComponent implements OnInit {
  /* --------------------- Outputs -----------------------------  */
  @Output() clickedNewClientOrgin: EventEmitter<any> = new EventEmitter();
  @Output() bestTechnicalSelected: EventEmitter<any> = new EventEmitter();
  /* -------------------- Inputs ---------------------------  */
  @Input() orderDate;
  @Input() orderClient;
  @Input() orderDetailsOrgins;
  @Input() clientDetailsOrgins;
  @Input() updatedLocationData;
  @Input() orderServiceId = '';
  @Input() addOrderMode = false;
  @Input() addOrderMapMode = false;
  @Input() orderDetailsMode = false;
  @Input() addOrderPageMode = false;
  @Input() addNewAddressMode = false;
  @Input() clientDetailsPageMode = false;
  @Input() clientDetailsPopupOpen = false;
  @Input() clientDetailsPageModeAddMap = false;
  @Input() multiAddressMapPopupSelections = false;
  @Input() clientDetailsPageModeDtailsMap = false;
  /* ----------------------- Variables ------------------------------- */
  sortedArray: any = [];
  technicians: any = [];
  companyPin;
  private geoCoder;
  citiesLating = [];
  ordersLoaded: boolean = false;
  bestTechnicalFillterprocess: boolean = false;
  mapFilter: boolean = true;
  searchingLoaderCog: boolean = false;
  order_add: boolean = false;
  order_all: boolean = false;
  order_update: boolean = false;
  order_delete: boolean = false;
  ordersModule: any = [];
  user: any = '';
  bestTechnicalName: any = '';
  bestTechnicalArriveTime: any = '';
  technicalIndex: any = '';
  lat: any = '';
  lng: any = '';
  zoom: number = 17;
  todayDate: Date = new Date();
  // View Child of Map
  @ViewChild('AgmMap') agmMap: AgmMap;
  orders: any = [];
  vidCoordinates: any = {
    long: 39.2107495,
    lat: 21.6145938
  };
  // AI
  enableAI: boolean = false;
  AIData: any = {
    emptyTechnicians: [],
    orders: []
  };
  showPopup: boolean = false;
  /* -------------------- Time Form ----------------------------- */
  timeFilterForm = new FormGroup(
    {
      orderDate: new FormControl(),
      start: new FormControl(''),
      startObj: new FormControl('', Validators.required),
      end: new FormControl(''),
      endObj: new FormControl('', Validators.required)
    },
    startEndTimeValidator
  );
  /* ------------------ Time Colors and Background --------------------------- */
  darkTheme = {
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
  /* ---------------- Mulit-Filter ---------------------- */
  servicesWithTechniciansList: any = [];
  techniciansFilterPlaceholder: any = 'إسم الفني او الخدمة';
  nestedType: any = 'nested';
  filterTechniciansComponentId: any = 'filterTechnicians';
  filteredTechniciansIds: any = [];
  // Client Map Location
  clientDetailsMode = false;
  cities = [];
  cityForm = new FormGroup({
    city_id: new FormControl('')
  });
  city_id = '';
  citiesFilteredOptions: Observable<any>;
  url: any = '';
  /* ---------------------- Contructor -------------------------- */
  constructor(
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private messagingService: MessagingService,
    private router: Router,
    private mapsAPILoader: MapsAPILoader
  ) {
    this.url = this.router.url;
    console.log(this.url);

    if (!this.clientDetailsPageMode) {
      this.coreService.getMethod('cities', {}).subscribe((cities: any) => {
        this.cities = cities.data;
        console.log(this.cities);
        this.citiesLating = cities.data;
        // this.citiesFilteredOptions = this.cityForm
        //   .get('city_id')
        //   .valueChanges.pipe(
        //     startWith(''),
        //     map(value => this.filterCities(value))
        //   );
      });
    }
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.user);
    this.companyPin = this.user.companyPin;
    this.ordersModule = this.user.modules.orders;
    if (this.orders) {
      this.orders.map(ele => {
        switch (ele) {
          case 'add':
            this.order_add = true;
            break;
          case 'all':
            this.order_all = true;
            break;
          case 'update':
            this.order_update = true;
            break;
          case 'delete':
            this.order_delete = true;
            break;
        }
      });
    }
  }
  // filterCities(value: any) {
  //   if (typeof value === 'object') {
  //     this.city_id = value.id;
  //     this.coreService.getMethod('cities/' + value.id).subscribe(city => {
  //       console.log(city);
  //       this.citiesLating = [
  //         {
  //           lat: city['data'][0].pivot.lat,
  //           long: city['data'][0].pivot.long
  //         }
  //       ];
  //     });
  //     this.getOrders();
  //   }

  //   if (this.cities !== null) {
  //     return this.cities.filter(option => option.name.includes(value));
  //   }
  // }
  // search by city name
  // getLocationOnMap(cityName) {
  //   let newLocation = {
  //     lat: null,
  //     lng: null,
  //     address: 'test Address',
  //     area: 'test Area 1',
  //     mainLocation: true
  //   };
  //   let address: string = '';
  //   setTimeout(() => {
  //     this.mapsAPILoader.load().then(() => {
  //       this.geoCoder = new google.maps.Geocoder();
  //       this.geoCoder.geocode(
  //         {
  //           address: cityName
  //         },
  //         function(results, status) {
  //           newLocation.lat = results[0].geometry.location.lat();
  //           newLocation.lng = results[0].geometry.location.lng();
  //           address = results[0].formatted_address;
  //         }
  //       );
  //     });
  //   }, 500);

  //   setTimeout(() => {
  //     this.citiesLating.push({
  //       lat: newLocation.lat,
  //       long: newLocation.lng
  //     });
  //     console.log(this.citiesLating);
  //   }, 1000);
  // }
  selectCity(cityID) {
    console.log(cityID);

    if (cityID == '') {
      this.coreService.getMethod('cities', {}).subscribe((cities: any) => {
        this.cities = cities.data;
        console.log(this.cities);
        this.citiesLating = cities.data;
      });
    } else {
      console.log('City ID -> ', cityID);
      this.coreService.getMethod('cities/' + cityID).subscribe(city => {
        console.log(city);
        this.citiesLating = city['data'];
      });
      this.city_id = cityID;
      this.getOrders();
    }
  }
  /* -------------------------- Display ----------------------------- */
  displayOptionsFunction(state) {
    if (state !== null && state !== undefined) {
      return state.name;
    }
  }
  /* -------------------------- Reset Input ---------------------------- */
  xResetInputs(key) {
    (document.getElementById(key) as HTMLInputElement).value = '';
    this.cityForm.controls[key].patchValue('');
    // this.coreService.getMethod('cities', {}).subscribe((cities: any) => {
    //   this.cities = cities.data;
    //   console.log(this.cities);
    //   this.citiesFilteredOptions = cities.data;
    //   this.coreService.getMethod('cities', {}).subscribe((cities: any) => {
    //     this.cities = cities.data;
    //     console.log(this.cities);
    //     this.citiesLating = cities.data;
    // this.citiesFilteredOptions = this.cityForm
    //   .get('city_id')
    //   .valueChanges.pipe(
    //     startWith(''),
    //     map(value => this.filterCities(value))
    //   );
    // });
    // this.citiesFilteredOptions = this.cityForm
    //   .get('city_id')
    //   .valueChanges.pipe(
    //     startWith(''),
    //     map(value => this.filterCities(value))
    //   );
    // });
  }
  /* ---------------------- Oninit -------------------------- */
  ngOnInit() {
    // this.coreService.getMethod('cities', {}).subscribe((cities: any) => {
    //   this.cities = cities.data;
    //   console.log(this.cities);
    // this.cities.map(city => {
    //   this.getLocationOnMap(city.name);
    // });
    // this.citiesFilteredOptions = this.cityForm
    //   .get('city_id')
    //   .valueChanges.pipe(
    //     startWith(''),
    //     map(value => this.filterCities(value))
    //   );
    // });
    this.pickUpTodayDate();
    this.clientLocationOnMap();
    if (!this.multiAddressMapPopupSelections) {
      this.getServicesWithTechnicians();
    }
    if (this.addOrderMode) {
      this.getOrders();
    } else if (
      !this.orderDetailsMode &&
      !this.clientDetailsMode &&
      !this.clientDetailsPageMode &&
      !this.addOrderMapMode
    ) {
      let todayDate;
      // Today's Order
      todayDate = new Date()
        .toLocaleString('en-GB', {
          timeZone: 'Asia/Riyadh',
          timeZoneName: 'short'
        })
        .split(',')[0]
        .split('/')
        .reverse()
        .join('/');
      this.orderDateChanged(todayDate, 'init');
      setTimeout(() => {
        const orderDateSplit = todayDate.split('/');
        const OrderDateAfterSwap =
          orderDateSplit[1] + '/' + orderDateSplit[2] + '/' + orderDateSplit[0];
        (document.getElementById(
          'filterStartDate'
        ) as HTMLInputElement).value = OrderDateAfterSwap;
      }, 100);
    }
    this.listenOrdersUpdates();
  }
  /* ---------------- Client Location on Map ------------------------ */
  clientLocationOnMap() {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.clientDetailsMode) {
        this.clientDetailsMode = true;
        this.orderDetailsOrgins = {
          lng: +queryParams.long,
          lat: +queryParams.lat
        };
      }
    });
  }
  /* -------------------- Get Updates Notifications ------------------------ */
  listenOrdersUpdates() {
    this.messagingService.orderUpdatedNotification.subscribe(
      (orderUpdate: any) => {
        this.getOrders();
      }
    );
  }
  /* ------------------ Get Services with Technicians ------------------------ */
  getServicesWithTechnicians() {
    if (!this.clientDetailsPageMode) {
      let servicesWithTechnicians = [];
      this.coreService
        .getMethod('services/active', { with_technicians: 1 })
        .subscribe((servicesWithTechniciansResponse: any) => {
          servicesWithTechnicians = servicesWithTechniciansResponse.data;
          servicesWithTechnicians = servicesWithTechnicians.map(service => {
            return (service = {
              ...service,
              checked: false,
              technicians: service.technicians.map(technical => {
                return (technical = {
                  ...technical,
                  parentId: service.id,
                  checked: false
                });
              })
            });
          });
          this.servicesWithTechniciansList = servicesWithTechnicians;
        });
    }
  }
  /* ------------------- Search with Multi-Select Technician ------------------------- */
  searchFunction(selectedData) {
    if (selectedData.type === this.filterTechniciansComponentId) {
      this.filteredTechniciansIds = selectedData.data;
    }
    this.getOrders();
  }
  /* -------------------- Get Free Technicians ------------------------- */
  getFreeTechniciansForNewOrder() {
    this.enableAI = true;
    this.getOrders();
    this.bestTechnicalFillterprocess = true;
  }
  /* -------------------- AI ------------------------ */
  startAI() {
    let currentOrderPosition;
    const newOrderPosition = new google.maps.LatLng(
      this.orderClient.lat,
      this.orderClient.long
    );
    // Get Empty Technication
    this.technicians.forEach(technical => {
      if (technical.working_orders.length === 0) {
        this.AIData.emptyTechnicians.push(technical);
        this.searchingLoaderCog = true;
      }
    });
    // Check Distance Time By Order
    console.log('Start AI Orders ->', this.orders);
    this.orders.forEach(order => {
      currentOrderPosition = new google.maps.LatLng(
        order.location.lat,
        order.location.long
      );
      this.getTimeBetweenCurrentOrdersAndNewOrder(
        currentOrderPosition,
        newOrderPosition,
        order
      );
    });
    console.log(this.AIData);
    setTimeout(() => {
      /* Calculate Before Remaining Time If Technical Can Take This New Order Before Current Order
      Calculate After Remaining Time If Technical Can Take This New Order After Current Order */
      this.calculateRemainTimeToNewOrder();
    }, 500);
  }
  /* ----------------------- Calculate Distance Time ------------------------- */
  getTimeBetweenCurrentOrdersAndNewOrder(startNode, endNode, order) {
    console.log('Calcuate Distance');
    const directionsService = new google.maps.DirectionsService();
    const request = {
      origin: startNode,
      destination: endNode,
      travelMode: 'DRIVING'
    };
    directionsService.route(request, result => {
      if (result.status === 'OK') {
        this.AIData.orders.push({
          ...order,
          distanceTime: Math.round(result.routes[0].legs[0].duration.value / 60)
        });
        console.log(
          'Distance: ',
          Math.round(result.routes[0].legs[0].duration.value / 60)
        );
      }
    });
    console.log(this.AIData);
  }
  calculateRemainTimeToNewOrder() {
    let afterRemainingTime;
    let beforeRemainingTime;
    const orderStartValue = this.timeFilterForm.value.start.split(':');
    const orderEndValue = this.timeFilterForm.value.end.split(':');
    const newOrder = {
      startH: +orderStartValue[0],
      startM: +orderStartValue[1],
      endH: +orderEndValue[0],
      endM: +orderEndValue[1]
    };
    console.log(this.AIData);
    this.AIData.orders.forEach((order, index) => {
      // New Order After Current Order
      afterRemainingTime =
        newOrder.startH * 60 + newOrder.startM - (order.toH * 60 + order.toM);
      // New Order Before Current Order
      beforeRemainingTime =
        order.fromH * 60 + order.fromM - (newOrder.endH * 60 + newOrder.endM);
      this.AIData.orders[index] = {
        ...order,
        afterRemainingTime,
        beforeRemainingTime
      };
    });
    this.calculateTotalTimeToArrive();
  }
  /* -------------------- Calculate Time To Arrive --------------------------- */
  calculateTotalTimeToArrive() {
    let totalTimeToArrive;
    console.log(this.AIData);
    this.AIData.orders.forEach((order, index) => {
      totalTimeToArrive = 0;
      order.afterRemainingTime > order.beforeRemainingTime
        ? (totalTimeToArrive = order.afterRemainingTime + order.distanceTime)
        : (totalTimeToArrive = order.beforeRemainingTime + order.distanceTime);
      this.AIData.orders[index] = { ...order, totalTimeToArrive };
    });
    this.sortOrdersWirthBestTime();
  }
  /* ------------------------ Orders with Best Times ---------------------- */
  sortOrdersWirthBestTime() {
    console.log(this.AIData);
    if (this.AIData.orders.length > 0) {
      this.searchingLoaderCog = true;
      if (this.AIData.orders !== null) {
        this.sortedArray = this.AIData.orders.sort((orderOne, orderTwo) => {
          return orderOne.totalTimeToArrive > orderTwo.totalTimeToArrives
            ? 1
            : orderTwo.totalTimeToArrive > orderOne.totalTimeToArrive
            ? -1
            : 0;
        });
        this.bestTechnicalName = this.sortedArray[0].technical.name;
        this.bestTechnicalArriveTime = this.sortedArray[0].totalTimeToArrive;
      }
    } else if (this.AIData.orders.length <= 0) {
    }
    this.bestTechnicalFillterprocess = false;
  }
  /* -------------------- Select a Technical ---------------------- */
  submitSelectedTechnical() {
    // if (
    //   (document.getElementById('selectTechnicalRadio') as HTMLInputElement)
    //     .checked === true
    // ) {
    console.log('Checked');
    if (this.sortedArray.length) {
      this.bestTechnicalSelected.emit({
        technicalId: this.sortedArray[0].technical.id,
        startTime: this.timeFilterForm.value.start,
        endTime: this.timeFilterForm.value.end
      });
    } else if (this.AIData.emptyTechnicians.length) {
      console.log('Else');
      this.bestTechnicalSelected.emit({
        technicalId: this.technicians[this.technicalIndex].id,
        startTime: this.timeFilterForm.value.start,
        endTime: this.timeFilterForm.value.end
      });
    }
    // }
  }

  radioBtn(event) {
    console.log(event);
    this.technicalIndex = event;
  }
  /* ------------------------ Get Orders --------------------------- */
  getOrders() {
    if (!this.clientDetailsPageMode) {
      const orderStartTime = this.timeFilterForm.value.start;
      const orderEndTime = this.timeFilterForm.value.end;
      this.coreService
        .getMethod('orders/technicians', {
          order_date: this.orderDate,
          working_orders: 1,
          'ids[]': this.filteredTechniciansIds,
          time_from: orderStartTime,
          time_to: orderEndTime,
          service_id: this.orderServiceId,
          city_id: this.city_id
        })
        .subscribe((technicians: any) => {
          console.log(technicians);
          this.orders = [];
          this.AIData.emptyTechnicians = [];
          this.AIData.orders = [];
          this.technicians = technicians.data;
          console.log(technicians.data);
          technicians.data.forEach(technical => {
            // console.log(technical)
            technical.workingOrders.forEach(order => {
              this.orders.push({ ...order, technical });
            });
          });
          console.log(this.orders);
          // console.log(this.orders[0]);

          this.ordersLoaded = true;
          if (this.enableAI) {
            this.startAI();
          }
        });
    }
  }
  /* ------------------------------ Time Change ----------------------------- */
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
  /* ------------------------------ Start Time Change ----------------------------- */
  startTimeChanged(time) {
    this.timeFilterForm.patchValue({
      start: time
    });
  }
  /* ------------------------------ End Time Change ----------------------------- */
  endTimeChanged(time) {
    this.timeFilterForm.patchValue({
      end: time
    });
  }
  /* -------------------------- Filter Order Date ------------------------ */
  orderDateChanged(event, ...mode) {
    let orderDateArray;
    let orderDate;
    if (mode[0] === 'init') {
      orderDate = event;
    } else {
      orderDateArray = event.targetElement.value.split('/');
      orderDate =
        orderDateArray[2] + '/' + orderDateArray[0] + '/' + orderDateArray[1];
    }
    this.orderDate = orderDate;
    this.getOrders();
  }
  /* ----------------------- Open & Close Information Window -------------------------- */
  onMouseOver(infoWindow, gm) {
    gm.lastOpen = infoWindow;
    infoWindow.open();
  }
  onMouseOut(infoWindow, gm) {
    gm.lastOpen = infoWindow;
    infoWindow.close();
  }
  /* --------------------- Open Popup of Recommendations --------------------- */
  openRecommendationForm() {
    this.showPopup = true;
    this.mapFilter = false;
    if (this.addOrderMode) {
      this.pickUpTodayDate();
    }
  }
  /* --------------------- Close Popup of Recommendations --------------------- */
  closeSuggestTechnicians() {
    this.searchingLoaderCog = false;
    this.showPopup = false;
    this.mapFilter = true;
    this.pickUpTodayDate();
  }
  /* ----------------------- Select Today Date --------------------- */
  pickUpTodayDate() {
    setTimeout(() => {
      if (
        !this.orderDetailsMode &&
        !this.clientDetailsMode &&
        !this.clientDetailsPageMode &&
        !this.addOrderMapMode
      ) {
        const orderDateSplit = this.orderDate.split('/');
        const OrderDateAfterSwap =
          orderDateSplit[1] + '/' + orderDateSplit[2] + '/' + orderDateSplit[0];
        if (this.showPopup) {
          (document.getElementById(
            'aiDate'
          ) as HTMLInputElement).value = OrderDateAfterSwap;
        } else {
          (document.getElementById(
            'filterStartDate'
          ) as HTMLInputElement).value = OrderDateAfterSwap;
        }
      }
    }, 100);
  }
  /* ----------------------- Add Marker on Map ------------------------ */
  mapClicked(e) {
    if (this.clientDetailsPageMode && this.clientDetailsPopupOpen) {
      // console.log(e);
      this.clickedNewClientOrgin.emit({
        lat: e.coords.lat,
        lng: e.coords.lng
      });
    }
  }

  markerDragEnd($event) {
    console.log($event);
    this.clickedNewClientOrgin.emit({
      lat: $event.coords.lat,
      lng: $event.coords.lng
    });
  }

  /* -------------------- Get Order Details ------------------------- */
  orderDetails(order) {
    console.log(order);
    this.router.navigate(['/orders/order-details'], {
      queryParams: { orderId: order.id }
    });
  }
}
