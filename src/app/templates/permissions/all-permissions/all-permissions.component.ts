import { MatTableModule, MatTableDataSource } from '@angular/material';
import { MessagingService } from './../../../tools/shared-services/messaging.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreService } from './../../../tools/shared-services/core.service';
import { LoaderService } from '../../../tools/shared-services/loader.service';
import { PaginationService } from './../../../tools/shared-services/pagination.service';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';
import { popup } from '../../../tools/shared_animations/popup';
import { fromEvent, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-all-users',
  templateUrl: './all-permissions.component.html',
  styleUrls: ['./all-permissions.component.scss'],
  animations: [popup]
})
export class AllPermissionsComponent implements OnInit {
  /* ----------------------------- Variables --------------------------- */
  pageLoaded: boolean = false;
  currentUser ;
  responseState: any = '';
  responseData: any = '';
  showRole: boolean = true;
  showChecks: boolean = true;
  showModule: boolean = true;
  role: any = '';
  module: any = '';
  displayedColumns: any = [
    'name',
    'details',
    'actions',
  ];
  totalPage: any = '';
  current_page: any = '';

  company_details ;

  dataSource: any = new MatTableDataSource([]);
  pagesNumbers: any = [];
  pageId: number = 1;
  firstPage: any = '';
  labelPosition: 'before' | 'after' = 'after';
  lastPage: any = '';
  // roleFilteredOptions: Observable<any>;
  filteredRoleId: any = '';
  ModuleFilteredOptions: Observable<any>;
  filteredModuleId: any = '';
  roleObject: any = '';
  moduleObject: any = '';
  moduleArray: any = [];
  hideme: any = [];
  showOrdercontrolst: boolean = false;
  rolesArray: any = [];
  privileges: any = [
    { eng: 'create', arb: 'اضافة', icon: 'plus-circle' },
    { eng: 'update', arb: 'تعديل', icon: 'money-check-edit' },
    { eng: 'delete', arb: 'حذف', icon: 'trash' },
    { eng: 'show', arb: 'مشاهدة', icon: 'eye' },
  ];
  privilegesArray: any = ['all'];
  permissionObject: any = '';
  tableArray: any = [];
  updateMode: boolean = false;
  updateArray = [];
  updatedRow: any = '';
  updatedIndex: any = '';
  updateModuleSelect:any = {};
  /* --------------------- Filter Form ------------------------- */
  filterForm = new FormGroup({
    // userRole: new FormControl(),
    userModule: new FormControl(),
    module: new FormControl(),
    modules:new FormControl()
  });
  /* --------------------- Constructor ---------------------- */
  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(roleID => {
      console.log(roleID);
      this.filteredRoleId = roleID.roleID;
      this.coreService.getMethod('role/show/' + roleID.roleID).subscribe(role => {
        this.role = role;
        this.coreService.getMethod('permission/' + roleID.roleID).subscribe(value => {
          console.log(value);
          let arr = value['data'].map(ele => {
            let obj = { id: ele.permission_id, name: ele.permissionName, privileges: ele.privileges };
            return obj;
          });
          console.log(arr);
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < arr.length; i++) {
            this.moduleArray.map(ele => {
              if (arr[i].id == ele.id) {
                this.moduleArray.splice(this.moduleArray.indexOf(ele), 1);
              }
              
            });
          }
          if(this.moduleArray.length < 1) 
          {
            this.moduleArray = []
          }
          console.log(this.moduleArray);
          this.tableArray = arr;
          this.totalPage = arr.length-1;
          this.current_page = 1;
          if(this.totalPage > 10)
          {
           this.current_page ++ ;
          }


          this.dataSource = new MatTableDataSource(this.tableArray);
        });
      })
    })

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.coreService.superGet('companyDetails/' + this.currentUser.id).subscribe(
      res => {
        console.log(res);
        this.company_details = res
      },
      err => {
        console.log(err);
      })
  }
  /* ------------------- Oninit --------------------- */
  ngOnInit() {
    this.startLoading();
    /* ------------------ Get Roles ---------------------- */
    // this.coreService.getMethod('role/all', {}).subscribe(roles => {
    //   this.rolesArray = roles;
    // });

  
    /* ---------------------- Get Module ------------------------- */
    this.coreService.getMethod('permission').subscribe(value => {
      this.moduleArray = value['data'];
      this.moduleArray = this.moduleArray.map(item => {
        if (item.name == 'clients') {
          item.arabic = 'العملاء';
          return item;
        } else if (item.name == 'orders') {
          item.arabic = 'الطلبات';
          return item;
        }
        else if (item.name == 'offers') {
          item.arabic = 'العروض';
          return item;
        }
        else if (item.name == 'resources') {
          item.arabic = 'المصادر';
          return item;
        }
        else if (item.name == 'technicians') {
          item.arabic = 'الفنين';
          return item;
        }
        else if (item.name == 'receipts') {
          item.arabic = 'الفواتير';
          return item;
        }
        else if (item.name == 'sales') {
          item.arabic = 'المبيعات';
          return item;
        }
      });
      /* --------------- Filter Module -------------------- */
      this.ModuleFilteredOptions = this.filterForm
        .get('userModule')
        .valueChanges.pipe(
          startWith(''),
          map(value => this.filterUsersUserModule(value))
        );
      this.endLoading();
    });
    // setTimeout(() => {
    //   /* --------------- Filter Role -------------------- */
    //   this.roleFilteredOptions = this.filterForm
    //     .get('userRole')
    //     .valueChanges.pipe(
    //       startWith(''),
    //       map(value => this.filterUsersUserRole(value))
    //     );
    // }, 1000);
  }
  /* ------------------------ Change Module -------------------------- */
  changeModule(event) {
    console.log(event);
    this.showModule = false;
    this.moduleObject = event;
    this.updateModuleSelect = event;
  }
  /* --------------------------- Add Permission Item to Table ------------------------- */
  getPermissions() {
    let obj = { id: this.moduleObject.id, name: this.moduleObject.name, privileges: this.privilegesArray };
    console.log(obj);
    if (this.tableArray.indexOf(obj) === -1) {
      this.tableArray.push(obj);
    };
    console.log(this.tableArray);
    this.dataSource = new MatTableDataSource(this.tableArray);
    if (this.moduleArray.includes(this.moduleObject)) {
      this.moduleArray.splice(this.moduleArray.indexOf(this.moduleObject), 1);
    };
    this.privilegesArray = ['all'];
    this.showModule = true;
    this.filterForm.patchValue({
      filteredModuleId: '',
      userModule: ''
    });
  }
  /* --------------------------- Remove Item from Array -------------------------- */
  removeItem(index, element) {
    console.log(this.tableArray);
    console.log(this.moduleArray);
    this.dataSource = new MatTableDataSource(this.tableArray);
    console.log(index);
    this.tableArray.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.tableArray);
    if (element.name == 'clients') {
      element.arabic = 'العملاء';
    } else if (element.name == 'orders') {
      element.arabic = 'الطلبات';
    }
    else if (element.name == 'offers') {
      element.arabic = 'العروض';
    }
    else if (element.name == 'resources') {
      element.arabic = 'المصادر';
    }
    else if (element.name == 'technicians') {
      element.arabic = 'الفنين';
    }
    else if (element.name == 'receipts') {
      element.arabic = 'الفواتير';
    }
    this.moduleArray.push(element);
    console.log(this.moduleArray);

  }
  /* --------------------------- CheckBox ----------------------- */
  checkPermission(event, item) {
    if (event.checked == false) {
      this.showChecks = true;
    }
    if (event.checked == true && this.privilegesArray.indexOf(item) === -1) {
      this.privilegesArray.push(item);
      // if (item == 'update' && this.privilegesArray.indexOf('show') === -1) {
      //   this.privilegesArray.push('show');
      // }
      this.showChecks = false;
    }
    else if (event.checked == false && this.privilegesArray.indexOf(item) != -1) {
      this.privilegesArray.splice(this.privilegesArray.indexOf(item), 1);
    };
    console.log(this.privilegesArray.includes('update'))
    if ( ( this.privilegesArray.includes('update') || this.privilegesArray.includes('create') ) && this.privilegesArray.indexOf('show') === -1) {
      this.privilegesArray.push('show');
    }
    else if (!this.privilegesArray.includes('update') && this.privilegesArray.indexOf('show') != -1) {
      // this.privilegesArray.splice(this.privilegesArray.indexOf('show'), 1);
    }
    console.log(this.privilegesArray);
  }
  /* ------------------------ Create Permission --------------------------- */
  createPermission() {
    let obj = { permission: this.tableArray, role_id: this.filteredRoleId };
    console.log(obj);
    this.startLoading();
    this.coreService.postMethod('permission/add', obj).subscribe(value => {
      console.log(value);
      this.showSuccess();
      setTimeout(() => {
        this.router.navigateByUrl('/roles/all-roles');
      }, 2000);
      this.endLoading();
    }, error => {
      if (error.error.errors) {
        this.showErrors(error.error.errors);
      } else {
        this.showErrors(error.error.message);
      }
    })
  }
  /* -------------------------- Filter Module ----------------------------- */
  filterUsersUserModule(value: any) {
    if (typeof value === 'object') {
      this.filteredModuleId = value.id;
      this.pageId = 1;
      this.showModule = false;
      console.log(value);
      this.moduleObject = value;
    }
    if (value === '') {
      this.showModule = true;
      this.filteredModuleId = '';
      this.pageId = 1;
      console.log(this.moduleArray);
    }
    return this.moduleArray.filter(option => option.arabic.includes(value));
  }
  /* ------------------ Display Module ---------------------- */
  displayModule(module) {
    if (module !== null) {
      return module.arabic;
    }
  }
  /* ---------------------- Update Item --------------------- */
  updateItem(i, row) {
    console.log(row);
    this.updatedRow = row;
    this.updatedIndex = i;
    console.log(this.tableArray[i].privileges);
    this.privilegesArray = this.tableArray[i].privileges;
    this.updateArray = row.privileges;
    console.log(this.updateArray);
    
    this.updateMode = true;
    this.showModule = true ;
    console.log(this.updateModuleSelect)
    this.filterForm.controls.modules.setValue(this.updateModuleSelect);
    console.log(this.filterForm.controls.modules.value);
    

    console.log(this.privilegesArray);
  }
  /* --------------------- Update ----------------- */
  updatePerm() {
    console.log(this.tableArray[this.updatedIndex]);
    this.updateMode = false;
    this.privilegesArray = ['all'];
  }
  /* ------------------- Filter Roles ------------------- */
  // filterUsersUserRole(value: any) {
  //   if (typeof value === 'object') {
  //     this.showRole = false;
  //     this.filteredRoleId = value.id;
  //     this.pageId = 1;
  //     console.log(value);
  //     this.coreService.getMethod('permission/' + value.id).subscribe(value => {
  //       console.log(value);
  //       let arr = value['data'].map(ele => {
  //         let obj = { id: ele.permission_id, name: ele.permissionName, privileges: ele.privileges };
  //         return obj;
  //       });
  //       console.log(arr);
  //       // tslint:disable-next-line: prefer-for-of
  //       for (let i = 0; i < arr.length; i++) {
  //         this.moduleArray.map(ele => {
  //           if (arr[i].id == ele.id) {
  //             this.moduleArray.splice(this.moduleArray.indexOf(ele), 1);
  //           }
  //         });
  //       }
  //       console.log(this.moduleArray);
  //       this.tableArray = arr;
  //       this.dataSource = new MatTableDataSource(this.tableArray);
  //     });
  //   }
  //   if (value === '' || value == undefined) {
  //     this.filteredRoleId = '';
  //     this.pageId = 1;
  //     this.showRole = true;
  //   }
  //   return this.rolesArray.filter(option => option.name.includes(value));
  // }
  /* ----------------------------- Display Options ---------------------- */
  // displayOptionsFunction(state) {
  //   if (state !== null) {
  //     return state.name;
  //   }
  // }
  /* --------------------- Reset Inputs ----------------------------- */
  xResetInputs(key) {
    if (key === 'userRole') {
      this.filterForm.patchValue({
        filteredRoleId: '',
        userRole: ''
      });
    }
    else if (key === 'userModule') {
      this.filterForm.patchValue({
        filteredModuleId: '',
        userModule: ''
      });
    }
    this.pageId = 1;
  }
  /* --------------------- Start Loading ------------------------ */
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  /* --------------------- End Loading ------------------------ */
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
  }
  /* -------------------- Show Error Message --------------------- */
  showErrors(errors) {
    this.endLoading();
    this.responseState = 'error';
    this.responseData = errors;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  /* -------------------- Show Success Message --------------------- */
  showSuccess() {
    this.endLoading();
    this.responseState = 'success';
    this.responseData = 'تم اضافة صلاحيات بنجاح';
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }

 
}
