import { Component, OnInit } from '@angular/core';
import { CoreService } from './../../../tools/shared-services/core.service';
import { ResponseStateService } from './../../../tools/shared-services/response-state.service';
import { LoaderService } from './../../../tools/shared-services/loader.service';
import { popup } from '../../../tools/shared_animations/popup';
import { fromEvent, Observable } from 'rxjs';
import {
  map,
  debounceTime,
  distinctUntilChanged,
  startWith
} from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-all-resources',
  templateUrl: './all-resources.component.html',
  styleUrls: ['./all-resources.component.scss'],
  animations: [popup]
})
export class AllResourcesComponent implements OnInit {
  //  ######################### Start General Data #########################
  pageLoaded = false;
  responseState;
  responseData;
  //
  deletedResourcesName: string;
  deletedResourcesId: number;
  showDeletePopup = false;
  //
  updatedResourcesName: string;
  updatedResourcesId: number;
  showUpdatePopup = false;
  //  Filter Data
  filteredResoursesData = '';
  filteredStatusId = '';

  //  Filter Data
  //  ######################### End General Data #########################
  // ############################ Table Data ############################
  displayedColumns = [
    //
    'ID',
    'name',
    'phone',
    'status',
    // 'resources_details',
    // 'edit_order',
    // 'add_responsible',
    // 'delete_order'
  ];
  dataSource = [];

  //  ###################### Start Select Status ######################
  filterForm = new FormGroup({
    ResourcesStatusObj: new FormControl(),
    filterName: new FormControl()
  });
  statusArray = [{ name: 'مفعل', id: 1 }, { name: 'غير مفعل', id: 0 }];
  statusFilteredOptions: Observable<any>;

  //  ###################### End Select Status ######################
  user: any = '';
  resource_add: boolean = false;
  resources_all: boolean = false;
  resources_update: boolean = false;
  resources_delete: boolean = false;
  resoureces: any = [];

  // ############################ Table Data ############################
  constructor(
    //
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService
  ) {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    this.resoureces = this.user.modules.resources;
    if (this.resoureces) {
      this.resoureces.map(ele => {
        switch (ele) {
          case 'create': this.resource_add = true;
            break;
          case 'show': this.resources_all = true;
            break;
          case 'delete': this.resources_delete = true;
            break;
          case 'update': this.resources_update = true;
            break;
        }
      });
    }
    if (this.resources_all || this.user.privilege == 'super-admin') {
      this.displayedColumns[4] = 'resources_details';
    }
    if (this.resources_update || this.user.privilege == 'super-admin') {
      this.displayedColumns[5] = 'edit_order';
    }
    if (this.resources_delete || this.user.privilege == 'super-admin') {
      this.displayedColumns[6] = 'delete_order';
    }
  }
  //  ############################### Start OnInit ###############################

  ngOnInit() {
    // Start START Loading
    this.startLoading();
    // End START Loading
    // Start Get All Resources
    this.getAllResources();
    // End Get All Resources
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
        this.filteredResoursesData = value;
        this.getAllResources();
      });
    // Filter Name

    // Start Select Search For Status Types
    this.statusFilteredOptions = this.filterForm
      .get('ResourcesStatusObj')
      .valueChanges.pipe(
        startWith(''),
        map(value => this.filterResourcesStatus(value))
      );
    // End Select Search For Status Types

    //  ############################ End Filters ############################
  }
  // End OnInit

  //  ######################### Start Filter Order Status  #########################
  filterResourcesStatus(value: any) {
    if (typeof value === 'object') {
      this.filteredStatusId = value.id;
      this.getAllResources();
    }
    if (value === '') {
      this.filteredStatusId = '';
      this.getAllResources();
    }
    return this.statusArray.filter(option => option.name.includes(value));
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
        filteredResoursesData: '',
        filterName: ''
      });
      this.filteredResoursesData = '';
    } else if (key === 'ResourcesStatusObj') {
      this.filterForm.patchValue({
        filteredStatusId: '',
        ResourcesStatusObj: ''
      });
    }

    this.getAllResources();
  }
  //  ############################# End X Reset Inputs #############################
  //  ######################### Start Get All Resources #########################
  getAllResources() {
    // Start  Loading
    this.loaderService.startLoading();
    // Start  Loading
    this.coreService
      .getMethod('resources', {
        name: this.filteredResoursesData,
        active: this.filteredStatusId
      })
      .subscribe((getResourcesResponse: any) => {
        // Start Assign Data
        this.dataSource = getResourcesResponse.data;
        // Start Assign Data
        // Start END Loading
        this.endLoading();
        // End END Loading
      });
  }
  //  ######################### End Get All Resources #########################
  //  ######################### Start Delete Resource #########################
  openDeletePopup(id, name) {
    this.deletedResourcesName = name;
    this.deletedResourcesId = id;
    this.showDeletePopup = true;
  }
  deleteResource() {
    this.closePopup();
    this.startLoading();
    this.coreService
      .deleteMethod('resources/' + this.deletedResourcesId)
      .subscribe(
        () => {
          this.showSuccess();
          this.getAllResources();
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
  //  ######################### End Delete Resource #########################
  //  ######################### Start Check For Data Existance #########################
  dataExistance() { }
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
    this.responseData = 'تم حذف المصدر بنجاح';
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  //  ######################### End Response Messeges #########################
}
