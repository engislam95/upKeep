import { MessagingService } from './../../../tools/shared-services/messaging.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreService } from './../../../tools/shared-services/core.service';
import { LoaderService } from '../../../tools/shared-services/loader.service';
import { PaginationService } from './../../../tools/shared-services/pagination.service';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';
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
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss'],
  animations: [popup]
})
export class AllUsersComponent implements OnInit {
  /* ----------------------------- Variables --------------------------- */
  filteredUsersData = '';
  pageLoaded: boolean = false;
  responseState: any = '';
  responseData: any = '';
  deletedUserName: string = '';
  deletedUserID: number;
  showDeletePopup: boolean = false;
  showUpdatePopup: boolean = false;
  showOrdercontrolst: boolean = false;
  displayedColumns: any = [
    'ID',
    'name',
    'role',
    'email',
    'phone',
    'status',
    // 'edit',
    // 'details',
    // 'delete',
    'actions'
  ];
  dataSource: any = [];
  pagesNumbers: any = [];
  hideme: any = [];
  pageId: number = 1;
  firstPage: any = '';
  lastPage: any = '';
  statusArray = [{ name: 'مفعل', id: 1 }, { name: 'غير مفعل', id: 0 }];
  statusFilteredOptions: Observable<any>;
  roleFilteredOptions: Observable<any>;
  filteredStatusId: any = '';
  filteredRoleId: any = '';
  rolesArray: any = [];
  current_page = '';
  totalPage = '';
  /* --------------------- Filter Form ------------------------- */
  filterForm = new FormGroup({
    usersStatus: new FormControl(),
    userRole: new FormControl(),
    filterName: new FormControl()
  });
  /* --------------------- Constructor ---------------------- */
  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private paginationService: PaginationService
  ) {}
  /* ------------------- Oninit --------------------- */
  ngOnInit() {
    this.startLoading();
    this.getAllUsers(this.pageId);
    /* ------------------ Get Roles ---------------------- */
    this.coreService.getMethod('role/all', {}).subscribe(roles => {
      this.rolesArray = roles;
      this.roleFilteredOptions = this.filterForm
        .get('userRole')
        .valueChanges.pipe(
          startWith(''),
          map(value => this.filterUsersUserRole(value))
        );
    });
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
        this.filteredUsersData = value;
        this.getAllUsers(this.pageId);
      });
    this.statusFilteredOptions = this.filterForm
      .get('usersStatus')
      .valueChanges.pipe(
        startWith(''),
        map(value => this.filterUsersStatus(value))
      );
  }
  /* ------------------- Filter Status ------------------- */
  filterUsersStatus(value: any) {
    if (typeof value === 'object') {
      this.filteredStatusId = value.id;
      this.pageId = 1;
      this.getAllUsers(this.pageId);
    }
    if (value === '') {
      this.filteredStatusId = '';
      this.pageId = 1;
      this.getAllUsers(this.pageId);
    }
    return this.statusArray.filter(option => option.name.includes(value));
  }
  /* ------------------- Filter Roles ------------------- */
  filterUsersUserRole(value: any) {
    if (typeof value === 'object') {
      this.filteredRoleId = value.id;
      this.pageId = 1;
      this.getAllUsers(this.pageId);
    }
    if (value === '') {
      this.filteredRoleId = '';
      this.pageId = 1;
      this.getAllUsers(this.pageId);
    }
    return this.rolesArray.filter(option => option.name.includes(value));
  }
  /* ----------------------------- Display Options ---------------------- */
  displayOptionsFunction(state) {
    if (state !== null) {
      return state.name;
    }
  }
  /* --------------------- Reset Inputs ----------------------------- */
  xResetInputs(key) {
    if (key === 'filterName') {
      this.filterForm.patchValue({
        filteredUsersData: '',
        filterName: ''
      });
      this.filteredUsersData = '';
    } else if (key === 'usersStatus') {
      this.filterForm.patchValue({
        filteredStatusId: '',
        usersStatus: ''
      });
    } else if (key === 'userRole') {
      this.filterForm.patchValue({
        filteredRoleId: '',
        userRole: ''
      });
    }
    this.pageId = 1;
    this.getAllUsers(this.pageId);
  }
  /* ----------------------- Get All Users ------------------------------ */
  getAllUsers(pageId) {
    this.loaderService.startLoading();
    this.coreService
      .getMethod('user/all?page=' + pageId, {
        search: this.filteredUsersData,
        active: this.filteredStatusId,
        role: this.filteredRoleId,
        per_page: 10
      })
      .subscribe((users: any) => {
        console.log(users);
        this.dataSource = users.data;
        this.current_page = users.current_page;
        this.totalPage = users.last_page;
        if (this.dataSource.length === 0 && this.pageId === 1) {
        }
        if (this.dataSource.length === 0 && this.pageId > 1) {
          this.pageId -= 1;
          this.pagesNumbers.splice(-1);
          this.goPage(this.pageId);
        }
        this.endLoading();
        this.pagination(users.total, users.per_page);
      });
  }
  nextPage(pageNum) {
    this.getAllUsers(+pageNum + 1);
  }
  prevPage(pageNum) {
    this.getAllUsers(+pageNum - 1);
  }
  /* ------------------------- Pagination ------------------------- */
  pagination(totalUsersNumber, usersPerPage) {
    this.pagesNumbers = [];
    const totalPages = Math.ceil(totalUsersNumber / usersPerPage);
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      this.pagesNumbers.push(pageNumber);
    }
    this.checkPagination(this.pageId);
  }
  goPage(i) {
    if (i >= 1 && i <= this.pagesNumbers.length) {
      this.pageId = i;
      this.checkPagination(i);
      this.startLoading();
      this.getAllUsers(this.pageId);
    }
  }
  checkPagination(pageId) {
    const [firstPage, lastPage] = this.paginationService.checkPaginationButtons(
      pageId,
      this.pagesNumbers.length
    );
    this.firstPage = firstPage;
    this.lastPage = lastPage;
  }
  /* ------------------------ Open Delete Popup ---------------------- */
  openDeletePopup(id, name) {
    this.deletedUserName = name;
    this.deletedUserID = id;
    this.showDeletePopup = true;
  }
  /* ------------------------- Delete User --------------------------- */
  deleteTechnical() {
    this.closePopup();
    this.startLoading();
    this.coreService
      .deleteMethod('user/destroy/' + this.deletedUserID)
      .subscribe(
        () => {
          this.showSuccess();
          this.getAllUsers(this.pageId);
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
  /* ----------------------------- Close Popup --------------------------- */
  closePopup() {
    this.showDeletePopup = false;
  }
  /* ----------------------- Update User ------------------------------- */
  openUpdatePopup(id, name) {
    this.deletedUserName = name;
    this.deletedUserID = id;
    this.showDeletePopup = true;
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
    this.responseData = 'تم حذف المستخدم بنجاح';
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
}
