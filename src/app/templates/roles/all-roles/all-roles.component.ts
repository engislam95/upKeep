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
  selector: 'app-all-roles',
  templateUrl: './all-roles.component.html',
  styleUrls: ['./all-roles.component.scss'],
  animations: [popup]
})
export class AllRolesComponent implements OnInit {
  /* ----------------------------- Variables ------------------------- */
  filteredRolesData: any = '';
  responseData: any = '';
  responseState: any = '';
  deletedRoleName: string = '';
  updatedRoleName: string = '';
  showUpdatePopup: boolean = false;
  pageLoaded: boolean = false;
  showDeletePopup: boolean = false;
  showOrdercontrolst: boolean = false;
  deletedRoleID: number;
  updatedRoleID: number;
  // Angular Material Table
  displayedColumns = [
    'ID',
    'name',
    'count',
    // 'edit',
    // 'details',
    // 'delete',
    'actions'
  ];
  hideme: any = [];
  dataSource: any = [];
  pagesNumbers: any = [];
  pageId: number = 1;
  firstPage: any = '';
  lastPage: any = '';
  statusArray = [{ name: 'مفعل', id: 1 }, { name: 'غير مفعل', id: 0 }];
  statusFilteredOptions: Observable<any>;
  filteredStatusId: any = '';
  current_page: any = '';
  totalPage: any = '';
  /* ----------------- Filter Form ---------------- */
  filterForm = new FormGroup({
    RoleStatus: new FormControl(),
    filterName: new FormControl()
  });
  /* -------------------- Constructor --------------------------- */
  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private paginationService: PaginationService
  ) {}
  /* ------------------------ Oninit -------------------------- */
  ngOnInit() {
    this.startLoading();
    this.getAllRoles(this.pageId);
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
        this.filteredRolesData = value;
        this.getAllRoles(this.pageId);
      });
    this.statusFilteredOptions = this.filterForm
      .get('RoleStatus')
      .valueChanges.pipe(
        startWith(''),
        map(value => this.filterRolesStatus(value))
      );
  }
  changePagination(event) {
    this.getAllRoles(event.value);
  }
  /* ------------------- Status Filter ----------------------- */
  filterRolesStatus(value: any) {
    if (typeof value === 'object') {
      this.filteredStatusId = value.id;
      this.pageId = 1;
      this.getAllRoles(this.pageId);
    }
    if (value === '') {
      this.filteredStatusId = '';
      this.pageId = 1;
      this.getAllRoles(this.pageId);
    }
    return this.statusArray.filter(option => option.name.includes(value));
  }
  displayOptionsFunction(state) {
    if (state !== null) {
      return state.name;
    }
  }
  /* ------------------------------ Reset ----------------------- */
  xResetInputs(key) {
    if (key === 'filterName') {
      this.filterForm.patchValue({
        filteredRolesData: '',
        filterName: ''
      });
      this.filteredRolesData = '';
    } else if (key === 'RoleStatus') {
      this.filterForm.patchValue({
        filteredStatusId: '',
        RoleStatus: ''
      });
    }
    this.pageId = 1;
    this.getAllRoles(this.pageId);
  }
  /* ---------------------------- Get Role ------------------------- */
  getAllRoles(pageId) {
    this.loaderService.startLoading();
    this.coreService
      .getMethod('role/all?page=' + pageId, {
        name: this.filteredRolesData,
        per_page: 10
      })
      .subscribe((roles: any) => {
        console.log(roles);
        this.current_page = roles.current_page;
        this.totalPage = roles.last_page;
        this.dataSource = roles.data;
        if (this.dataSource.length === 0 && this.pageId === 1) {
        }
        if (this.dataSource.length === 0 && this.pageId > 1) {
          this.pageId -= 1;
          this.pagesNumbers.splice(-1);
          this.goPage(this.pageId);
        }
        this.endLoading();
        this.pagination(roles.total, roles.per_page);
      });
  }
  nextPage(pageNum) {
    this.getAllRoles(+pageNum + 1);
  }
  prevPage(pageNum) {
    this.getAllRoles(+pageNum - 1);
  }
  /* ------------------------ Pagination --------------------- */
  pagination(totalRolesNumber, rolePerPage) {
    this.pagesNumbers = [];
    const totalPages = Math.ceil(totalRolesNumber / rolePerPage);
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
      this.getAllRoles(this.pageId);
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
  /* ------------------ Open Delete Popup -------------------------- */
  openDeletePopup(id, name) {
    this.deletedRoleName = name;
    this.deletedRoleID = id;
    this.showDeletePopup = true;
  }
  /* ------------------------ Delete Role ------------------------- */
  deleteRole() {
    this.closePopup();
    this.startLoading();
    this.coreService
      .deleteMethod('role/destroy/' + this.deletedRoleID)
      .subscribe(
        () => {
          this.showSuccess();
          this.getAllRoles(this.pageId);
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
  /* ------------------------- Close Delete Popup ------------------------ */
  closePopup() {
    this.showDeletePopup = false;
  }
  /* ----------------------- Open Update Popup -------------------------- */
  openUpdatePopup(id, name) {
    this.deletedRoleName = name;
    this.deletedRoleID = id;
    this.showDeletePopup = true;
  }
  /* ----------------------- Start Loading --------------------- */
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  /* ------------------ End Loading -------------------------- */
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
  }
  /* -------------------- Show Error Messages ---------------------- */
  showErrors(errors) {
    this.endLoading();
    this.responseState = 'error';
    this.responseData = errors;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  /* ----------------------- Show Success Message --------------------- */
  showSuccess(successText?) {
    this.endLoading();
    this.responseState = 'success';
    this.responseData = 'تم حذف الوظيفة بنجاح';
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
}
