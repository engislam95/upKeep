import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/tools/shared-services/loader.service';
import { ResponseStateService } from 'src/app/tools/shared-services/response-state.service';
import { CoreService } from 'src/app/tools/shared-services/core.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PaginationService } from 'src/app/tools/shared-services/pagination.service';

@Component({
  selector: 'app-invoice-settings',
  templateUrl: './invoice-settings.component.html',
  styleUrls: ['./invoice-settings.component.scss']
})
export class InvoiceSettingsComponent implements OnInit {
  pageLoaded: boolean = false;
  responseState: any = '';
  responseData: any = '';
  updatedID: any = '';
  receipt: any = 0;
  sms: any = 0;

  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private paginationService: PaginationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    /* ----------------------------- Update Mode --------------------------- */
    this.startLoading();
    this.coreService.getMethod('CompanySetting/show').subscribe(data => {
      console.log(data);
      if (data['data'][0]) {
        this.receipt = data['data'][0].receipt;
        this.sms = data['data'][0].sms;
      }
      this.endLoading();
    });
  }

  invoiceActive(event) {
    console.log(event);
    if (event.checked == true) {
      this.receipt = 1;
    } else if (event.checked == false) {
      this.receipt = 0;
    }
  }
  smsActive(event) {
    console.log(event);
    if (event.checked == true) {
      this.sms = 1;
    } else if (event.checked == false) {
      this.sms = 0;
    }
  }
  saveModel() {
    this.startLoading();
    this.coreService
      .postMethod('CompanySetting/add', {
        receipt: this.receipt,
        sms: this.sms
      })
      .subscribe(
        data => {
          console.log(data);
          this.showSuccess('تم حفظ الاعدادات بنجاح');
          setTimeout(() => {
            this.router.navigateByUrl('/receipts-managment');
          }, 1000);
          this.endLoading();
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

  ngOnInit() {}
  /* -------------------------- Start Loading --------------------- */
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  /* -------------------------- End Loading --------------------- */
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
  }
  /* ----------------------------- Show Error Messages --------------------- */
  showErrors(errors) {
    this.endLoading();
    this.responseState = 'error';
    this.responseData = errors;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  /* ----------------------------- Show Success Messages --------------------- */
  showSuccess(successText) {
    this.endLoading();
    this.responseState = 'success';
    this.responseData = successText;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
}
