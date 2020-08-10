import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from './../../../tools/shared-services/loader.service';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';
import { CoreService } from '../../../tools/shared-services/core.service';
import { HeadersService } from './../../../tools/shared-services/headers.service';

@Component({
  selector: 'app-send-invoice',
  templateUrl: './send-invoice.component.html',
  styleUrls: ['./send-invoice.component.scss']
})
export class SendInvoiceComponent implements OnInit {
  //
  // ─── START GENERAL DATA ──────────────────────────────────────────
  //

  pageLoaded = false;
  responseState;
  responseData;
  invoideId;
  baseAPI;
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

  //
  // ────────────────────────────────────────── END GENERAL DATA ─────
  //

  constructor(
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private headersService: HeadersService
  ) {}

  //
  // ─── START ONINIT ────────────────────────────────────────────────
  //

  ngOnInit() {
    window.scroll({ top: 0, behavior: 'auto' });

    // Start STAR Loading
    this.startLoading();
    // End STAR Loading
    // Start Get nvoice Details
    this.getInvoiceDetails();
    // End Get nvoice Details
    this.baseAPI = this.headersService.baseAPI + 'rc/';
  }

  //
  // ──────────────────────────────────────────────── END ONINIT ─────
  //

  //
  // ─── START SEND INVOICE WHATSAPP ─────────────────────────────────
  //

  sendInvoiceWhatsapp() {
    let phoneNumber;
    if (this.invoiceData.receipt_client_type !== '') {
      if (this.invoiceData.receipt_client_type === 'source') {
        phoneNumber = this.invoiceData.client.phone;
      } else {
        phoneNumber = this.invoiceData.client.user.mobile;
      }
    }

    const num = '00' + phoneNumber.toString();
    const newnum = parseInt(num, 10);
    const pdfURL = this.baseAPI + this.invoiceData.urlcode;
    // check from
    const data = 'رابط تحميل الفاتورة : ' + '%0A' + pdfURL;
    window.open('https://wa.me/' + newnum + '?text=' + data, '_blank');
  }
  //
  // ───────────────────────────────── END SEND INVOICE WHATSAPP ─────
  //

  //
  // ────────────────────────────── END SEND INVOICE EMAIL - SMS ─────
  //

  sendInvoice(type) {
    // Start STAR Loading
    this.startLoading();
    // End STAR Loading
    this.coreService
      .getMethod('receipts/' + this.invoideId + '/send/' + type, {})
      .subscribe(
        sendInvoiceResponse => {
          let successText;
          type === 'mail'
            ? (successText = 'تم إرسال الفاتورة الي البريد الإلكتروني بنجاح')
            : (successText = 'تم إرسال الفاتورة الي رقم الموبايل بنجاح');
          this.showSuccess(successText);
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
  //
  // ────────────────────────────── END SEND INVOICE EMAIL - SMS ─────
  //

  //
  // ─── START GET INVOICE DETAILS ───────────────────────────────────
  //

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

  //
  // ─────────────────────────────────── END GET INVOICE DETAILS ─────
  //

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
  // ───────────────────────────────────── END LOADING FUNCTIONS ─────
  //

  //
  // ─── START RESPONSE MESSEGES ─────────────────────────────────────
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
  showSuccess(successText) {
    this.endLoading();
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
