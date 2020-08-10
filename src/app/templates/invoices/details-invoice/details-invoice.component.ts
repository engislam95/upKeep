import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { popup } from '../../../tools/shared_animations/popup';
import { CoreService } from './../../../tools/shared-services/core.service';
import { LoaderService } from './../../../tools/shared-services/loader.service';
import { ResponseStateService } from 'src/app/tools/shared-services/response-state.service';
import { HeadersService } from 'src/app/tools/shared-services/headers.service';

@Component({
  selector: 'app-details-invoice',
  templateUrl: './details-invoice.component.html',
  styleUrls: ['./details-invoice.component.scss'],
  animations: [popup]
})
export class DetailsInvoiceComponent implements OnInit {
  showDeletePopup = false;
  pageLoaded = false;
  invoiceDetails: any = '';
  invoiceID: any = '';
  showEditPopup = false;
  responseState: any = '';
  responseData: any = '';
  baseAPI: any = '';
  baseAPIPrint: any = '';
  displayedColumns: string[] = [
    'id',
    'Item_type',
    // 'Item_details',
    'the_number',
    'unit_price',
    'notes',
    'total'
  ];
  dataSource: any = [];
  receipt: any = '';
  sms: any = '';
  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private headersService: HeadersService,
    private coreService: CoreService,
    private responseStateService: ResponseStateService
  ) {
    this.route.queryParams.subscribe(data => {
      this.startLoading();
      console.log(data);
      this.invoiceID = data.incoiveID;
      this.coreService
        .getMethod('receipts/' + data.incoiveID)
        .subscribe(data => {
          console.log(data['data'][0]);
          this.invoiceDetails = data['data'][0];
          this.dataSource = new MatTableDataSource<any>(
            this.invoiceDetails.items
          );
          this.endLoading();
        });
    });
    this.baseAPI = this.headersService.baseAPI + 'rc/';
    this.baseAPIPrint = this.headersService.baseAPI + 'print/';
    console.log(this.baseAPI);
    this.startLoading();
    this.coreService.getMethod('settings/actions').subscribe(data => {
      console.log(data);
      if (data['data'][0]) {
        this.receipt = data['data'][0].receipt;
        this.sms = data['data'][0].sms;
      }
      this.endLoading();
    });
  }

  print() {
    window.print();
  }

  applyAction(key) {
    this.startLoading();
    this.coreService
      .updateMethod('receipts/makeAction', {
        action: key,
        ids: [this.invoiceID]
      })
      .subscribe(
        data => {
          console.log(data);
          if (key == 'cancel') {
            this.showSuccess('تم الغاء الفاتورة');
          }
          if (key == 'confirm') {
            this.showSuccess('تم اعتماد الفاتورة');
          }
          this.endLoading();
          window.location.reload();
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

  ngOnInit() { }

  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
  }
  showErrors(errors) {
    this.endLoading();
    this.responseState = 'error';
    this.responseData = errors;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  showSuccess(text) {
    this.endLoading();
    this.responseState = 'success';
    this.responseData = text;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
}
