import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from './../../../tools/shared-services/loader.service';
import { CoreService } from './../../../tools/shared-services/core.service';
import { MessagingService } from './../../../tools/shared-services/messaging.service';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';
import { HeadersService } from './../../../tools/shared-services/headers.service';
import { fade } from './../../../tools/shared_animations/fade';
import { popup } from '../../../tools/shared_animations/popup';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  animations: [fade, popup]
})
export class OrderDetailsComponent implements OnInit {
  //  ######################### Start General Data #########################
  orderStatusId;
  pageLoaded = false;
  responseState;
  responseData;
  orderDetails = '';
  orderDetailsHistory = [];
  orderId;
  canEdit;
  editButton;
  controlPanelActive = [];
  showPostponedPopup = false;
  showCanceledPopup = false;
  showSuspendPopup = false;
  postponedReason;
  canceledReason;
  suspendReason;
  // Active State For Control Panel
  active18 = false;
  active19 = false;
  active20 = false;
  active21 = false;
  active22 = false;
  active29 = false;
  active35 = false;
  active40 = false;
  active41 = false;
  active42 = false;
  // ////////////
  invoideId;

  invoiceData = {
    client: {
      name: '',
      email: null,
      phone: null,
      user: { name: '', email: null, mobile: null }
    },
    receipt_number: '',
    receipt_client_type: '',
    created_at: '',
    user: { name: '', privilege_type: { description: '' } },
    currency: { name: '' },
    items: [],
    urlcode: '',
    discount: 0,
    tax: 0,
    total: 0
  };

  tiles: Tile[] = [
    { text: 'One', cols: 1, rows: 2, color: 'lightblue' },
    { text: 'Two', cols: 1, rows: 1, color: 'lightgreen' },
    { text: 'Three', cols: 2, rows: 1, color: 'lightpink' },
    { text: 'Four', cols: 3, rows: 1, color: '#DDBDF1' }
  ];
  // //////

  spiltedCreatedDate;
  taxDetails = [];

  // NOTE
  invoideIdOrderDetails;

  invoiceDataPdfUrlCode;
  baseAPI;

  // NOTE
  order_add: boolean = false;
  order_all: boolean = false;
  order_update: boolean = false;
  order_delete: boolean = false;
  orders: any = [];
  user: any = '';
  // Active State For Control Panel
  //  ######################### End General Data #########################
  constructor(
    //
    private loaderService: LoaderService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private responseStateService: ResponseStateService,
    private messagingService: MessagingService,
    private headersService: HeadersService
  ) {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log(this.user);
    this.orders = this.user.modules.orders;
    if (this.orders) {
      this.orders.map(ele => {
        switch (ele) {
          case 'create':
            this.order_add = true;
            break;
          case 'show':
            this.order_all = true;
            break;
          case 'update':
            this.order_update = true;
            break;
          case 'delete':
            this.order_delete = true;
            break;
        }
      });
    }
  }
  //  ############################### Start OnInit ###############################
  ngOnInit() {
    window.scroll({ top: 0, behavior: 'auto' });

    // Start START Loading
    this.startLoading();
    // End START Loading
    this.activatedRoute.queryParams.subscribe(params => {
      this.orderId = params.orderId;
    });
    this.getOrderDetails();
    this.listenOrdersUpdates();
    this.baseAPI = this.headersService.baseAPI + 'rc/';
  }

  //
  // ─── START LISTEN FOR ORDERS UPDATES ────────────────────────────────────────────
  //

  listenOrdersUpdates() {
    this.messagingService.orderUpdatedNotification.subscribe(
      (orderUpdate: any) => {
        if (this.orderId === orderUpdate.id) {
          this.startLoading();
          this.getOrderDetails();
        }
      }
    );
  }

  //
  // ──────────────────────────────────────────── END LISTEN FOR ORDERS UPDATES ─────
  //

  //
  // ─── START GET ORDER DETAILS ────────────────────────────────────────────────────
  //
  getOrderDetails() {
    this.coreService
      .getMethod('orders/' + this.orderId + '/details', {})
      .subscribe((order: any) => {
        console.log('here in getOrderDetails()');

        this.orderDetails = order.data;
        this.orderStatusId = order.data.status.id;
        this.orderDetailsHistory = order.data.history;

        if (this.orderStatusId == 35) {
          this.invoiceDataPdfUrlCode = order.data.receipt.urlcode;
          this.invoideIdOrderDetails = order.data.receipt.id;
        }

        if (this.orderDetails['receipt'] !== null) {
          this.taxDetails = order.data.receipt.tax_details;
        }
        this.spiltedCreatedDate = this.orderDetails['created_at'].split(' ');
        this.checkActiveButtonsCPanel(this.orderDetails['allowed_controls']);
        console.log('', this.orderDetails['allowed_controls']);
        // this.checkCanEdit();
        // Start END Loading
        this.endLoading();
        // End END Loading
      });
  }

  //
  // ──────────────────────────────────────────────────── END GET ORDER DETAILS ─────
  //

  // checkCanEdit() {
  //   if (this.orderDetails.canEdit === false) {
  //     this.editButton = document.getElementById('editButton');
  //     this.editButton.className = 'update_Disabled';
  //   }
  // }
  //  ############################### End OnInit ###############################

  //  ############################### Start Update Current Order Status ###############################
  updateCurrentOrderStatus(satusResponse, sucessText) {
    this.orderDetailsHistory.push(
      satusResponse.data.history[satusResponse.data.history.length - 1]
    );
    this.orderDetails['status'].id = satusResponse.data.current_status.id;
    this.orderDetails['status'].name = satusResponse.data.current_status.name;
    this.checkActiveButtonsCPanel(satusResponse.data.allowed_controls);
    setTimeout(() => {
      this.showSuccess(sucessText);
    }, 100);
  }
  //  ############################### End Update Current Order Status ###############################

  /*
    ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
                   Finished
    ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  */
  //  ############################### Start END Order Approved ###############################
  finishOrder() {
    // Start START Loading
    this.startLoading();
    // End START Loading
    this.coreService
      .updateMethod('orders/' + this.orderId + '/finish', '')
      .subscribe(
        (finishOrderResponse: any) => {
          this.updateCurrentOrderStatus(
            finishOrderResponse,
            'تم إنتهاء الطلب بنجاح'
          );
          this.getOrderDetails();
          // Start END Loading
          this.endLoading();
          // End END Loading
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

  finishwithoutOrder() {
    // Start START Loading
    this.startLoading();
    // End START Loading
    this.coreService
      .updateMethod('orders/' + this.orderId + '/finishwithoutreceipt', '')
      .subscribe(
        (finishOrderResponse: any) => {
          console.log(finishOrderResponse);

          this.updateCurrentOrderStatus(
            finishOrderResponse,
            'تم إنتهاء الطلب بدون اصدار فاتورة بنجاح'
          );
          this.getOrderDetails();
          // Start END Loading
          this.endLoading();
          // End END Loading
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

  //  ############################### End END Order Approved ###############################

  //  ######################### Start Get Invoice Details #########################
  getInvoiceDetails() {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.invoideId = queryParams.incoiveID;
      this.coreService
        .getMethod('receipts/' + this.invoideId, {})
        .subscribe((getInvoiceDetails: any) => {
          this.invoiceData = getInvoiceDetails.data[0];
          this.endLoading();
        });
    });
  }
  //  ######################### End Get Invoice Details #########################
  //  ############################### Start START Order Approved ###############################
  startOrder() {
    // Start START Loading
    this.startLoading();
    // End START Loading
    this.coreService
      .updateMethod('orders/' + this.orderId + '/start', '')
      .subscribe(
        (startOrderResponse: any) => {
          this.updateCurrentOrderStatus(
            startOrderResponse,
            'تم بدء الطلب بنجاح'
          );
          // Start END Loading
          this.endLoading();
          // End END Loading
        },
        error => {
          if (error.error.errors) {
            this.showErrors(error.error.errors);
          } else if (error.error.status === 'warning') {
            this.showWarnings(error.error.message);
          } else {
            this.showErrors(error.error.message);
          }
        }
      );
  }
  //  ############################### End START Order Approved ###############################
  //  ######################### Start Postponed Technical #########################
  postponedReasonFunction(e) {
    this.postponedReason = e;
  }
  openPostponedPopup() {
    this.showPostponedPopup = true;
  }
  postponed() {
    this.closePopup();
    this.startLoading();
    this.coreService
      .updateMethod('orders/' + this.orderId + '/postpone', {
        reason: this.postponedReason
      })
      .subscribe(
        (postponedResponse: any) => {
          this.updateCurrentOrderStatus(
            postponedResponse,
            'تم تأجيل الطلب بنجاح'
          );
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
    this.showPostponedPopup = false;
  }
  //  ######################### End Postponed Technical #########################

  //  ######################### Start canceled  Technical #########################
  canceledReasonFunction(e) {
    this.canceledReason = e;
  }
  openCanceledPopup() {
    this.showCanceledPopup = true;
  }
  canceled() {
    this.closeCanceledPopup();
    this.startLoading();
    this.coreService
      .updateMethod('orders/' + this.orderId + '/cancel', {
        reason: this.canceledReason
      })
      .subscribe(
        (canceledResponse: any) => {
          this.updateCurrentOrderStatus(
            canceledResponse,
            'تم إلغاء الطلب بنجاح'
          );
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
  closeCanceledPopup() {
    this.showCanceledPopup = false;
  }
  //  ######################### End canceled  Technical #########################

  //  ######################### Start Suspend  Technical ###########################
  suspendReasonFunction(e) {
    this.suspendReason = e;
  }
  openSuspendPopup() {
    this.showSuspendPopup = true;
  }
  suspend() {
    this.closeSuspendPopup();
    this.startLoading();
    this.coreService
      .updateMethod('orders/' + this.orderId + '/suspend', {
        reason: this.suspendReason
      })
      .subscribe(
        (suspendResponse: any) => {
          this.updateCurrentOrderStatus(
            suspendResponse,
            'تم إلغاء الطلب بنجاح'
          );
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
  closeSuspendPopup() {
    this.showSuspendPopup = false;
  }
  //  ######################### End Suspend  Technical #########################
  //  ############################### Start Technical Approved ###############################
  technicalApproved() {
    // Start START Loading
    this.startLoading();
    // End START Loading
    this.coreService
      .updateMethod('orders/' + this.orderId + '/technician_approved', '')
      .subscribe(
        (technicalApprovedResponse: any) => {
          this.updateCurrentOrderStatus(
            technicalApprovedResponse,
            'تم موافقة الفني بنجاح'
          );
          // Start END Loading
          this.endLoading();
          // End END Loading
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
  //  ############################### End Technical Approved ###############################
  //  ############################### Start Technical Approved ###############################
  onGoing() {
    // Start START Loading
    this.startLoading();
    // End START Loading
    this.coreService
      .updateMethod('orders/' + this.orderId + '/ongoing', '')
      .subscribe(
        (onGoingResponse: any) => {
          this.updateCurrentOrderStatus(onGoingResponse, 'الفني في الطريق');
          // Start END Loading
          this.endLoading();
          // End END Loading
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
  //  ############################### End Technical Approved ###############################
  //  ############################### Start Admin Approved ###############################
  adminApproved() {
    // Start START Loading
    this.startLoading();
    // End START Loading
    this.coreService
      .updateMethod('orders/' + this.orderId + '/admin_approved', '')
      .subscribe(
        (adminApprovedResponse: any) => {
          this.updateCurrentOrderStatus(
            adminApprovedResponse,
            'تم موافقة المشرف بنجاح'
          );
          // Start END Loading
          this.endLoading();
          // End END Loading
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
  //  ############################### End Admin Approved ###############################
  //  ######################### Start Check Active Control Panel #########################
  checkActiveButtonsCPanel(allowedControls) {
    this.active18 = false;
    this.active19 = false;
    this.active20 = false;
    this.active21 = false;
    this.active22 = false;
    this.active29 = false;
    this.active35 = false;
    this.active40 = false;
    this.active41 = false;
    this.active42 = false;
    if (allowedControls) {
      allowedControls.forEach(buttonState => {
        if (buttonState === 18) {
          this.active18 = true;
        }
        if (buttonState === 19) {
          this.active19 = true;
        }
        if (buttonState === 20) {
          this.active20 = true;
        }
        if (buttonState === 21) {
          this.active21 = true;
        }
        if (buttonState === 22) {
          this.active22 = true;
        }
        if (buttonState === 29) {
          this.active29 = true;
        }
        if (buttonState === 35) {
          this.active35 = true;
        }
        if (buttonState === 40) {
          this.active40 = true;
        }
        if (buttonState === 41) {
          this.active41 = true;
        }
        if (buttonState === 42) {
          this.active42 = true;
        }
      });
    }
  }
  //  ######################### End Check Active Control Panel #########################
  //  ######################### Start Go To Order Invoice #########################
  goToOrderInvoice() {
    window.scroll({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/invoices/order-invoice'], {
      queryParams: { orderId: this.orderId }
    });
  }
  //  ######################### End Go To Order Invoice #########################
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
  //  ############################ Start Response Messeges ############################
  showErrors(errors) {
    this.endLoading();
    this.responseState = 'error';
    this.responseData = errors;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  showWarnings(warning) {
    this.endLoading();
    this.responseState = 'warning';
    this.responseData = warning;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  showSuccess(successText) {
    this.endLoading();
    this.responseState = 'success';
    this.responseData = successText;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  //  ############################ End Response Messeges ############################
}
