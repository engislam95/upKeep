import { Component, OnInit } from '@angular/core';

import { CoreService } from './../../../tools/shared-services/core.service';
import { LoaderService } from '../../../tools/shared-services/loader.service';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';
import { popup } from '../../../tools/shared_animations/popup';
import { PaginationService } from './../../../tools/shared-services/pagination.service';
import { fromEvent, Observable } from 'rxjs';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  startWith
} from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-all-technicians',
  templateUrl: './all-technicians.component.html',
  styleUrls: ['./all-technicians.component.scss'],
  animations: [popup]
})
export class AllTechniciansComponent implements OnInit {
  //  Start Fillter Variable Data
  filteredTechniciansData = '';
  //  End Fillter Variable Data
  //  ######################### Start General Data #########################
  pageLoaded = false;
  responseState;
  responseData;
  //
  current_page;
  totalPage;

  deletedTechnicalName: string;
  deletedTechnicalId: number;
  showDeletePopup = false;
  //
  updatedTechnicalName: string;
  updatedTechnicalId: number;
  showUpdatePopup = false;
  //  ######################### End General Data #########################
  // ############################ Table Data ############################
  showOrdercontrolst = false;
  hideme = [];
  displayedColumns = [
    'ID',
    'technical_name',
    'phone',
    'main_service',
    'city_service',
    'email',
    'national',
    'status',
    'technicians_details'
    // 'edit_technical',
    // 'delete_technical'
  ];
  dataSource = [];
  pagesNumbers = [];
  pageId = 1; // number
  firstPage; // any
  lastPage;
  // ############################ Table Data ############################
  //  ###################### Start Select Status ######################
  filterForm = new FormGroup({
    techniciansStatusObj: new FormControl(),
    filterName: new FormControl(),
    service: new FormControl(),
    serviceCity: new FormControl()
  });

  statusArray = [{ name: 'مفعل', id: 1 }, { name: 'غير مفعل', id: 0 }];
  statusFilteredOptions: Observable<any>;
  filteredStatusId = '';

  ServiceArray = [];
  filteredServiceArray = [];

  CityArray = [];
  filteredCityArray = [];
  mainContractTpe = [] ;
  mainServicesLoaded ;
  technician_add: boolean = false;
  technician_all: boolean = false;
  technician_update: boolean = false;
  technician_delete: boolean = false;
  user: any = '';
  technicians: any = [];

  //  ###################### End Select Status ######################
  constructor(
    //
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private paginationService: PaginationService
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
          case 'show':
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
    // if (this.technician_all || this.user.privilege == 'super-admin') {
    //   this.displayedColumns.push('technicians_details');
    // }
    // if (this.technician_update || this.user.privilege == 'super-admin') {
    //   this.displayedColumns.push('edit_technical');
    // }
    // if (this.technician_delete || this.user.privilege == 'super-admin') {
    //   this.displayedColumns.push('delete_technical');
    // }
  }
  //  ############################### Start OnInit ###############################
  ngOnInit() {
    // Start START Loading
    this.startLoading();
    // End START Loading
    // Start Get All Technicians
    this.getAllTechnicians(this.pageId);
    this.getAllServices();
    this.getAllServicesCities();

    this.coreService
      .getMethod('lookup/contract-types', {})
      .subscribe((contracts: any) => {
        
        console.log(contracts);
        this.mainContractTpe = contracts.data;
        this.mainServicesLoaded = true;
        // Start End Loading
        this.endLoading();
      });

    // End Get All Technicians

    //  ############################ Start Filters ############################
    // Filter Name
    const filterName = document.getElementById('filterName');
    const filterNameListner = fromEvent(filterName, 'keyup');
    filterNameListner
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        this.pageId = 1;
        this.filteredTechniciansData = value;
        this.getAllTechnicians(this.pageId);
      });
    // End Filter Name
    //  ############################ End Filters ############################

    // Start Select Search For Status Types
    this.statusFilteredOptions = this.filterForm
      .get('techniciansStatusObj')
      .valueChanges.pipe(
        startWith(''),
        map(value => this.filterTechniciansStatus(value))
      );
    // End Select Search For Status Types

    // End Select Search For Status Types

    // Filter services Cities
    // const filterServiceCity = document.getElementById('filterCityService');
    // const filterServiceCityListner = fromEvent(filterServiceCity, 'keyup');
    // filterServiceCityListner
    //   .pipe(
    //     map((event: any) => event.target.value),
    //     debounceTime(200),
    //     distinctUntilChanged()
    //   )
    //   .subscribe((value: any) => {
    //     this.pageId = 1;
    //     this.filteredTechniciansData = value;
    //     this.getAllTechnicians(this.pageId);
    //   });
    // // End Select Search For Status Types
  }

  //  ############################### End OnInit ###############################
  //  ######################### Start Filter Order Status  #########################
  filterTechniciansStatus(value: any) {
    if (typeof value === 'object') {
      this.filteredStatusId = value.id;
      this.pageId = 1;
      this.getAllTechnicians(this.pageId);
    }
    if (value === '') {
      this.filteredStatusId = '';
      this.pageId = 1;
      this.getAllTechnicians(this.pageId);
    }
    return this.statusArray.filter(option => option.name.includes(value));
  }

  filterTechniciansService(value) {
    console.log(value);
    if (value.length > 0) {
      this.filteredServiceArray = value;
      console.log(this.filteredServiceArray);
      this.pageId = 1;
      this.getAllTechnicians(this.pageId);
    }
    if (value.length < 1) {
      this.filteredServiceArray = [];
      console.log(this.filteredCityArray);

      this.pageId = 1;
      this.getAllTechnicians(this.pageId);
    }

    return this.filteredServiceArray;
  }

  filterTechniciansCity(value) {
    if (value.length > 0) {
      this.filteredCityArray = value;
      console.log(this.filteredCityArray);

      this.pageId = 1;
      this.getAllTechnicians(this.pageId);
    }
    if (value.length < 1) {
      this.filteredCityArray = [];
      console.log(this.filteredCityArray);

      this.pageId = 1;
      this.getAllTechnicians(this.pageId);
    }

    return this.filteredCityArray;
  }

  //  get technical service

  getAllServices() {
    this.coreService
      .getMethod('services/active', {})
      .subscribe((getServices: any) => {
        console.log(getServices);
        this.ServiceArray = getServices.data;
      });
  }

  //  get technical service cities

  getAllServicesCities() {
    this.coreService.getMethod('cities').subscribe((getCities: any) => {
      console.log(getCities);
      this.CityArray = getCities.data;
    });
  }

  //  ######################### End Filter Order Status  #########################
  //  ######################### start display Options For Select #########################
  displayOptionsFunction(state) {
    if (state !== null) {
      return state.name;
    }
  }
  //  ######################### End display Options For Select #########################
  //  ############################# Start X Reset Inputs #############################
  xResetInputs(key) {
    if (key === 'filterName') {
      this.filterForm.patchValue({
        filteredTechniciansData: '',
        filterName: ''
      });
      this.filteredTechniciansData = '';
    } else if (key === 'techniciansStatusObj') {
      this.filterForm.patchValue({
        filteredStatusId: '',
        techniciansStatusObj: ''
      });
    }
    this.pageId = 1;
    this.getAllTechnicians(this.pageId);
  }
  //  ############################# End X Reset Inputs #############################
  //  ######################### Start Get All Technicians #########################
  getAllTechnicians(pageId) {
    this.loaderService.startLoading();
    console.log(this.filteredServiceArray);
    console.log(this.filteredCityArray);

    this.coreService
      .getMethod('technicians?page=' + pageId, {
        name: this.filteredTechniciansData,
        active: this.filteredStatusId,
        'service[]': this.filteredServiceArray,
        'city[]': this.filteredCityArray
      })
      .subscribe((getTechniciansResponse: any) => {
        // Start Assign Data
        this.dataSource = getTechniciansResponse.data.data;
        this.current_page = getTechniciansResponse.data.current_page;
        this.totalPage = getTechniciansResponse.data.last_page;
        console.log(this.dataSource);
        if (this.dataSource.length === 0 && this.pageId === 1) {
          // empty data array
        }
        if (this.dataSource.length === 0 && this.pageId > 1) {
          // last page
          this.pageId -= 1;
          this.pagesNumbers.splice(-1);
          this.goPage(this.pageId);
        }
        // Start Assign Data
        // Start END Loading
        this.endLoading();
        // End END Loading
        //  Start Pagination Count
        this.pagination(
          getTechniciansResponse.data.total,
          getTechniciansResponse.data.per_page
        );
        //  End Pagination Count
      });
  }
  //  ######################### End Get All Technicians #########################
  //  ######################### Start Pagination #########################
  pagination(totalTechniciansNumber, techniciansPerPAge) {
    this.pagesNumbers = [];
    const totalPages = Math.ceil(totalTechniciansNumber / techniciansPerPAge);
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      this.pagesNumbers.push(pageNumber);
    }
    this.checkPagination(this.pageId);
  }
  changePagination(event) {
    this.getAllTechnicians(event.value);
  }
  //  ######################### End Pagination #########################
  //  ################################### Start Go Page ###################################
  goPage(i) {
    if (i >= 1 && i <= this.pagesNumbers.length) {
      this.pageId = i;
      this.checkPagination(i);
      // Start START Loading
      this.startLoading();
      // End START Loading
      this.getAllTechnicians(this.pageId);
    }
  }
  //  ################################### End Go Page ###################################
  //  ####################### Start Check For Pagination Buttons #######################
  checkPagination(pageId) {
    const [firstPage, lastPage] = this.paginationService.checkPaginationButtons(
      pageId,
      this.pagesNumbers.length
    );
    this.firstPage = firstPage;
    this.lastPage = lastPage;
  }
  //  ####################### Start Check For Pagination Buttons #######################

  //  ######################### Start Delete Technical #########################
  openDeletePopup(id, name) {
    this.deletedTechnicalName = name;
    this.deletedTechnicalId = id;
    this.showDeletePopup = true;
  }
  deleteTechnical() {
    this.closePopup();
    this.startLoading();
    this.coreService
      .deleteMethod('technicians/' + this.deletedTechnicalId)
      .subscribe(
        () => {
          this.showSuccess();
          this.getAllTechnicians(this.pageId);
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
  //  ######################### End Delete Technical #########################
  //  ######################### Start Update Technical #########################
  openUpdatePopup(id, name) {
    this.deletedTechnicalName = name;
    this.deletedTechnicalId = id;
    this.showDeletePopup = true;
  }
  //  ######################### End Update Technical #########################
  //  ######################### Start Check For Data Existance #########################
  dataExistance() {}
  //  ######################### End Check For Data Existance #########################
  //  ######################### Start Loading Functions #########################
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
  }
  //  ######################### End Loading Functions #########################
  //  ######################### Start Response Messeges #########################
  showErrors(errors) {
    this.endLoading();
    this.responseState = 'error';
    this.responseData = errors;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  showSuccess() {
    this.endLoading();
    this.responseState = 'success';
    this.responseData = 'تم حذف الفني بنجاح';
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }

  nextPage(pageNum) {
    this.getAllTechnicians(+pageNum + 1);
  }
  prevPage(pageNum) {
    this.getAllTechnicians(+pageNum - 1);
  }
  //  ######################### End Response Messeges #########################
}
