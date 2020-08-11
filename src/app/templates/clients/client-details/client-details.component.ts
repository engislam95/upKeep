import { Router, ActivatedRoute } from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { CoreService } from './../../../tools/shared-services/core.service';
import { LoaderService } from './../../../tools/shared-services/loader.service';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';
import { FormGroup, FormControl , Validators } from '@angular/forms';
import { fade } from './../../../tools/shared_animations/fade';
import { element } from '@angular/core/src/render3';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
// NOTE
// import { MatGridListModule } from '@angular/material/grid-list';
// NOTE
export interface PeriodicElement {

  mobile: string;
  id: number;
  name: string;
  number_details:string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, mobile: ' +966562636435 ', name: 'خالو', number_details:''},
  { id: 2, mobile: ' +966562636435 ', name: 'Ramy Zoheir', number_details:''}


];
@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss'],
  animations: [fade]
})
export class ClientDetailsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'number', 'number_private_name','number_details'];
  dataSource = ELEMENT_DATA;
  //
  // ─── START UPDATED MAP ──────────────────────────────────────────────────────────
  //

  updatedMapForm = new FormGroup({
    formAddress: new FormControl(''),
    formArea: new FormControl(''),
    formSpecialSign: new FormControl(''),
    mapFormOrgins: new FormControl([])
  });

  phonesForm = new FormGroup({
    mobile: new FormControl('',[
      Validators.required,
      Validators.pattern('[0-9]* || [٠-٩]*'),
      Validators.minLength(9),
      Validators.maxLength(9)
    ]),
    name : new FormControl(''),
  })


  deleteClicked = false;

  //
  // ────────────────────────────────────────────────────────── END UPDATED MAP ─────
  //
  addNewAddressModeStatus = false;
  errorMessage  : string = 'هذا الرقم غير صحيح او موجود بالفعل ' ; 
  setError  = false ;
  //
  // ─── START GENERAL DATA ──────────────────────────────────────────
  //
  showAddNumberPopup = false;
  pageLoaded = false;
  clientDetails;
  clientId;
  overLayShow = false;
  // Start Client location
  clientLong;
  clientLat;

  // End Client Location
  showMapPopup = false;
  showStopPopup = false ;

  currentUserId = JSON.parse(sessionStorage.getItem('currentUser')).id 

  phoneNumbers:[] = []
  mobileReserved: boolean = false;

  // locations = [
  //   {
  //     lat: 31.245332,
  //     lng: 29.966024,
  //     address: 'test Address',
  //     area: 'test Area 1',
  //     mainLocation: true
  //   },
  //   {
  //     lat: 31.207952,
  //     lng: 29.908296,
  //     address: 'test 2 Address',
  //     area: 'test Area 2',
  //     mainLocation: false
  //   },
  //   {
  //     lat: 31.133735,
  //     lng: 29.814031,
  //     address: 'test 3 Address',
  //     area: 'test Area 3',
  //     mainLocation: false
  //   }
  // ];

  newOrginsArray;
  locationIndex = 0;  
  updatedLocationData;

  updatePhone = false ;

  //  TODO
  clientName;
  status ;
  active ;
  reports ;

  orders_count ;
  total_payments ;
  total_services ;
  total_spare ;
  order_date ; 
  not_completed ;

  clientType ;
  created_at ;
  created_by ;
  cityName ; 
  updated_at ;
  showDeletePopup = false;
  deletedClientName: string;


  lat ; 
  long ;
  deletedClientId: number;

  clientAddress; 
  clientNotes  ;
  clientMobileNumber;
  clientCityId;
  locations = [];
  updateAdressMode = false;
  latX;
  locations_count ;
  longX;
  editedAdress;
  clientStatusActivation = 0;
  fetchedPhone ;
  defaultPhones ;
  // NOTE
  submitted;
  responseState;
  responseStateMessage;
  responseData;
  clientAddAdressLong;
  clientAddAdressLat;
  defaultAddress;
  mainAddressSelect = 0;
  showMainAddressToggle = false;
  locationsArrayClientPosted = [];
  // NOTE
  //  TODO
  clientMainAddressStatus = 0;
  // NOTE Test map marker idea
  // testLat;
  // testLong;

  vidCoordinates = {
    long: 39.2107495,
    lat: 21.6145938
  };

  updateModeLocationLong;
  updateModeLocationLat;
  changeByCopePast;

  toggle = true;
  above_url ;
  updateedLocationsId;
  // NOTE
  //
  // ────────────────────────────────────────── END GENERAL DATA ─────
  //

  submitEnable = true;
  constructor(
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private router: Router,

    private coreService: CoreService
    
  ) {

    
  }

  //
  // ─── START ONINIT ────────────────────────────────────────────────
  //



  ngOnInit() {
    // Get Client Id
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.clientId = queryParams.clientId;
      this.getClientDetails(this.clientId);
      console.log(this.phoneNumbers)
    });

    // Get Client Id
  }

  //
  // ──────────────────────────────────────────────── END ONINIT ─────
  //

  changeVidOrgins() {
    this.vidCoordinates = {
      long: 39.2107495,
      lat: 21.6145938
    };
  }

  //
  // ─── START GET CLIENT DETAILS ────────────────────────────────────
  //

  getClientDetails(clientId) {
    this.coreService
      .getMethod('clients/' + clientId, {})
      .subscribe((clientDetails: any) => {


        console.log(clientDetails )
        // Start LOADING Loading
        this.endLoading();
        // End LOADING Loading
        this.clientDetails = clientDetails.data;
        this.clientLong = this.clientDetails.long;
        this.clientLat = this.clientDetails.lat;

        this.active = this.clientDetails.active ;

        this.orders_count = this.clientDetails.reports.orders_count ;

        this.total_payments = this.clientDetails.reports.total_payments ;
        
        this.total_services = this.clientDetails.reports.total_services ;
        this.locations_count = this.clientDetails.reports.locations_count ;
        this.total_spare = this.clientDetails.reports.total_spare ;

        this.order_date = this.clientDetails.orders.order_date ;

        this.not_completed = this.clientDetails.reports.not_completed ;

        this.phoneNumbers = this.clientDetails.mobiles

        this.status = this.clientDetails.status ; 
        this.clientType = this.clientDetails.client_type
        this.created_at = this.clientDetails.created_at
        this.created_by = this.clientDetails.created_by 
        this.cityName = this.clientDetails.city.name ;
        this.clientNotes = this.clientDetails.notes ;
        // this.lat = clientDetails.lat  ;
        // this.long = clientDetails.long ;

        this.updated_at = this.clientDetails.locations[0].updated_at

        if(this.clientDetails.locations[0].address != null )
        {

          this.clientAddress = this.clientDetails.locations[0].address.slice(0,20) ; 
        }
        // TODO
        this.clientName = this.clientDetails.name;


        console.log(this.clientDetails.name)
        console.log(this.clientName)


        this.lat = this.clientDetails.locations[0].lat  ;
        this.long = this.clientDetails.locations[0].long  ;

        console.log(this.lat)
        console.log(this.long)


        this.above_url = this.clientDetails.locations[0].aboveUrl ; 



        // console.log(this.clientName);
        this.clientMobileNumber = this.clientDetails.mobile;
        // console.log(this.clientMobileNumber);
        this.clientCityId = this.clientDetails.city.id;
        // console.log(this.clientCityId);
        this.clientStatusActivation = this.clientDetails.active;
        // console.log(this.clientStatusActivation);
        this.locations = this.clientDetails.locations;

        this.clientDetails.locations.forEach(element => {
          this.defaultAddress = element.default;
        });
        // console.log('locations', this.locations);
        // TODO
      });
  }
  // ff
  //
  // ──────────────────────────────────── END GET CLIENT DETAILS ─────
  //

  

  updateLocation(location, index) {
    this.updatedLocationData = this.clientDetails;
    this.locationIndex = index;
    // TODO
    this.updateAdressMode = true;
    // TODO

    if (this.updateAdressMode) {
      //   this.updateModeLocationLong = this.locations[index].long;
      //   this.updateModeLocationLat = this.locations[index].lat;

      this.vidCoordinates = {
        long: location.long,
        lat: location.lat
      };
    }
    this.showMapPopup = true;
    this.overLayShow = true;
    this.updateedLocationsId = location.id;

    // ////

    this.updatedMapForm.patchValue({
      formAddress: location.address,
      formArea: location.area,
      formSpecialSign: location.special_sign,
      mapFormOrgins: location.lat + ', ' + location.long
    });
    // this.updatedMapForm.patchValue({
    //   formAddress: location.address,
    //   formArea: location.area,
    //   mapFormOrgins: location.lat + ', ' + location.lng
    // });
    // console.log('test long in edit patch value');
  }

  addAdress() {
    this.updatedMapForm.patchValue({
      formAddress: '',
      formArea: '',
      formSpecialSign: '',
      mapFormOrgins: ''
    });

    if (this.locations.length == 0) {
      this.clientMainAddressStatus = 1;
      this.toggle = false;
    }
    this.showMapPopup = true;
    this.overLayShow = true;
    this.addNewAddressModeStatus = true;
    // console.log('showMainAddressToggle >>', this.showMainAddressToggle);
    // this.showMainAddressToggle = true;
    // console.log('showMainAddressToggle >>', this.showMainAddressToggle);
    if (this.locations.length >= 1) {
      this.toggle = true;
      this.clientMainAddressStatus = 0;

      // console.log('hrrrrrrrrrrrr');
    }
  }
  // NOTE

  onChangeMapOrgin(e) {
    this.changeByCopePast = true;

    // console.log('kkkk >>>', e.target.value);
    this.newOrginsArray = e.target.value.split(', ');
    // console.log(this.newOrginsArray);
    // this.locations[this.locationIndex].lat = +this.newOrginsArray[0];
    this.clientAddAdressLat = +this.newOrginsArray[0];
    // this.locations[this.locationIndex].long = +this.newOrginsArray[1];
    this.clientAddAdressLong = +this.newOrginsArray[1];
    this.vidCoordinates.lat = +this.newOrginsArray[0];
    this.vidCoordinates.long = +this.newOrginsArray[1];
  }

  // NOTE

  // TODO
  // TODO

  clickedNewOrgins(e) {
    // this.locations[this.locationIndex].lat =this.testLat  ;
    // this.testLat = +e.lat;
    //  this.locations[this.locationIndex].lng = this.testLong ;
    // this.testLong = +e.lng;

    this.vidCoordinates.lat = +e.lat;
    this.vidCoordinates.long = +e.lng;
    this.clientAddAdressLong = +e.lng;
    this.clientAddAdressLat = +e.lat;
    this.updatedMapForm.patchValue({
      mapFormOrgins: e.lat + ', ' + e.lng
    });
  }

// add phone number 
  addPhoneNumber()
  {
    if(this.updatePhone)
    {

       console.log(this.fetchedPhone)
       this.coreService
      .updateMethod('clients/mobile/' + this.fetchedPhone.id, {
        name : this.phonesForm.controls.name.value ,
        mobile :  +(966 + this.phonesForm.controls.mobile.value)
      })
      .subscribe((clientDetails: any) => {
        console.log(clientDetails )
        this.setError = false ;      


        this.phonesForm.controls.name.setValue('')
        this.phonesForm.controls.mobile.setValue('')

        this.updatePhone = false  ;


        this.endLoading();

        this.getClientDetails(this.clientId);

        this.showSuccess('تم تعديل  رقم التليفون بنجاح');





      }, error => {
        if (error.error.errors) {
          this.showErrors(error.error.errors);
          this.setError = true ; 
        } else {
          this.showErrors(error.error.message);
        }
      }
      )
      
    }
    else
    {
      // this.phonesForm.patchValue({
      //   mobile: +(966 + this.phonesForm.controls.mobile.value)
      // });
      this.coreService
      .postMethod('clients/mobile/' + this.clientId, {
        name : this.phonesForm.controls.name.value ,
        mobile :  +(966 + this.phonesForm.controls.mobile.value)
      })
      .subscribe((clientDetails: any) => {
        console.log(clientDetails )

        this.setError = false ; 


        this.phonesForm.controls.name.setValue('')
        this.phonesForm.controls.mobile.setValue('')

        this.updatePhone = false  ;
        this.endLoading();
        this.getClientDetails(this.clientId);

        this.showSuccess('تم إضافة  رقم التليفون بنجاح');

      }, error => {
        if (error.error.errors) {
          this.showErrors(error.error.errors);
          this.setError = true ; 
        } else {
          this.showErrors(error.error.message);
        }
      })

    }
   
  }




  // edit phone number 
  editPhoneNumber(element)
  {
    console.log(element)

    this.phonesForm.controls.name.setValue(element.name);
    this.phonesForm.controls.mobile.setValue(element.mobile.split('').slice(3).join(''));
    console.log( this.phonesForm.controls.mobile.value)

    this.updatePhone = true  ;
    this.fetchedPhone = element ;
   
      

  }



  // delte phone number 
  deletePhoneNumber(phoneId)
  {
    this.coreService
      .deleteMethod('clients/mobile/' + phoneId )
      .subscribe((clientDetails: any) => {
        console.log(clientDetails )

        

        this.endLoading();
        this.getClientDetails(this.clientId);
        this.showSuccess('تم إزالة  رقم التليفون بنجاح');



      },
      error => {
        if (error.error.errors) {
          this.showErrors(error.error.errors);
        } else {
          this.showErrors(error.error.message);
        }
      }
      )
  }

  //
  // ─── START  MAIN ADDRESS SELECT ────────────────────────────────────────────────────────
  //

  mainAdderssSelectToggle(e) {
    this.mainAddressSelect = e.checked === true ? 1 : 0;
    console.log(this.mainAddressSelect);
    if (this.mainAddressSelect === 1) {
      this.clientStatusActivation = 1;
      this.clientMainAddressStatus = 1;
    } else {
      this.clientStatusActivation = 0;
      this.clientMainAddressStatus = 0;
    }
  }

  //
  // ──────────────────────────────────────────────── END MAIN ADDRESS SELECT ─────
  //


   // ─── START DELETE CLIENT ─────────────────────────────────────────
  //

  openDeletePopup() {
 

    this.deletedClientId = this.clientId;
    this.showDeletePopup = true;
  }
  deleteClient() {
    this.closePopup();
    this.startLoading();
    this.coreService.deleteMethod('clients/' + this.deletedClientId).subscribe(
      () => {
        this.showSuccess('تم إلغاء بنجاح');
        this.getClientDetails(this.clientId);

          setTimeout(() => {
            this.router.navigate(['/clients/all-clients']);
          }, 1000);
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

  //
  // ────────────────────────────────────── END DELETE TECHNICAL ─────


     // ─── START stop CLIENT ─────────────────────────────────────────
  //

  openStopPopup() {
 

    this.deletedClientId = this.clientId;
    this.showStopPopup = true;
  }

  stopClient() {
    this.closePopup();
    this.startLoading();
    if(this.active)
    {
      this.coreService.postMethod('clients/stop/' + this.deletedClientId , {}).subscribe(
        () => {
          this.showSuccess('تم إيقاف بنجاح');
          setTimeout(() => {
          this.getClientDetails(this.clientId);
      this.showStopPopup = false;
  
  
            // this.router.navigate(['/clients/client-details']);
          }, 1000);
          // this.getClientDetails(this.clientId);
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
    else
    {

      this.coreService.postMethod('clients/active/' + this.deletedClientId , {}).subscribe(
        () => {
          this.showSuccess('تم تفعيل بنجاح');
          setTimeout(() => {
          this.getClientDetails(this.clientId);
      this.showStopPopup = false;
  
  
            // this.router.navigate(['/clients/client-details']);
          }, 1000);
          // this.getClientDetails(this.clientId);
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
  
    
  }
  stopClosePopup() {
    this.showStopPopup = false;
  }

  //
  // ────────────────────────────────────── END stop TECHNICAL ─────

  onSubmitUpdateData() {
    // NOTE

    //
    const onSubmitOrgins = this.updatedMapForm.value.mapFormOrgins.split(',');
    if (this.updateAdressMode) {
      // **************************************************************

      //  TODO
      if (this.clientMainAddressStatus === 1) {
        this.locationsArrayClientPosted.forEach(element => {
          element.default = 0;
        });
        this.locations[
          this.locationIndex
        ].default = this.clientMainAddressStatus;
      } else {
        this.locations[this.locationIndex].default = 0;
      }
      //  TODO
      this.locations[this.locationIndex].lat = onSubmitOrgins[0];
      this.locations[this.locationIndex].long = onSubmitOrgins[1];
      this.locations[
        this.locationIndex
      ].area = this.updatedMapForm.value.formArea;
      this.locations[
        this.locationIndex
      ].address = this.updatedMapForm.value.formAddress;
      this.locations[
        this.locationIndex
      ].special_sign = this.updatedMapForm.value.formSpecialSign;

      this.coreService
        .updateMethod(
          'clients/' +
            this.clientId +
            '/' +
            'locations' +
            '/' +
            this.locations[this.locationIndex].id,

          this.locations[this.locationIndex]
          // {
          // name: this.clientName,
          // mobile: this.clientMobileNumber,
          // active: this.clientStatusActivation,
          // // area: this.updatedMapForm.value.formArea,
          // city_id: this.clientCityId,
          // locations: this.locations
          // }
        )
        .subscribe(
          () => {
            this.showSuccess('تم تعديل العميل بنجاح');

            this.showMapPopup = false;
            this.updateAdressMode = false;
            this.changeVidOrgins();
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

      // **************************************************************
      // TODO
    }
    // NOTE start  Creat Done
    if (this.addNewAddressModeStatus) {
      this.locationsArrayClientPosted = this.locations;

      if (this.clientMainAddressStatus === 1) {
        this.locationsArrayClientPosted.forEach(element => {
          element.default = 0;
        });

        this.locationsArrayClientPosted.push({
          lat: this.clientAddAdressLat,
          long: this.clientAddAdressLong,
          address: this.updatedMapForm.value.formAddress,
          area: this.updatedMapForm.value.formArea,
          client_id: this.clientCityId,
          city_id: this.clientCityId,
          name: this.updatedMapForm.value.formAddress,
          default: this.clientMainAddressStatus,
          special_sign: this.updatedMapForm.value.formSpecialSign
        });
      } else {
        this.locationsArrayClientPosted.push({
          lat: this.clientAddAdressLat,
          long: this.clientAddAdressLong,
          address: this.updatedMapForm.value.formAddress,
          client_id: this.clientCityId,
          city_id: this.clientCityId,
          name: this.updatedMapForm.value.formAddress,
          default: this.clientMainAddressStatus,
          special_sign: this.updatedMapForm.value.formSpecialSign,
          area: this.updatedMapForm.value.formArea
        });
      }

      this.startLoading();
      this.coreService
        .updateMethod('clients/' + this.clientId, {
          locations: this.locationsArrayClientPosted,
          name: this.clientName,
          mobile: this.clientMobileNumber,
          active: this.clientStatusActivation,
          city_id: this.clientCityId
        })
        .subscribe(
          () => {
            this.showMapPopup = false;
            this.showSuccess('تم تعديل العميل بنجاح');
            this.locations = this.locationsArrayClientPosted;

            this.addNewAddressModeStatus = false;
            this.changeVidOrgins();
            this.getClientDetails(this.clientId);
          },
          error => {
            this.showErrors(error.message);
            if (error) {
              this.showErrors(error.message);
            } else {
              this.showErrors(error.error.message);
            }
          }
        );
    }
    // NOTE  end  creat done
  }

  //  NOTE  >>>>>>>>>>>>>>>>>> Start Done Functions

  onDelete(i) {
    this.deleteClicked = true;
    // if (this.locations.length > 1) {
    // console.log('this.locations[i].id >>> ', this.locations[i].id);
    this.startLoading();
    this.coreService
      .deleteMethod(
        'clients/' +
          this.clientId +
          '/' +
          'locations' +
          '/' +
          this.locations[i].id
      )
      .subscribe(
        () => {
          this.showSuccess('تم مسح العنوان بنجاح');
          this.getClientDetails(this.clientId);
          this.locations.splice(i, 1);
          this.deleteClicked = false;
          // if (this.locations.length == 1) {
          //   console.log('test');
          //   this.locations.forEach(element => {
          //     element.default = 1;
          //   });
          // }
        },
        error => {
          // if (error.error.errors) {
          //   // this.showErrors(error.error.errors);
          //   this.showErrors(error.error.message);
          // } else {
          //   this.showErrors(error.error.message);
          // }
          this.showErrors(error.error.message);
        }
      );
    // }
    // else{

    // }
  }

  //  NOTE  >>>>>>>>>>>>>>>>>>  End Done Functions
  //
  // ─── START LOADING FUNCTIONS ─────────────────────────────────────
  //

  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
  }
  //
  // ─── END LOADING FUNCTIONS ───────────────────────────────────────
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
