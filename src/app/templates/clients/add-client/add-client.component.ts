import {
  Component,
  OnInit,
  NgZone,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { fade } from '../../../tools/shared_animations/fade';
import { LoaderService } from '../../../tools/shared-services/loader.service';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';
import { CoreService } from '../../../tools/shared-services/core.service';
import { emptyValidator } from '../../../tools/shared_validators/Empty.validator';
import { MapsAPILoader, MouseEvent } from '@agm/core';
@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss'],
  animations: fade
})
export class AddClientComponent implements OnInit {
  /* ---------------------- Variables ------------------------ */
  modeTitle: any = 'إضافة عميل';
  responseState: any = '';
  responseData: any = '';
  pageLoaded: boolean = false;
  gendersLoaded: boolean = false;
  countriesLoaded: boolean = false;
  clientTypesLoaded: boolean = false;
  homeTypesLoaded: boolean = false;
  mapDone: boolean = false;
  homeContractTypesLoaded: boolean = false;
  airConditionerTypesLoaded: boolean = false;
  showCountryPhoneKey: boolean = false;
  countryPhoneKey: any = '';
  mobileNumber: any = '';
  addOrderClient: boolean = false;
  invoiceClient: boolean = false;
  mobileReserved: boolean = false;
  mobileCheckLoaded: boolean = false;
  emailReserved: boolean = false;
  emailCheckLoaded: boolean = false;
  submitted: boolean = false;
  airConditionerTypeSelected: any = '';
  airConditionerCountSelected: any = '';
  airConditionerNameSelected: any = '';
  airConditionerDisplayArray: any = [];
  updateMode: boolean = false;
  updatedClientId: any = '';
  updatedClientDataLoaded: boolean = false;
  updatedClientData: any = '';
  gendersArray: any = [];
  gendersFilteredOptions: Observable<any>;
  countriesArray: any = [];
  countriesFilteredOptions: Observable<any>;
  citiesArray: any = [];
  citiesFilteredOptions: Observable<any>;
  clientTypesArray: any = [];
  clientTypesFilteredOptions: Observable<any>;
  homeTypesArray: any = [];
  homeTypesFilteredOptions: Observable<any>;
  homeContractTypesArray: any = [];
  homeContractTypesFilteredOptions: Observable<any>;
  airConditionerTypesArray: any = [];
  airConditionerTypesFilteredOptions: Observable<any>;
  location = {
    lat: 31.245332,
    lng: 29.966024,
    address: 'test Address',
    area: 'test Area 1',
    mainLocation: true
  };

  showMapPopup = false;
  overLayShow = false;
  cityId;
  passPopup = true;
  addNewAddressModeStatus = false;
  private geoCoder;
  citiesFetched = ['alexandria', 'cairo', 'makka', 'paris'];
  city: string;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  AboveUrl: 'http://localhost:4200/clients/add-client';

  invalidForm: boolean;
  verified = false;

  cityDetails;

  /* -------------------------------- Clients Form ------------------------- */
  clientsForm = new FormGroup({
    name: new FormControl('', Validators.required),
    gender: new FormControl(''),
    genderObj: new FormControl(''),
    countriesObj: new FormControl(''),
    city_id: new FormControl(''),
    citiesObj: new FormControl('', [emptyValidator, Validators.required]),
    mobile: new FormControl(''),
    mobileKey: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]* || [٠-٩]*'),
      Validators.minLength(9),
      Validators.maxLength(9)
    ]),
    email: new FormControl('', [
      Validators.email,
      Validators.required,

      Validators.pattern('^[a-zA-Z][a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}')
    ]),
    notes: new FormControl('', Validators.required),
    locations_address: new FormControl('', Validators.required),
    locations_notes: new FormControl(''),
    locations_city: new FormControl(''),
    locations_area: new FormControl('', Validators.required),

    zone: new FormControl(),
    address: new FormControl(),
    client_type: new FormControl(),
    clientTypesObj: new FormControl(''),
    longObj: new FormControl({ value: '', disabled: true }),
    latObj: new FormControl({ value: '', disabled: true }),
    aboveUrl: new FormControl(),
    lat: new FormControl(),
    long: new FormControl(),
    home_type: new FormControl(),
    homeTypesObj: new FormControl(),
    home_contract_type: new FormControl(),
    homeContractTypesObj: new FormControl(),
    camera_number: new FormControl(),
    kitchen_number: new FormControl(),
    bathroom_number: new FormControl(),
    room_number: new FormControl(),
    floor_number: new FormControl(),
    area: new FormControl(),
    air_conditioner: new FormControl([]),
    airConditionerTypesObj: new FormControl(),
    airConditionerNumbersObj: new FormControl(),
    active: new FormControl(true)
  });

  /* ----------------------- Map form  --------------------------- */

  updatedMapForm = new FormGroup({
    formAddress: new FormControl(''),
    formArea: new FormControl(''),
    formSpecialSign: new FormControl(''),
    mapFormOrgins: new FormControl([])
  });

  /* ----------------------- Constructor --------------------------- */
  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  /* ----------------------- Oninit ---------------------------- */
  ngOnInit() {
    console.log(this.clientsForm.controls.lat.value);
    console.log(this.clientsForm.controls.long.value);

    //   $("#Text1").bind('paste', function(e) {
    //     $(this).attr("maxlength","1000")
    // });
    // $("#Text1").on("input",function(){
    //    $(this).attr("maxlength","0")
    // });

    //  //load Places Autocomplete
    //  let newLocation = {
    //   lat: null,
    //   lng: null ,
    //   address: 'test Address',
    //   area: 'test Area 1',
    //   mainLocation: true
    //  }
    //  this.mapsAPILoader.load().then(() => {
    //   // this.setCurrentLocation();
    //   this.geoCoder = new google.maps.Geocoder;

    //   this.geoCoder.geocode({
    //     'address': 'paris'
    //   }, function(results, status) {
    //     // if (status == google.maps.GeocoderStatus.OK) {

    //       console.log(results)

    //       newLocation.lat = results[0].geometry.location.lat();
    //       newLocation.lng = results[0].geometry.location.lng();

    //       this.clientsForm.patchValue({
    //         lat: results[0].geometry.location.lat(),
    //         long: results[0].geometry.location.lng()
    //       });

    //       console.log(newLocation.lng)

    //       // var myOptions = {
    //       //   zoom: 11,
    //       //   center: new google.maps.LatLng(this.location.Lat, this.location.Lng)
    //       // };

    //     // } else {
    //     //   alert("Something got wrong " + status);
    //     // }
    //   });
    // });

    // console.log(newLocation.lat)
    // console.log(newLocation.lng)
    // this.location = newLocation ;

    // this.clientsForm.patchValue({
    //   lat: this.location.lat,
    //   long: this.location.lng
    // });

    // this.updatedMapForm.mapFormOrgins = this.location.lat + this.location.lng

    //   let autocomplete = new google.maps.places.Autocomplete(this.city);
    //   console.log(autocomplete)
    //   autocomplete.addListener("place_changed", () => {
    //     this.ngZone.run(() => {
    //       //get the place result
    //       let place: google.maps.places.PlaceResult = autocomplete.getPlace();

    //       //verify result
    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }

    //       //set latitude, longitude and zoom
    //       this.location.lat = place.geometry.location.lat();
    //       this.location.lng = place.geometry.location.lng();
    //     });
    //   });
    // });

    window.scroll({ top: 0, behavior: 'auto' });
    this.activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.addOrderClient) {
        this.addOrderClient = true;
      } else if (queryParams.invoiceClient) {
        this.invoiceClient = true;
      } else if (queryParams.updateMode) {
        this.updateMode = queryParams.updateMode === 'true';
        this.updatedClientId = +queryParams.updatedClientId;
        if (this.updateMode) {
          this.getUpdatedClientDetails();
          //  this.getLocationOnMapUpdate();
        }
        this.modeTitle = 'تعديل عميل';
      }
    });
    if (!this.updateMode) {
      this.updatedClientDataLoaded = true;
      this.endLoading();
    }
    this.startLoading();
    this.getGenders();
    this.getCountries();
    this.getCities();
    this.getClientTypes();
    this.getHomeTypes();
    this.getHomeContractTypes();
    this.getAirConditionerTypes();
    // if (!this.updateMode) {
    //     this.getLocationOnMap();
    // }
  }

  /* ---------------------------- Check Unique of Mobile and Email ---------------------- */
  checkReservation(value, type: string) {
    if (type === 'mobile') {
      value = this.countryPhoneKey + this.mobileNumber;
    }

    console.log(value);
    this.coreService
      .getMethod(`clients/check-unique/${type}`, {
        [type]: value,
        id: this.updateMode ? this.updatedClientData.id : ''
      })
      .subscribe(
        (type) => {
          console.log(type);
          
          if (type === 'mobile') {
            this.mobileReserved = false;
            this.mobileCheckLoaded = true;
          } else {
            this.emailReserved = false;
            this.emailCheckLoaded = true;
          }
        },
        (err) => {
          console.log(err);
          
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
  /* -------------------------- Reset Input ---------------------------- */
  xResetInputs(key) {
    if (key === 'homeContractTypesObj') {
      (document.getElementById(
        'homeContractTypesObj'
      ) as HTMLInputElement).value = '';
      this.clientsForm.patchValue({ home_contract_type: '' });
    }
    if (key === 'homeTypesObj') {
      (document.getElementById('homeTypesObj') as HTMLInputElement).value = '';
      this.clientsForm.patchValue({ home_type: '' });
    }
    if (key === 'clientTypesObj') {
      (document.getElementById('clientTypesObj') as HTMLInputElement).value =
        '';
      this.clientsForm.patchValue({ client_type: '' });
    }
    if (key === 'mobileKey') {
      (document.getElementById('mobileKey') as HTMLInputElement).value = '';
      this.clientsForm.patchValue({ mobile: '' });
    }
    if (key === 'genderObj') {
      (document.getElementById('genderObj') as HTMLInputElement).value = '';
      this.clientsForm.patchValue({ gender: '' });
    }
    if (key === 'aboveUrl' && this.clientsForm.controls.aboveUrl.value) {
      this.clientsForm.patchValue({ aboveUrl: '' });
      this.clientsForm.controls.locations_area.setValue('');
      this.clientsForm.controls.locations_address.setValue('');
      this.clientsForm.controls.lat.setValue(28.421864);
      this.clientsForm.controls.long.setValue(34.432869);
      // this.clientsForm.patchValue({ citiesObj: '' });
    }
    if (key === 'citiesObj') {
      this.clientsForm.patchValue({ citiesObj: '' });
      this.clientsForm.controls.lat.setValue(28.421864);
      this.clientsForm.controls.long.setValue(34.432869);
    }
    if (key === 'citiesObj') {
      (document.getElementById('citiesObj') as HTMLInputElement).value = '';
      this.clientsForm.patchValue({ city_id: '' });
      this.clientsForm.controls.lat.setValue(28.421864);
      this.clientsForm.controls.long.setValue(34.432869);
    }

    if (key === 'location') {
      (document.getElementById(key) as HTMLInputElement).value = '';
      (document.getElementById('longObj') as HTMLInputElement).value = '';
      this.clientsForm.patchValue({ long: '' });
      (document.getElementById('latObj') as HTMLInputElement).value = '';
      this.clientsForm.patchValue({ lat: '' });
    }
    // } else {
    //   (document.getElementById(key) as HTMLInputElement).value = '';
    //   this.clientsForm.controls[key].patchValue('');
    // }
    if (key === 'sourceObj') {
      (document.getElementById('sourceObj') as HTMLInputElement).value = '';
      this.clientsForm.patchValue({ source_id: '' });
      (document.getElementById('servicesObj') as HTMLInputElement).value = '';
      this.clientsForm.patchValue({ service_id: '' });
    }
    (document.getElementById(key) as HTMLInputElement).value = '';
    this.clientsForm.controls[key].patchValue('');
  }

  /* --------------------------------- add location address ----------------------------- */
  getLocationOnMap() {
    let newLocation = {
      lat: null,
      lng: null,
      address: 'test Address',
      area: 'test Area 1',
      mainLocation: true
    };

    let address: string = '';
    console.log(this.updateMode);

    setTimeout(() => {
      this.mapsAPILoader.load().then(() => {
        this.geoCoder = new google.maps.Geocoder();

        console.log(this.clientsForm.controls.citiesObj);

        if (this.clientsForm.controls.citiesObj.value) {
          this.geoCoder.geocode(
            {
              // address: this.clientsForm.controls.citiesObj.value.name
              address: this.cityDetails.name
            },
            function(results, status) {
              console.log(results);
              newLocation.lat = results[0].geometry.location.lat();
              newLocation.lng = results[0].geometry.location.lng();

              // let bonds = new google.maps.LatLngBounds();
              // bonds.extend(new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()));
              // $scope.map.fitBounds(bonds);
              console.log(newLocation.lng);

              address = results[0].formatted_address;
            }
          );
        }
      });
    }, 1000);

    setTimeout(() => {
      this.clientsForm.controls.lat.setValue(newLocation.lat);
      this.clientsForm.controls.long.setValue(newLocation.lng);
      console.log(this.clientsForm.value);
      // this.location = newLocation ;
    }, 4000);
  }

  getLocationOnMapUpdate() {
    let newLocation = {
      lat: null,
      lng: null,
      address: 'test Address',
      area: 'test Area 1',
      mainLocation: true
    };

    let address: string = '';

    console.log(this.updateMode);

    setTimeout(() => {
      this.mapsAPILoader.load().then(() => {
        this.geoCoder = new google.maps.Geocoder();

        console.log(this.clientsForm.controls.citiesObj);

        if (this.clientsForm.controls.citiesObj.value) {
          this.geoCoder.geocode(
            {
              // address: this.clientsForm.controls.citiesObj.value.name
              address: this.cityDetails.name
            },
            function(results, status) {
              console.log(results);
              newLocation.lat = results[0].geometry.location.lat();
              newLocation.lng = results[0].geometry.location.lng();

              // let bonds = new google.maps.LatLngBounds();
              // bonds.extend(new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()));
              // $scope.map.fitBounds(bonds);
              console.log(newLocation.lng);

              address = results[0].formatted_address;
            }
          );
        }
      });
    }, 5000);

    setTimeout(() => {
      this.clientsForm.controls.lat.setValue(newLocation.lat);
      this.clientsForm.controls.long.setValue(newLocation.lng);
      console.log(this.clientsForm.value);
      // this.location = newLocation ;
    }, 4000);
  }

  getLocationOnMapSelect(value) {
    this.mapDone = false;

    console.log(value);

    if (value.pivot.lat && value.pivot.long) {
      this.clientsForm.controls.lat.setValue(value.pivot.lat);
      this.clientsForm.controls.long.setValue(value.pivot.long);
      this.clientsForm.controls.locations_area.setValue(value.pivot.area);
      this.clientsForm.controls.locations_address.setValue(value.pivot.address);
      this.clientsForm.controls.locations_notes.setValue(value.pivot.notes);
    } else if (value.pivot.lat == null || value.pivot.long == null) {
      this.clientsForm.controls.lat.setValue(28.421864);
      this.clientsForm.controls.long.setValue(34.432869);
    }

    console.log(this.clientsForm.value);
  }

  addAdress() {
    console.log(this.cityDetails);

    if (this.mapDone == false && !this.updateMode) {
      let city = this.clientsForm.controls.citiesObj.value;

      this.clientsForm.controls.lat.setValue(city.pivot.lat);

      this.clientsForm.controls.long.setValue(city.pivot.long);

      this.clientsForm.controls.locations_area.setValue(city.pivot.area);
      this.clientsForm.controls.locations_address.setValue(city.pivot.address);
      this.clientsForm.controls.locations_notes.setValue(city.pivot.notes);

      this.showMapPopup = true;
      this.overLayShow = true;
      this.addNewAddressModeStatus = true;
      this.passPopup = true;
    } else {
      this.showMapPopup = true;
      this.overLayShow = true;
      this.addNewAddressModeStatus = true;
      this.passPopup = true;
    }
  }

  setUrl(url) {
    
    this.startLoading();

    let newCity;

    let fakeUrl = '';

    let secondFake =
      "`https://www.google.com/maps/place/24%C2%B040'45.1%22N+46%C2%B042'03.2%22E/@24.6792014,46.6987053,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d24.6792014!4d46.700894`";

    console.log(url);

    var re = new RegExp('^(http|https)://', 'i');

    var match = re.test(url);

    if (match) {
      console.log(url);

      this.passPopup = false;

      if (url.includes('@')) {
        
        // var newLating = url.split('@')[1].split(',')
        var rest = url.substring(0, url.lastIndexOf('3d') + 2);
        var last = url.substring(url.lastIndexOf('3d') + 2, url.length);
        console.log(rest);
        console.log(last.split('!4d'));
        var newLating = last.split('!4d');

        // alert(pieces[pieces.length-1]);
        // console.log(newLating)
      } else {
        var latLong = url.split('=')[1].split(',');
        console.log(latLong);
      }

      // var long = url.split('=').split(',')[1]

      if (url.includes('@')) {
        if (newLating[1].includes('?')) {
          let newLog = newLating[1].split('?')[0];
          console.log(newLog);
          newLating[1] = newLog;
          console.log(newLating[1]);
        }
        this.clientsForm.controls.lat.setValue(+newLating[0]);
        this.clientsForm.controls.long.setValue(+newLating[1]);
      } else {
        this.clientsForm.controls.lat.setValue(+latLong[0]);
        this.clientsForm.controls.long.setValue(+latLong[1]);
      }

      // /validate-map/4122

      this.coreService
        .postMethod(
          'clients/validate-map/' +
            this.clientsForm.controls.citiesObj.value.id,
          {
            lat: this.clientsForm.controls.lat.value,
            long: this.clientsForm.controls.long.value
          }
        )
        .subscribe(
          responsee => {
            console.log(responsee);
            newCity = responsee['city'];
            // let newCity = this.clientsForm.controls.city_id.setValue(responsee['city']);

            this.showSuccess(responsee['message']);

            var geocoder;
            geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(
              this.clientsForm.controls.lat.value,
              this.clientsForm.controls.long.value
            );

            let cityName: string = '';
            let address: string = '';

            geocoder.geocode({ latLng: latlng }, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                  address = results[0].formatted_address;
                  var value = address.split(',');

                  let count = value.length;

                  let city;

                  if (count > 2) {
                    city = value[count - 3];
                  } else {
                    city = value[count - 1];
                  }

                  // alert("city name is: " + city);
                  cityName = city;
                }
              } else {
                alert('Geocoder failed due to: ' + status);
              }
            });
            setTimeout(() => {
              this.clientsForm.controls.locations_area.setValue(cityName);
              this.clientsForm.controls.locations_address.setValue(address);

              console.log(cityName);

              this.clientsForm.patchValue({
                city_id: newCity.id,
                citiesObj: newCity
              });

              // this.passPopup = true;

              // this.clientsForm.controls.citiesObj.value.id = newCity

              // console.log(this.clientsForm.controls.citiesObj.value.id)

              // this.clientsForm.controls.city_id.setValue(newCity);
              console.log(this.clientsForm);
            }, 2000);

            setTimeout(() => {

              this.passPopup = true ;
  
              }, 2000);
          },
          error => {
            if (error.error.errors) {
              this.showErrors(error.error.errors);
            } else {
              this.showErrors(error.error.message);
            }

            this.clientsForm.patchValue({
              city_id: '',
              citiesObj: ''
            });

            this.clientsForm.controls.lat.setValue(28.421864);
            this.clientsForm.controls.long.setValue(34.432869);
            this.clientsForm.controls.aboveUrl.setValue('');

            this.passPopup = false;

            this.showMapPopup = false;
          }
        );

      console.log(this.clientsForm.value);
    }

    this.endLoading();
  }

  savePopup() {
    this.mapDone = true;
    console.log(this.mapDone);
    this.showMapPopup = false;
  }

  searchWithLatlng() {
    this.startLoading();
    let newCity;

    this.passPopup = false ;

    console.log(this.clientsForm.value);

    // /validate-map/4122

    this.coreService
      .postMethod(
        'clients/validate-map/' + this.clientsForm.controls.citiesObj.value.id,
        {
          lat: this.clientsForm.controls.lat.value,
          long: this.clientsForm.controls.long.value
        }
      )
      .subscribe(
        responsee => {
          console.log(responsee);
          newCity = responsee['city'];
          // let newCity = this.clientsForm.controls.city_id.setValue(responsee['city']);

          this.showSuccess(responsee['message']);

          var geocoder;
          geocoder = new google.maps.Geocoder();
          var latlng = new google.maps.LatLng(
            +this.clientsForm.controls.lat.value,
            +this.clientsForm.controls.long.value
          );

          let cityName: string = '';
          let address: string = '';

          geocoder.geocode({ latLng: latlng }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                address = results[0].formatted_address;
                var value = address.split(',');

                let count = value.length;

                let city;

                if (count > 2) {
                  city = value[count - 3];
                } else {
                  city = value[count - 1];
                }

                // alert("city name is: " + city);
                cityName = city;
              }
            } else {
              alert('Geocoder failed due to: ' + status);
            }
          });
          setTimeout(() => {
            console.log(this.clientsForm.controls.citiesObj);

            this.clientsForm.controls.lat.setValue(
              +this.clientsForm.controls.lat.value
            );
            this.clientsForm.controls.long.setValue(
              +this.clientsForm.controls.long.value
            );

            var latlng = new google.maps.LatLng(
              this.clientsForm.controls.lat.value,
              this.clientsForm.controls.long.value
            );
            geocoder.geocode({ latLng: latlng });

            console.log(cityName);

            this.clientsForm.controls.locations_area.setValue(cityName);
            this.clientsForm.controls.locations_address.setValue(address);

            this.clientsForm.patchValue({
              city_id: newCity.id,
              citiesObj: newCity
            });

            // this.passPopup = true;

            console.log(this.clientsForm);
          }, 2000);

          setTimeout(() => {

            this.passPopup = true ;

            }, 2000);
        },
        error => {
          if (error.error.errors) {
            this.showErrors(error.error.errors);
          } else {
            this.showErrors(error.error.message);
          }

          this.clientsForm.patchValue({
            city_id: '',
            citiesObj: ''
          });

          this.clientsForm.controls.lat.setValue(28.421864);
          this.clientsForm.controls.long.setValue(34.432869);
          this.clientsForm.controls.aboveUrl.setValue('');

          this.passPopup = false;

          this.showMapPopup = false;
        }
      );

    this.endLoading();
  }

  onSubmitUpdateData() {
    this.showMapPopup = false;

    // this.updatedMapForm.patchValue({
    //   formAddress: '',
    //   formArea: '',
    //   formSpecialSign: '',
    //   mapFormOrgins: ''
    // });
  }
  /* --------------------------------- clicked New Orgins ----------------------------- */

  clickedNewOrgins(e) {
    // this.locations[this.locationIndex].lat =this.testLat  ;
    // this.testLat = +e.lat;
    //  this.locations[this.locationIndex].lng = this.testLong ;
    // this.testLong = +e.lng;

    this.clientsForm.controls.lat.setValue(+e.lat);
    this.clientsForm.controls.long.setValue(+e.lng);

    let newCity;

    this.passPopup = false ;
    // /validate-map/4122

    this.coreService
      .postMethod(
        'clients/validate-map/' + this.clientsForm.controls.citiesObj.value.id,
        {
          lat: this.clientsForm.controls.lat.value,
          long: this.clientsForm.controls.long.value
        }
      )
      .subscribe(
        responsee => {
          console.log(responsee);
          newCity = responsee['city'];
          // let newCity = this.clientsForm.controls.city_id.setValue(responsee['city']);

          this.showSuccess(responsee['message']);

          var geocoder;
          geocoder = new google.maps.Geocoder();
          var latlng = new google.maps.LatLng(
            this.clientsForm.controls.lat.value,
            this.clientsForm.controls.long.value
          );
          let cityName: string = '';
          let address: string = '';
          geocoder.geocode({ latLng: latlng }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                address = results[0].formatted_address;
                var value = address.split(',');

                console.log(value);

                let count = value.length;
                let city;

                if (count > 2) {
                  city = value[count - 3];
                } else {
                  city = value[count - 1];
                }

                // alert("city name is: " + city);

                cityName = city;
              }
              // else  {
              //     alert("address not found");
              // }
            } else {
              alert('Geocoder failed due to: ' + status);
            }
          });
          setTimeout(() => {
            this.clientsForm.controls.locations_area.setValue(cityName);
            this.clientsForm.controls.locations_address.setValue(address);

            console.log(cityName);

            this.clientsForm.patchValue({
              city_id: newCity.id,
              citiesObj: newCity
            });

            // this.passPopup = true;

            console.log(this.clientsForm);
          }, 2000);

          setTimeout(() => {

            this.passPopup = true ;

            }, 2000);
        },
        error => {
          if (error.error.errors) {
            this.showErrors(error.error.errors);
          } else {
            this.showErrors(error.error.message);
          }

          this.clientsForm.patchValue({
            city_id: '',
            citiesObj: ''
          });

          this.clientsForm.controls.lat.setValue(28.421864);
          this.clientsForm.controls.long.setValue(34.432869);
          this.clientsForm.controls.aboveUrl.setValue('');

          this.passPopup = false;

          this.showMapPopup = false;
        }
      );
  }

  /* --------------------------------- clicked New Orgins ----------------------------- */
  changeVidOrgins() {
    this.location = {
      lat: 21.6145938,
      lng: 39.2107495,
      address: 'test Address',
      area: 'test Area 1',
      mainLocation: true
    };
  }
  /* --------------------------------- Updated Client Data ----------------------------- */
  getUpdatedClientDetails() {
    this.coreService
      .getMethod('clients/' + this.updatedClientId, {})
      .subscribe((updatedClient: any) => {
        console.log(updatedClient);
        this.updatedClientDataLoaded = true;
        this.updatedClientData = updatedClient.data;

        console.log(updatedClient.data);
        // Start End Loading
        this.endLoading();
        // End End Loading
        this.assignUpdatedData();
      });
  }

  changeValue(value) {
    if (value == true) {
      this.verified = true;
    } else if (value == false) {
      this.verified = false;
    }
  }
  /* ------------------------------- Assign Updated Data ------------------------- */
  assignUpdatedData() {
    const data = this.updatedClientData;

    console.log(data.city);

    this.countryPhoneKey = data.city.country.phone_code;
    this.showCountryPhoneKey = true;
    this.airConditionerDisplayArray = data.air_conditioner;
    this.mobileNumber = data.mobile;
    this.clientsForm.patchValue({
      name: data.name,
      gender: data.gender,
      genderObj: data.gender_object ? data.gender_object : '',
      countriesObj: data.city.country,
      citiesObj: data.city,
      city_id: data.city_id,
      mobile: +(this.countryPhoneKey + data.mobile),
      mobileKey: data.mobile,
      email: data.email ? data.email : '',
      zone: data.zone,
      address: data.address,

      notes: data.notes,
      locations_address: data.locations[0].address,
      locations_notes: data.locations[0].notes,
      locations_city: data.locations[0].city,
      locations_area: data.locations[0].area,

      client_type: data.client_type,
      clientTypesObj: data.client_type_object,
      lat: data.lat,
      long: data.long,
      latObj: data.lat,
      longObj: data.long,
      home_type: data.home_type,
      homeTypesObj: data.home_type_object,
      home_contract_type: data.home_contract_type,
      homeContractTypesObj: data.home_contract_type_object,
      camera_number: data.camera_number,
      kitchen_number: data.kitchen_number,
      bathroom_number: data.bathroom_number,
      room_number: data.room_number,
      floor_number: data.floor_number,
      area: data.area,
      air_conditioner: data.air_conditioner,
      airConditionerTypesObj: data.air_conditioner,
      active: data.active
    });

    console.log(this.clientsForm);
  }
  /* ----------------------------------- Update Client ---------------------------- */
  onUpdate() {
    this.clientsForm.patchValue({
      mobile: +(966 + this.clientsForm.value.mobileKey)
    });
    this.submitted = true;
    this.startLoading();

    this.coreService
      .updateMethod('clients/' + this.updatedClientId, this.clientsForm.value)
      .subscribe(
        () => {
          this.showSuccess('تم تعديل العميل بنجاح');
          setTimeout(() => {
            this.router.navigate(['/clients/all-clients']);
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
  /* ---------------------------------------- Get Gender ------------------------- */
  getGenders() {
    this.coreService
      .getMethod('lookup/gender-types', {})
      .subscribe((genders: any) => {
        this.gendersArray = genders.data;
        this.gendersLoaded = true;
        this.endLoading();
        this.gendersFilteredOptions = this.clientsForm
          .get('genderObj')
          .valueChanges.pipe(
            startWith(''),
            map(value => this.filterGenders(value))
          );
      });
  }
  /* ------------------------------ Filter Genders ---------------------------- */
  filterGenders(value: any) {
    if (value !== '') {
      this.clientsForm.patchValue({
        gender: value.id
      });
    }
    if (this.gendersArray !== null) {
      return this.gendersArray.filter(option => option.name.includes(value));
    }
  }
  /* ----------------------------- Add Location on Map ---------------------------- */
  addMapLocation(e) {
    let long = '';
    let lat = '';
    if (e.target.value !== '') {
      const url = e.target.value;
      const directionArray = url.split(', ');
      if (directionArray !== null) {
        lat = directionArray[0];
        long = directionArray[1];
      }
    }
    this.clientsForm.patchValue({ long, longObj: long });
    this.clientsForm.patchValue({ lat, latObj: lat });
  }
  /* ---------------------------- Get Air Condition Types ---------------------------- */
  getAirConditionerTypes() {
    this.coreService
      .getMethod('lookup/airconditioner-types', {})
      .subscribe((airConditionerTypes: any) => {
        this.airConditionerTypesArray = airConditionerTypes.data;
        this.airConditionerTypesLoaded = true;
        this.endLoading();
        this.airConditionerTypesFilteredOptions = this.clientsForm
          .get('airConditionerTypesObj')
          .valueChanges.pipe(
            startWith(''),
            map(value => this.filterAirConditionerTypes(value))
          );
      });
  }
  /* -------------------------- Filter Air Condition ------------------------------- */
  filterAirConditionerTypes(value: any) {
    if (typeof value === 'object') {
      this.airConditionerTypeSelected = value.id;
      this.airConditionerNameSelected = value.name;
    }
    if (this.airConditionerTypesArray !== null) {
      this.airConditionerTypeSelected = value.id;
      return this.airConditionerTypesArray.filter(option =>
        option.name.includes(value)
      );
    }
  }
  /* ---------------------------- Get Home Contracts --------------------------- */
  getHomeContractTypes() {
    this.coreService
      .getMethod('lookup/home-contract-types', {})
      .subscribe((homeContractTypes: any) => {
        this.homeContractTypesArray = homeContractTypes.data;
        this.homeContractTypesLoaded = true;
        this.endLoading();
        this.homeContractTypesFilteredOptions = this.clientsForm
          .get('homeContractTypesObj')
          .valueChanges.pipe(
            startWith(''),
            map(value => this.filterHomeContractTypes(value))
          );
      });
  }
  /* --------------------- Filter Home Contracts --------------------------- */
  filterHomeContractTypes(value: any) {
    if (typeof value === 'object') {
      this.clientsForm.patchValue({
        home_contract_type: value.id
      });
    }
    if (this.homeContractTypesArray !== null) {
      return this.homeContractTypesArray.filter(option =>
        option.name.includes(value)
      );
    }
  }
  /* ---------------------------------- Get Home Types ------------------------ */
  getHomeTypes() {
    this.coreService
      .getMethod('lookup/home-types', {})
      .subscribe((homeTypes: any) => {
        this.homeTypesArray = homeTypes.data;
        this.homeTypesLoaded = true;
        this.endLoading();
        this.homeTypesFilteredOptions = this.clientsForm
          .get('homeTypesObj')
          .valueChanges.pipe(
            startWith(''),
            map(value => this.filterHomeTypes(value))
          );
      });
  }
  /* -------------------------- Filter Home --------------------------- */
  filterHomeTypes(value: any) {
    if (typeof value === 'object') {
      this.clientsForm.patchValue({
        home_type: value.id
      });
    }
    if (this.homeTypesArray !== null) {
      return this.homeTypesArray.filter(option => option.name.includes(value));
    }
  }
  /* ------------------------------ Get Clients ----------------------------- */
  getClientTypes() {
    this.coreService
      .getMethod('lookup/client-types', {})
      .subscribe((clientTypes: any) => {
        this.clientTypesArray = clientTypes.data;
        this.clientTypesLoaded = true;
        this.endLoading();
        this.clientTypesFilteredOptions = this.clientsForm
          .get('clientTypesObj')
          .valueChanges.pipe(
            startWith(''),
            map(value => this.filterClientTypes(value))
          );
      });
  }
  /* ----------------------- Filter Clients ------------------------ */
  filterClientTypes(value: any) {
    if (typeof value === 'object') {
      this.clientsForm.patchValue({
        client_type: value.id
      });
    }
    if (this.clientTypesArray !== null) {
      return this.clientTypesArray.filter(option =>
        option.name.includes(value)
      );
    }
  }
  /* ------------------------- Get Countries ------------------------ */
  getCountries() {
    this.coreService.getMethod('countries', {}).subscribe((genders: any) => {
      this.countriesArray = genders.data;
      this.countriesLoaded = true;
      this.showCountryPhoneKey = true;
      this.countryPhoneKey = this.countriesArray[0].phone_code;
      // this.getCities(this.countriesArray[0].id);
    });
  }
  /* ---------------------- Filter Countries --------------------------- */
  filterCountries(value: any) {
    if (typeof value === 'object') {
      this.showCountryPhoneKey = true;
      this.countryPhoneKey = value.phone_code;
      // this.getCities(value.id);
      this.startLoading();
    } else {
      this.showCountryPhoneKey = false;
    }
    if (this.countriesArray !== null) {
      return this.countriesArray.filter(option => option.name.includes(value));
    }
  }
  /* ------------------------ Get Cities ----------------------------- */

  getCities() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let companySlug = currentUser.company_slug;
    console.log(companySlug);
    this.coreService.getMethod('cities', {}).subscribe((cities: any) => {
      this.endLoading();
      console.log(cities);
      this.citiesArray = cities.data;
      console.log(this.citiesArray);
      this.citiesFilteredOptions = this.clientsForm
        .get('citiesObj')
        .valueChanges.pipe(
          startWith(''),
          map(value => this.filterCities(value))
        );
    });
  }

  /* --------------------- Filter Cities ----------------------- */
  filterCities(value: any) {
    if (typeof value === 'object') {
      this.clientsForm.patchValue({
        city_id: value.id
        // citiesObj: value
      });

      this.cityDetails = value;
    }

    if (this.citiesArray !== null) {
      return this.citiesArray.filter(option => option.name.includes(value));
    }
  }

  /* ---------------------------- Create Client ------------------------------ */

  onSubmit() {
    this.clientsForm.patchValue({
      mobile: +(this.countryPhoneKey + this.mobileNumber)
    });
    this.submitted = true;
    this.startLoading();
    this.coreService.postMethod('clients', this.clientsForm.value).subscribe(
      () => {
        this.showSuccess('تم تسجيل العميل بنجاح');
        setTimeout(() => {
          if (this.addOrderClient) {
            this.router.navigate(['/orders/add-order']);
          } else if (this.invoiceClient) {
            this.router.navigate(['/invoices/client-invoice']);
          } else {
            this.router.navigate(['/clients/all-clients']);
          }
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
  /* --------------------------- Air Count -------------------------------- */
  addAirConditionCount(count) {
    this.airConditionerCountSelected = Number(
      count
        .replace(/[٠١٢٣٤٥٦٧٨٩]/g, d => {
          return d.charCodeAt(0) - 1632; // Convert Arabic Numbers
        })
        .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, d => {
          return d.charCodeAt(0) - 1776; // Convert Persian Numbers
        })
    );
  }
  /* ----------------------- Air Condition -------------------------- */
  addAirCondition() {
    this.clientsForm.value.air_conditioner.push({
      id: this.airConditionerTypeSelected,
      count: this.airConditionerCountSelected,
      name: this.airConditionerNameSelected
    });
    (document.getElementById('airCountInput') as HTMLInputElement).value = '';
    (document.getElementById('airTypeInput') as HTMLInputElement).value = '';
    this.airConditionerCountSelected = '';
    this.airConditionerTypeSelected = '';
    this.airConditionerNameSelected = '';
    this.airConditionerTypesFilteredOptions = this.clientsForm
      .get('airConditionerTypesObj')
      .valueChanges.pipe(
        startWith(''),
        map(value => this.filterAirConditionerTypes(value))
      );
  }
  /* -------------------- Delete Air Condition --------------------------- */
  deleteAirConditioner(id) {
    const newDisplayArray = this.airConditionerDisplayArray.filter(
      option => option.id !== id
    );
    this.airConditionerDisplayArray = newDisplayArray;
    const newFormArray = this.clientsForm.value.air_conditioner.filter(
      option => option.id !== id
    );
    this.clientsForm.patchValue({
      air_conditioner: newFormArray
    });
  }
  /* -------------------------- Display ----------------------------- */
  displayOptionsFunction(state) {
    if (state !== null && state !== undefined) {
      return state.name;
    }
  }

  getCites(value) {
    this.getLocationOnMapSelect(value);
  }

  /* -------------------------- Check Number ----------------------- */
  isNumber(val) {
    return typeof val === 'number';
  }
  /* ---------------------- Mobile ---------------------------- */
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
  /* ----------------------- Active ------------------------ */
  changeActive(e) {
    this.clientsForm.patchValue({
      active: e.checked
    });
  }
  /* ------------------ Start Loading ------------------------- */
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  /* ---------------------- End loading ------------------------- */
  endLoading() {
    if (
      //
      this.gendersLoaded &&
      this.clientTypesLoaded &&
      this.countriesLoaded &&
      this.homeTypesLoaded &&
      this.homeContractTypesLoaded &&
      this.airConditionerTypesLoaded &&
      this.updatedClientDataLoaded
    ) {
      this.pageLoaded = true;
      this.loaderService.endLoading();
    }
  }
  /* ---------------------- Show Error Message ------------------------- */
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
  /* ------------------------ Show Success Message ------------------------- */
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
