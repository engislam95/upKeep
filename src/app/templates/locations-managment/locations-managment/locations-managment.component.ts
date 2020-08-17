import { Component, OnInit } from '@angular/core';
import { CoreService } from './../../../tools/shared-services/core.service';
import { LoaderService } from 'src/app/tools/shared-services/loader.service';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MapsAPILoader, MouseEvent } from '@agm/core';

@Component({
  selector: 'app-locations-managment',
  templateUrl: './locations-managment.component.html',
  styleUrls: ['./locations-managment.component.scss']
})
export class LocationsManagmentComponent implements OnInit {
  pageLoaded = false;
  locations = [
    {
      id: 1,
      lat: 21.656038071580785,
      long: 39.119307696819305,
      default: 1,
      city: 'الرياض',
      above_url: 'https://fdjksakjfdjfadsafdadsf ',
      notes: 'اهلا بيك ',
      address: 'من بحرى وبنحبوووه'
    }
  ];

  responseState: any = '';
  responseData: any = '';
  submitted: boolean = false;
  passPopup = true;

  updatedLocationData;
  showMapPopup = false;
  overLayShow = false;
  addNewAddressModeStatus = false;
  isUpdate = false;
  clientDetails;
  clientId;
  urlmap;
  defaultAddress;
  private geoCoder;
  citiesArray = [];
  cityID;

  locationsForm = new FormGroup({
    above_url: new FormControl(''),
    lat: new FormControl('', Validators.required),
    long: new FormControl('', Validators.required),
    notes: new FormControl(''),
    locations_address: new FormControl('', Validators.required),
    locations_area: new FormControl('', Validators.required)
  });

  constructor(
    private coreService: CoreService,
    private mapsAPILoader: MapsAPILoader,
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit() {
    console.log(this.locationsForm.controls.lat.value);
    console.log(this.locationsForm.controls.long.value);

    // Get Client Id
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.clientId = queryParams.clientId;
      // this.getClientDetails(this.clientId);
      this.getCities();
      this.urlmap =
        'http://maps.google.com/maps?q=' +
        this.locationsForm.controls.lat.value +
        ',' +
        this.locationsForm.controls.long.value;
    });

    this.startLoading();
    setTimeout(() => {
      this.endLoading();
    }, 1000);
  }

  copyURL(text) {
    console.log(text);
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.showSuccess('تم النسخ');
  }

  searchWithLatlng() {
    this.startLoading();

    console.log(this.locationsForm.value);

    this.coreService
      .postMethod('locations/validate-map/' + this.cityID, {
        lat: this.locationsForm.controls.lat.value,
        long: this.locationsForm.controls.long.value
      })
      .subscribe(
        responsee => {
          console.log(responsee);

          this.showSuccess(responsee['message']);

          var geocoder;
          geocoder = new google.maps.Geocoder();
          var latlng = new google.maps.LatLng(
            +this.locationsForm.controls.lat.value,
            +this.locationsForm.controls.long.value
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
            // console.log(this.locationsForm.controls.citiesObj);

            this.locationsForm.controls.lat.setValue(
              +this.locationsForm.controls.lat.value
            );
            this.locationsForm.controls.long.setValue(
              +this.locationsForm.controls.long.value
            );

            var latlng = new google.maps.LatLng(
              this.locationsForm.controls.lat.value,
              this.locationsForm.controls.long.value
            );

            this.passPopup = true;

            geocoder.geocode({ latLng: latlng });

            this.locationsForm.controls.locations_area.setValue(cityName);
            this.locationsForm.controls.locations_address.setValue(address);
            console.log(cityName);
          }, 1000);
        },
        error => {
          if (error.error.errors) {
            this.showErrors(error.error.errors);
          } else {
            this.showErrors(error.error.message);
          }

          this.locationsForm.controls.lat.setValue(28.421864);
          this.locationsForm.controls.long.setValue(34.432869);
          this.locationsForm.controls.above_url.setValue('');

          this.locationsForm.controls.locations_area.setValue('');
          this.locationsForm.controls.locations_address.setValue('');

          this.showMapPopup = false;

          this.passPopup = false;
        }
      );

    this.endLoading();
  }

  // ─── START GET CLIENT DETAILS ────────────────────────────────────
  //

  getCities() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let companySlug = currentUser.company_slug;
    let cityName;
    console.log(companySlug);
    this.coreService.getMethod('cities', {}).subscribe((cities: any) => {
      this.endLoading();
      console.log(cities.data);
      // cities.data.map(city => {
      //   console.log(city.name)
      //   cityName = city.name ;
      //   this.getLocationOnMapSelect(city.name)
      // })
      this.citiesArray = cities.data;
      console.log(this.citiesArray);
    });
  }

  /* -------------------------- Reset Input ---------------------------- */
  xResetInputs(key) {
    if (key === 'above_url') {
      (document.getElementById('above_url') as HTMLInputElement).value = '';
      this.locationsForm.patchValue({ above_url: '' });
    }
  }

  getLocationOnMapSelect(cityName) {
    let newLocation = {
      lat: null,
      lng: null,
      address: 'test Address',
      area: 'test Area 1',
      mainLocation: true,
      above_url: ''
    };

    let address: string = '';

    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
      this.geoCoder.geocode(
        {
          address: cityName
        },
        function(results, status) {
          console.log(results);
          newLocation.lat = results[0].geometry.location.lat();
          newLocation.lng = results[0].geometry.location.lng();
          console.log(newLocation.lng);

          newLocation.above_url =
            'http://maps.google.com/maps?q=' +
            newLocation.lat +
            ',' +
            newLocation.lng;

          address = results[0].formatted_address;
        }
      );
    });

    setTimeout(() => {
      this.locationsForm.controls.lat.setValue(newLocation.lat);
      this.locationsForm.controls.long.setValue(newLocation.lng);
      this.locationsForm.controls.above_url.setValue(newLocation.above_url);

      console.log(this.locationsForm.value);
    }, 500);
  }

  getClientDetails(clientId) {
    this.coreService
      .getMethod('cities/' + clientId, {})
      .subscribe((clientDetails: any) => {
        // Start LOADING Loading
        this.endLoading();

        console.log(clientDetails);

        // End LOADING Loading
        this.clientDetails = clientDetails.data;
        console.log(this.clientDetails.locations.length);

        this.locations = clientDetails.data.locations;

        this.clientDetails.locations.forEach(element => {
          this.defaultAddress = element.default;
        });
        // console.log('locations', this.locations);
        // TODO
      });
  }

  clickedNewOrgins(e) {
    this.locationsForm.controls.lat.setValue(+e.lat);
    this.locationsForm.controls.long.setValue(+e.lng);

    let cityName;
    let address;

    // /validate-map/4122

    this.coreService
      .postMethod('locations/validate-map/' + this.cityID, {
        lat: this.locationsForm.controls.lat.value,
        long: this.locationsForm.controls.long.value
      })
      .subscribe(
        responsee => {
          console.log(responsee);

          this.showSuccess(responsee['message']);

          var geocoder;
          geocoder = new google.maps.Geocoder();
          var latlng = new google.maps.LatLng(
            this.locationsForm.controls.lat.value,
            this.locationsForm.controls.long.value
          );

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
            this.locationsForm.controls.locations_area.setValue(cityName);
            this.locationsForm.controls.locations_address.setValue(address);

            console.log(cityName);

            this.passPopup = true;

            console.log(this.locationsForm);
          }, 2000);
        },
        error => {
          if (error.error.errors) {
            this.showErrors(error.error.errors);
          } else {
            this.showErrors(error.error.message);
          }

          this.locationsForm.controls.lat.setValue(28.421864);
          this.locationsForm.controls.long.setValue(34.432869);
          this.locationsForm.controls.above_url.setValue('');

          this.locationsForm.controls.locations_area.setValue('');
          this.locationsForm.controls.locations_address.setValue('');

          this.showMapPopup = false;

          this.passPopup = false;
        }
      );

    console.log(this.locationsForm.value);
  }

  addAdress(cityId) {
    console.log(cityId);
    this.locationsForm.controls.lat.setValue(null);
    this.locationsForm.controls.long.setValue(null);

    this.locationsForm.patchValue({
      above_url: '',
      notes: ''
    });

    this.showMapPopup = true;
    this.overLayShow = true;
    this.addNewAddressModeStatus = true;
    this.isUpdate = false;
    this.passPopup = true;

    this.cityID = cityId.id;

    this.getLocationOnMap(cityId.name);

    // this.addNewLocation(cityId)
  }

  // setUrl(url) {

  //   this.startLoading();

  //   let newCity ;

  //   let fakeUrl =
  //     'http://maps.google.com/maps?q=21.656038071580785,39.119307696819305';

  //   let secondFake = "https://www.google.com/maps/place/24%C2%B040'45.1%22N+46%C2%B042'03.2%22E/@24.6792014,46.6987053,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d24.6792014!4d46.700894"

  //   console.log(url);

  //   var re = new RegExp("^(http|https)://", "i");

  //   var match = re.test(url);

  //   if(match)
  //   {

  //     console.log(url)

  //     if(url.includes('@'))
  //     {

  //       // var newLating = url.split('@')[1].split(',')
  //       var rest = url.substring(0, url.lastIndexOf("3d") + 2);
  //       var last = url.substring(url.lastIndexOf("3d") + 2, url.length);
  //       console.log(rest)
  //       console.log(last.split('!4d'))
  //       var newLating = last.split('!4d')

  //       // alert(pieces[pieces.length-1]);
  //       // console.log(newLating)

  //     }

  //     else
  //     {

  //       var latLong = url.split('=')[1].split(',');
  //       console.log(latLong);

  //     }

  //     // var long = url.split('=').split(',')[1]

  //     if(url.includes('@'))
  //     {
  //       this.locationsForm.controls.lat.setValue(+newLating[0]);
  //       this.locationsForm.controls.long.setValue(+newLating[1]);
  //     }
  //     else
  //     {
  //       this.locationsForm.controls.lat.setValue(+latLong[0]);
  //       this.locationsForm.controls.long.setValue(+latLong[1]);
  //     }

  //     console.log(this.locationsForm.value);

  //     var geocoder;
  //     geocoder = new google.maps.Geocoder();
  //     var latlng = new google.maps.LatLng(
  //       this.locationsForm.controls.lat.value,
  //       this.locationsForm.controls.long.value
  //     );

  //     let cityName: string = '';
  //     let address : string = ''

  //     geocoder.geocode({ latLng: latlng }, function(results, status) {
  //       if (status == google.maps.GeocoderStatus.OK) {
  //         if (results[0]) {
  //           address = results[0].formatted_address;
  //           var value = address.split(',');

  //           let count = value.length;

  //           let city ;

  //           if(count > 2)
  //           {

  //           city = value[count - 3];
  //           }
  //           else
  //           {
  //             city = value[count - 1];

  //           }

  //           // alert("city name is: " + city);
  //           cityName = city;
  //         }
  //       } else {
  //         alert('Geocoder failed due to: ' + status);
  //       }
  //     });
  //     setTimeout(() => {

  //       console.log(cityName);
  //       console.log(this.locationsForm) ;

  //     }, 2000);

  //   }

  //   this.endLoading();
  // }

  setUrl(url) {
    this.startLoading();

    let newCity;

    let fakeUrl =
      'http://maps.google.com/maps?q=21.656038071580785,39.119307696819305';

    let secondFake =
      "https://www.google.com/maps/place/24%C2%B040'45.1%22N+46%C2%B042'03.2%22E/@24.6792014,46.6987053,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d24.6792014!4d46.700894";

    console.log(url);

    var re = new RegExp('^(http|https)://', 'i');

    var match = re.test(url);

    let cityName;
    let address;

    if (match) {
      console.log(url);

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
        this.locationsForm.controls.lat.setValue(+newLating[0]);
        this.locationsForm.controls.long.setValue(+newLating[1]);
      } else {
        this.locationsForm.controls.lat.setValue(+latLong[0]);
        this.locationsForm.controls.long.setValue(+latLong[1]);
      }

      // /validate-map/4122

      this.coreService
        .postMethod('locations/validate-map/' + this.cityID, {
          lat: this.locationsForm.controls.lat.value,
          long: this.locationsForm.controls.long.value
        })
        .subscribe(
          responsee => {
            console.log(responsee);

            this.showSuccess(responsee['message']);

            var geocoder;
            geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(
              this.locationsForm.controls.lat.value,
              this.locationsForm.controls.long.value
            );

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

                  cityName = city;
                }
              } else {
                alert('Geocoder failed due to: ' + status);
              }
            });

            setTimeout(() => {
              this.locationsForm.controls.locations_area.setValue(cityName);
              this.locationsForm.controls.locations_address.setValue(address);

              console.log(cityName);

              this.passPopup = true;

              console.log(this.locationsForm);
            }, 2000);
          },

          error => {
            if (error.error.errors) {
              this.showErrors(error.error.errors);
            } else {
              this.showErrors(error.error.message);
            }

            this.locationsForm.controls.lat.setValue(28.421864);
            this.locationsForm.controls.long.setValue(34.432869);
            this.locationsForm.controls.above_url.setValue('');
            this.locationsForm.controls.locations_area.setValue('');
            this.locationsForm.controls.locations_address.setValue('');

            this.showMapPopup = false;

            this.passPopup = false;
          }
        );

      console.log(this.locationsForm.value);
    }

    this.endLoading();
  }

  /* ------------------------------- Assign Updated Location Data ------------------------- */

  assignUpdatedLocationData() {
    const data = this.updatedLocationData;
    this.locationsForm.patchValue({
      lat: data.pivot.lat,
      long: data.pivot.long,
      notes: data.pivot.notes,
      above_url: data.pivot.above_url,
      locations_area: data.pivot.area,
      locations_address: data.pivot.address
    });

    this.showMapPopup = true;
    this.overLayShow = true;
    this.addNewAddressModeStatus = true;
    this.isUpdate = true;
    console.log(this.locationsForm);
  }

  /* ------------------------------- get  Location Data ------------------------- */

  getLocationDetails(location) {
    this.updatedLocationData = location;
    this.cityID = location.id;
    this.assignUpdatedLocationData();
  }

  addNewLocation(cityId) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let companySlug = currentUser.company_slug;

    this.coreService
      .updateMethod('locations/update/' + this.cityID, {
        long: this.locationsForm.controls.long.value,
        lat: this.locationsForm.controls.lat.value,
        notes: this.locationsForm.controls.notes.value,
        above_url: this.locationsForm.controls.above_url.value,
        area: this.locationsForm.controls.locations_area.value,
        address: this.locationsForm.controls.locations_address.value
      })

      .subscribe(
        () => {
          this.showSuccess('تم إضافة الموقع بنجاح');
          // this.getClientDetails(this.clientId);
          this.getCities();
        },
        error => {
          if (error.error.errors) {
            this.showErrors(error.error.errors);
          } else {
            this.showErrors(error.error.message);
          }
        }
      );
    this.showMapPopup = false;
  }

  updateLocation() {
    this.coreService
      .updateMethod('locations/update/' + this.cityID, {
        long: this.locationsForm.controls.long.value,
        lat: this.locationsForm.controls.lat.value,
        notes: this.locationsForm.controls.notes.value,
        above_url: this.locationsForm.controls.above_url.value,
        area: this.locationsForm.controls.locations_area.value,
        address: this.locationsForm.controls.locations_address.value
      })
      .subscribe(
        () => {
          this.showSuccess('تم تعديل الموقع بنجاح');
          // this.getClientDetails(this.clientId);
          this.getCities();

          this.isUpdate = false;
        },
        error => {
          if (error.error.errors) {
            this.showErrors(error.error.errors);
          } else {
            this.showErrors(error.error.message);
          }
        }
      );
    this.showMapPopup = false;
  }

  getLocationOnMap(cityName) {
    let newLocation = {
      lat: null,
      lng: null,
      address: 'test Address',
      area: 'test Area 1',
      mainLocation: true
    };

    let address: string = '';

    setTimeout(() => {
      this.mapsAPILoader.load().then(() => {
        this.geoCoder = new google.maps.Geocoder();

        this.geoCoder.geocode(
          {
            address: cityName
          },
          function(results, status) {
            console.log(results);
            newLocation.lat = results[0].geometry.location.lat();
            newLocation.lng = results[0].geometry.location.lng();

            console.log(newLocation.lng);

            address = results[0].formatted_address;
          }
        );
      });
    }, 500);

    setTimeout(() => {
      this.locationsForm.controls.lat.setValue(newLocation.lat);
      this.locationsForm.controls.long.setValue(newLocation.lng);
      this.locationsForm.controls.locations_area.setValue(cityName);
      this.locationsForm.controls.locations_address.setValue(address);

      console.log(this.locationsForm.value);
    }, 1000);
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
