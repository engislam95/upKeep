import { Component, OnInit } from '@angular/core';
import { CoreService } from './../../../tools/shared-services/core.service';
import { LoaderService } from 'src/app/tools/shared-services/loader.service';

@Component({
  selector: 'app-receipts-managment',
  templateUrl: './receipts-managment.component.html',
  styleUrls: ['./receipts-managment.component.scss']
})
export class ReceiptsManagmentComponent implements OnInit {
  pageLoaded = false;
  receiptSystem: any = false;
  flage: boolean = false;

  constructor(
    private coreService: CoreService,
    private loaderService: LoaderService
  ) {}
  ngOnInit() {
    this.startLoading();
    this.coreService.getMethod('settings/actions').subscribe(val => {
      console.log(val);
      if (val['data'][0]) {
        this.receiptSystem = val['data'][0]['receipt'];
        if (this.receiptSystem == 0) {
          this.flage = true;
        } else if (this.receiptSystem == 1) {
          this.flage = false;
        }
      } else {
        this.flage = true;
      }

      this.endLoading();
    });
  }
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
}
