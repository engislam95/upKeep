import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from './../../../tools/shared-services/core.service';
import { LoaderService } from './../../../tools/shared-services/loader.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { fade } from '../../../tools/shared_animations/fade';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';

@Component({
  selector: 'app-add-new-map',
  templateUrl: './add-new-map.component.html',
  styleUrls: ['./add-new-map.component.scss'],
  animations: fade
})
export class AddNewMapComponent implements OnInit {

  clientId: any;
  cityId;
  clientDetails;
  responseState: any = '';
  responseData: any = '';
  submitted: boolean = false;
  clientLat;
  clientLong;
  passPopup = true;
  clientName;
  clientMobileNumber;
  clientCityId;
  clientStatusActivation;
  locations;
  locationsArrayLength;
  defaultAddress;
  pageLoaded = false;
  status;
  clientType;
  created_at;
  created_by;
  cityName;
  clientNotes;
  updated_at;
  clientAddress;
  hideme = [];
  urlmap;
  showDeletePopup = false;
  newCityId;
  lat;
  long;
  showMapPopup = false;
  overLayShow = false;
  addNewAddressModeStatus = false;
  isUpdate = false;
  updatedLocationData;
  private geoCoder;
  showDetails = false;

  clientsForm = new FormGroup({
    aboveUrl: new FormControl(''),
    lat: new FormControl('', Validators.required),
    long: new FormControl('', Validators.required),
    locations_address: new FormControl('', Validators.required),
    locations_notes: new FormControl('', Validators.required),
    locations_area: new FormControl('', Validators.required),
  })


  constructor(private activatedRoute: ActivatedRoute, private coreService: CoreService, private loaderService: LoaderService, private mapsAPILoader: MapsAPILoader, private responseStateService: ResponseStateService,) { }

  ngOnInit() {

    // Get Client Id
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.clientId = queryParams.clientId;
      this.getClientDetails(this.clientId);
      // this.getLocationOnMap();
      this.urlmap = 'http://maps.google.com/maps?q=' + this.clientsForm.controls.lat.value + ',' + this.clientsForm.controls.long.value


    });


  }

  // ─── START GET CLIENT DETAILS ────────────────────────────────────
  //

  getClientDetails(clientId) {
    this.coreService
      .getMethod('clients/' + clientId, {})
      .subscribe((clientDetails: any) => {
        // Start LOADING Loading
        this.endLoading();

        console.log(clientDetails)


        // End LOADING Loading
        this.clientDetails = clientDetails.data;
        console.log(this.clientDetails.locations.length)

        this.clientLong = this.clientDetails.long;
        this.clientLat = this.clientDetails.lat;
        // TODO
        this.clientName = this.clientDetails.name;
        // console.log(this.clientName);
        this.clientMobileNumber = this.clientDetails.mobile;
        // console.log(this.clientMobileNumber);
        this.clientCityId = this.clientDetails.city.id;
        // console.log(this.clientCityId);
        this.clientStatusActivation = this.clientDetails.active;
        // console.log(this.clientStatusActivation);
        this.locationsArrayLength = clientDetails.data.locations.length;
        console.log(this.locationsArrayLength)

        this.locations = clientDetails.data.locations

        this.cityId = clientDetails.data.city.id

        this.status = this.clientDetails.status;
        this.clientType = this.clientDetails.client_type
        this.created_at = this.clientDetails.created_at
        this.created_by = this.clientDetails.created_by
        this.cityName = this.clientDetails.city.name;
        this.clientNotes = this.clientDetails.notes;
        // this.lat = clientDetails.lat  ;
        // this.long = clientDetails.long ;

        this.updated_at = this.clientDetails.locations[0].updated_at

        this.clientAddress = this.clientDetails.address;
        // TODO
        this.clientName = this.clientDetails.name;

        this.lat = this.clientDetails.locations[0].lat;
        this.long = this.clientDetails.locations[0].long;



        this.clientDetails.locations.forEach(element => {
          this.defaultAddress = element.default;
        });
        // console.log('locations', this.locations);
        // TODO
      });
  }

  /* -------------------------- Reset Input ---------------------------- */
  xResetInputs(key) {

    if (key === 'aboveUrl') {
      this.clientsForm.patchValue({ aboveUrl: '' });
    }

    (document.getElementById(key) as HTMLInputElement).value = '';
    this.clientsForm.controls[key].patchValue('');
  }

  getLocationOnMap() {
    let newLocation = {
      lat: null,
      lng: null,
      address: 'test Address',
      area: 'test Area 1',
      mainLocation: true
    };


    let address: string = ''

    setTimeout(() => {
      this.mapsAPILoader.load().then(() => {
        this.geoCoder = new google.maps.Geocoder();

        this.geoCoder.geocode(
          {
            address: 'الرياض'
          },
          function (results, status) {
            console.log(results);
            newLocation.lat = results[0].geometry.location.lat();
            newLocation.lng = results[0].geometry.location.lng();
            console.log(newLocation.lng);

            address = results[0].formatted_address
          }
        );
      });
    }, 2000);

    setTimeout(() => {
      this.clientsForm.controls.lat.setValue(newLocation.lat);
      this.clientsForm.controls.long.setValue(newLocation.lng);
      console.log(this.clientsForm.value);
    }, 4000);
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
  //       this.clientsForm.controls.lat.setValue(+newLating[0]);
  //       this.clientsForm.controls.long.setValue(+newLating[1]);
  //     }
  //     else
  //     {
  //       this.clientsForm.controls.lat.setValue(+latLong[0]);
  //       this.clientsForm.controls.long.setValue(+latLong[1]);
  //     }

  //     // /validate-map/4122

  //     this.coreService.postMethod('clients/validate-map/' + this.clientsForm.controls.citiesObj.value.id , {
  //       lat:this.clientsForm.controls.lat.value ,
  //       long: this.clientsForm.controls.long.value
  //     }).subscribe(
  //       (responsee) => {
  //         console.log(responsee)
  //         newCity= responsee['city']
  //         // let newCity = this.clientsForm.controls.city_id.setValue(responsee['city']);

  //         this.showSuccess(responsee['message']);



  //         var geocoder;
  //         geocoder = new google.maps.Geocoder();
  //         var latlng = new google.maps.LatLng(
  //           this.clientsForm.controls.lat.value,
  //           this.clientsForm.controls.long.value
  //         );

  //         let cityName: string = '';
  //         let address : string = ''

  //         geocoder.geocode({ latLng: latlng }, function(results, status) {
  //           if (status == google.maps.GeocoderStatus.OK) {
  //             if (results[0]) {
  //               address = results[0].formatted_address;
  //               var value = address.split(',');

  //               let count = value.length;

  //               let city ;

  //               if(count > 2)
  //               {

  //               city = value[count - 3];
  //               }
  //               else
  //               {
  //                 city = value[count - 1];

  //               }

  //               // alert("city name is: " + city);
  //               cityName = city;
  //             }
  //           } else {
  //             alert('Geocoder failed due to: ' + status);
  //           }
  //         });
  //         setTimeout(() => {

  //           this.clientsForm.controls.locations_area.setValue(cityName);
  //           this.clientsForm.controls.locations_address.setValue(address);


  //         }, 2000);


  //       },
  //       error => {
  //         if (error.error.errors) {
  //           this.showErrors(error.error.errors);
  //         } else {
  //           this.showErrors(error.error.message);
  //         }

  //         this.clientsForm.patchValue({
  //           city_id: '',
  //           citiesObj: ''
  //         });

  //         this.clientsForm.controls.lat.setValue(28.421864);
  //         this.clientsForm.controls.long.setValue(34.432869);
  //         this.clientsForm.controls.aboveUrl.setValue('');

  //           this.showMapPopup = false;


  //       }
  //     )


  //     console.log(this.clientsForm.value);



  //   }



  //   this.endLoading();
  // }


  setUrl(url) {

    this.startLoading();

    let newCity;

    let fakeUrl =
      'http://maps.google.com/maps?q=21.656038071580785,39.119307696819305';

    let secondFake = "https://www.google.com/maps/place/24%C2%B040'45.1%22N+46%C2%B042'03.2%22E/@24.6792014,46.6987053,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d24.6792014!4d46.700894"

    console.log(url);

    var re = new RegExp("^(http|https)://", "i");

    var match = re.test(url);

    if (match) {

      this.passPopup = false;

      console.log(url)

      if (url.includes('@')) {

        // var newLating = url.split('@')[1].split(',')
        var rest = url.substring(0, url.lastIndexOf("3d") + 2);
        var last = url.substring(url.lastIndexOf("3d") + 2, url.length);
        console.log(rest)
        console.log(last.split('!4d'))
        var newLating = last.split('!4d')


        // alert(pieces[pieces.length-1]);
        // console.log(newLating)

      }

      else {

        var latLong = url.split('=')[1].split(',');
        console.log(latLong);

      }




      // var long = url.split('=').split(',')[1]

      if (url.includes('@')) {
        this.clientsForm.controls.lat.setValue(+newLating[0]);
        this.clientsForm.controls.long.setValue(+newLating[1]);
      }
      else {
        this.clientsForm.controls.lat.setValue(+latLong[0]);
        this.clientsForm.controls.long.setValue(+latLong[1]);
      }

      // /validate-map/4122

      // /validate-map/4122

      this.coreService
        .postMethod(
          'clients/validate-map/' +
          this.cityId,
          {
            lat: this.clientsForm.controls.lat.value,
            long: this.clientsForm.controls.long.value
          }
        )
        .subscribe(
          responsee => {
            console.log(responsee);
            if (responsee['city']) {
              newCity = responsee['city'];
              this.newCityId = responsee['city'].id;
            }

            this.showSuccess(responsee['message']);


            var geocoder;
            geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(
              this.clientsForm.controls.lat.value,
              this.clientsForm.controls.long.value
            );


            let cityName: string = '';
            let address: string = ''

            geocoder.geocode({ latLng: latlng }, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                  address = results[0].formatted_address;
                  var value = address.split(',');

                  let count = value.length;

                  let city;

                  if (count > 2) {

                    city = value[count - 3];
                  }
                  else {
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


              // this.passPopup = true ;

              // this.clientsForm.controls.citiesObj.value.id = newCity

              // console.log(this.clientsForm.controls.citiesObj.value.id)

              // this.clientsForm.controls.city_id.setValue(newCity);
              console.log(this.clientsForm);


            }, 2000);

            setTimeout(() => {

              this.passPopup = true;

            }, 3000);


          },
          error => {
            if (error.error.errors) {
              this.showErrors(error.error.errors);
            } else {
              this.showErrors(error.error.message);
            }


            this.clientsForm.controls.lat.setValue(28.421864);
            this.clientsForm.controls.long.setValue(34.432869);
            this.clientsForm.controls.aboveUrl.setValue('');

            this.showMapPopup = false;

            this.passPopup = false;



          }
        )


      console.log(this.clientsForm.value);



    }



    this.endLoading();
  }



  searchWithLatlng() {
    this.startLoading();
    let newCity;

    console.log(this.clientsForm.value);

    this.passPopup = false;
    this.coreService
      .postMethod(
        'clients/validate-map/' +
        this.cityId,
        {
          lat: this.clientsForm.controls.lat.value,
          long: this.clientsForm.controls.long.value
        }
      )
      .subscribe(
        responsee => {
          console.log(responsee);
          if (responsee['city']) {
            newCity = responsee['city'];
            this.newCityId = responsee['city'].id;
          }
          // let newCity = this.clientsForm.controls.city_id.setValue(responsee['city']);

          this.showSuccess(responsee['message']);

          var geocoder;
          geocoder = new google.maps.Geocoder();
          var latlng = new google.maps.LatLng(
            +this.clientsForm.controls.lat.value,
            +this.clientsForm.controls.long.value
          );

          let cityName: string = '';
          let address: string = ''

          geocoder.geocode({ latLng: latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                address = results[0].formatted_address;
                var value = address.split(',');

                let count = value.length;



                let city;

                if (count > 2) {

                  city = value[count - 3];
                }
                else {
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

            this.clientsForm.controls.lat.setValue(+this.clientsForm.controls.lat.value);
            this.clientsForm.controls.long.setValue(+this.clientsForm.controls.long.value);

            var latlng = new google.maps.LatLng(
              this.clientsForm.controls.lat.value,
              this.clientsForm.controls.long.value
            );
            geocoder.geocode({ latLng: latlng })

            console.log(cityName);

            this.clientsForm.controls.locations_area.setValue(cityName);
            this.clientsForm.controls.locations_address.setValue(address);



            // this.passPopup = true ;

            console.log(this.clientsForm);
          }, 2000);


          setTimeout(() => {

            this.passPopup = true;

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
      )



    this.endLoading();
  }


  addAdress() {

    this.clientsForm.patchValue({

      aboveUrl: '',
      locations_address: '',
      locations_notes: '',
      locations_area: '',
      lat: '',
      long: ''
    })

    this.showMapPopup = true;
    this.overLayShow = true;
    this.addNewAddressModeStatus = true;
    this.isUpdate = false;


  }

  copyURL(text) {
    console.log(text)
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.showSuccess('تم النسخ');

  };

  // clickedNewOrgins(e) {


  //   this.clientsForm.controls.lat.setValue(+e.lat);
  //   this.clientsForm.controls.long.setValue(+e.lng);

  //   var geocoder;
  //   geocoder = new google.maps.Geocoder();
  //   var latlng = new google.maps.LatLng(
  //     this.clientsForm.controls.lat.value,
  //     this.clientsForm.controls.long.value
  //   );
  //   let cityName: string = '';
  //   let address: string = '' ;
  //   geocoder.geocode({ latLng: latlng }, function(results, status) {
  //     if (status == google.maps.GeocoderStatus.OK) {
  //       if (results[0]) {
  //          address = results[0].formatted_address;
  //         var value = address.split(',');

  //         let count = value.length;

  //         let city = value[count - 3];

  //         cityName = city;
  //       }

  //     } else {
  //       alert('Geocoder failed due to: ' + status);
  //     }
  //   });
  //   setTimeout(() => {
  //     this.clientsForm.controls.locations_area.setValue(cityName);
  //     this.clientsForm.controls.locations_address.setValue(address);

  //     console.log(cityName);
  //   }, 1000);


  // }

  /* --------------------------------- clicked New Orgins ----------------------------- */

  clickedNewOrgins(e) {


    this.clientsForm.controls.lat.setValue(+e.lat);
    this.clientsForm.controls.long.setValue(+e.lng);

    this.passPopup = false;

    let newCity;
    this.coreService
      .postMethod(
        'clients/validate-map/' +
        this.cityId,
        {
          lat: this.clientsForm.controls.lat.value,
          long: this.clientsForm.controls.long.value
        }
      )
      .subscribe(
        responsee => {
          console.log(responsee);
          if (responsee['city']) {
            newCity = responsee['city'];
            this.newCityId = responsee['city'].id;
          }
            // let newCity = this.clientsForm.controls.city_id.setValue(responsee['city']);

                this.showSuccess(responsee['message']);

                var geocoder;
                geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(
                  this.clientsForm.controls.lat.value,
                  this.clientsForm.controls.long.value
                );
                let cityName: string = '';
                let address: string = '' ;
                geocoder.geocode({ latLng: latlng }, function(results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                       address = results[0].formatted_address;
                      var value = address.split(',');

                      console.log(value)

                      let count = value.length;
                      let city ;

                      if(count > 2)
                      {

                      city = value[count - 3];
                      }
                      else
                      {
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



                  this.passPopup = true ;


                  console.log(this.clientsForm)
                }, 2000);


          },
          error => {
            if (error.error.errors) {
              this.showErrors(error.error.errors);
            } else {
              alert('Geocoder failed due to: ' + status);
            }
          });
          setTimeout(() => {
            this.clientsForm.controls.locations_area.setValue(cityName);
            this.clientsForm.controls.locations_address.setValue(address);



            console.log(cityName);



            // this.passPopup = true ;


            console.log(this.clientsForm)
          }, 2000);


          setTimeout(() => {

            this.passPopup = true;

          }, 3000);




        },
        error => {
          if (error.error.errors) {
            this.showErrors(error.error.errors);
          } else {
            this.showErrors(error.error.message);
          }



          this.clientsForm.controls.lat.setValue(28.421864);
          this.clientsForm.controls.long.setValue(34.432869);
          this.clientsForm.controls.aboveUrl.setValue('');


          this.passPopup = false;

          this.showMapPopup = false;
        }
      )


  }


  /* ------------------------------- get  Location Data ------------------------- */

  getLocationDetails(location) {
    this.updatedLocationData = location;
    this.assignUpdatedLocationData();
  }

  /* ------------------------------- Assign Updated Location Data ------------------------- */

  assignUpdatedLocationData() {
    const data = this.updatedLocationData;
    this.clientsForm.patchValue({

      lat: data.lat,
      long: data.long,
      locations_address: data.address,
      locations_notes: data.notes,
      locations_area: data.area,

    });

    this.showMapPopup = true;
    this.overLayShow = true;
    this.addNewAddressModeStatus = true;
    this.isUpdate = true;

    console.log(this.clientsForm);

  }

  addNewLocation() {

    this.coreService
      .postMethod('clients/' + this.clientId + '/locations', {
        name: '',
        area: this.clientsForm.controls.locations_area.value,
        city_id: this.newCityId ? this.newCityId : this.cityId,
        special_sign: '',
        address: this.clientsForm.controls.locations_address.value,
        long: this.clientsForm.controls.long.value,
        lat: this.clientsForm.controls.lat.value,
        default: 1,
        notes: this.clientsForm.controls.locations_notes.value,
      })

      .subscribe(
        () => {
          this.showSuccess('تم إضافة الموقع بنجاح');
          this.getClientDetails(this.clientId);

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
      .updateMethod('clients/' + this.clientId + '/locations/' + this.updatedLocationData.id, {
        area: this.clientsForm.controls.locations_area.value,
        city_id: this.newCityId ? this.newCityId : this.cityId,
        special_sign: '',
        address: this.clientsForm.controls.locations_address.value,
        notes: this.clientsForm.controls.locations_notes.value,
        long: this.clientsForm.controls.long.value,
        lat: this.clientsForm.controls.lat.value,
        default: 1

      })
      .subscribe(
        () => {
          this.showSuccess('تم تعديل الموقع بنجاح');
          this.getClientDetails(this.clientId);
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


  deleteLocation(locationId) {
    this.coreService
      .deleteMethod('clients/' + this.clientId + '/locations/' + locationId)
      .subscribe(
        () => {
          this.showSuccess('تم إلغاء الموقع بنجاح');
          this.showDeletePopup = false;
          this.getClientDetails(this.clientId);

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

  closePopup() {
    this.showDeletePopup = false;
  }



  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
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
