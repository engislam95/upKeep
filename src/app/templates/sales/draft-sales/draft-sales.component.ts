import { MessagingService } from './../../../tools/shared-services/messaging.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreService } from './../../../tools/shared-services/core.service';
import { LoaderService } from '../../../tools/shared-services/loader.service';
import { PaginationService } from './../../../tools/shared-services/pagination.service';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';
import { popup } from '../../../tools/shared_animations/popup';
import {
  map,
  debounceTime,
  distinctUntilChanged,
  startWith
} from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { noAddressValidator } from 'src/app/tools/shared_validators/NoAddress.validator';
import { startEndTimeValidator } from 'src/app/tools/shared_validators/StartEndTime.validator';

@Component({
  selector: 'app-draft-sales',
  templateUrl: './draft-sales.component.html',
  styleUrls: ['./draft-sales.component.scss'],
  animations: [popup]
})
export class DraftSalesComponent implements OnInit {
  //
  // ─── START GENERAL DATA ──────────────────────────────────────────
  //
  hideme = [];
  showOrdercontrolst = false;
  pageLoaded = false;
  responseState;
  responseData;

  deletedOrderClientName: string;
  deletedOrderId: number;
  showDeletePopup = false;
  user: any = '';
  showMapPopup = false;
  overLayShow = false;

  //
  // ─── START TABLE DATA ─────────────────────────────────────────────────────────────────
  //

  displayedColumns = [
    'ID',
    'technical_name',
    'client_name',
    'main_service',
    'service_date',
    'order_res',
    'map',
    // 'city',
    // 'order_time',
    // 'order_status',
    'order_details'
  ];
  sales: any = [];
  pageID = 1;
  par_page = 10;
  countPerPage: any = [];
  current_page: any = '';
  totalPage: any = '';
  clientMapDetails:any = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private router: Router,
    private paginationService: PaginationService,
    private messagingService: MessagingService
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.user);
    this.getAllSales();

  }

  openMap(row) {
    console.log(row);
    this.showMapPopup = true;
    this.overLayShow  = true
    this.clientMapDetails = row;
  }

  getAllSales() {
    this.startLoading();
    this.coreService.getMethod('sales/client/orders', {
      page: this.pageID,
      per_page: 10
    }).subscribe((data: any) => {
      console.log(data);
      this.sales = data['data']['data'];
      this.current_page = data['data'].current_page;
      this.totalPage = data['data'].last_page;
      // Start End Loading
      this.endLoading();
    });
  }

  pageCountOptions() {
    for (let option = 10; option <= 50; option += 10) {
      this.countPerPage.push(option);
    }
  }

  setCountPerPage(option) {
    // Start START Loading
    this.startLoading();
    // End START Loading
    this.pageID = 1;
    this.par_page = option;
    this.getAllSales();
    // End Select
    this.endLoading();
    // End END Loading
  }


  //
  // ─── START ONINIT ────────────────────────────────────────────────
  //

  ngOnInit() {
    this.pageCountOptions();
  }

  changePagination(event) {
    this.pageID = event.value;
    this.getAllSales();
  }


  nextPage(pageNum) {
    this.pageID = +pageNum + 1;
    this.getAllSales();
  }
  prevPage(pageNum) {
    this.pageID = +pageNum - 1;
    this.getAllSales();
  }


  openDeletePopup(id, name) {
    this.deletedOrderClientName = name;
    this.deletedOrderId = id;
    this.showDeletePopup = true;
  }
  deleteTechnical() {
    this.closePopup();
    this.startLoading();
    this.coreService
      .deleteMethod('sales/client/orders/' + this.deletedOrderId)
      .subscribe(
        () => {
          this.showSuccess();
          this.getAllSales();
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
  //

  //
  // ─── START LOADING FUNCTIONS ────────────────────────────────────────────────────
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
  // ──────────────────────────────────────────────────── END LOADING FUNCTIONS ─────
  //

  //
  // ─── START RESPONSE MESSEGES ────────────────────────────────────────────────────
  //

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
    this.responseData = 'تم حذف الطلب بنجاح';
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }

  //
  // ──────────────────────────────────────────────────── END RESPONSE MESSEGES ─────
  //
}
