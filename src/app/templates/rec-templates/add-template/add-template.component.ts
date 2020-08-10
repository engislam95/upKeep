import { Component, OnInit, HostListener } from '@angular/core';
import { LoaderService } from 'src/app/tools/shared-services/loader.service';
import { ResponseStateService } from 'src/app/tools/shared-services/response-state.service';
import { CoreService } from 'src/app/tools/shared-services/core.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.scss']
})
export class AddTemplateComponent implements OnInit {
  print_model: any = '';
  pageLoaded = false;
  showPopup: boolean = false;
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    console.log(event);
    this.closePopup();
  }
  constructor(
    private coreService: CoreService,
    private loaderService: LoaderService,
    private router: Router
  ) {
    this.startLoading();
    this.coreService.getMethod('invoiceSetting/show', {}).subscribe(data => {
      this.endLoading();
      console.log(data['data']);
      if (data['data']['invoice_setting'].length) {
        this.print_model = data['data']['invoice_setting'][0].print_model;
      }
    });
  }

  ngOnInit() {}
  template(type) {
    this.startLoading();
    this.coreService
      .postMethod('invoiceSetting/setPrintModel', {
        print_model: type
      })
      .subscribe(data => {
        console.log(data);
        this.endLoading();
        this.router.navigateByUrl('/receipts-managment');
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
  openPopup() {
    this.showPopup = true;
  }
  /* ----------------------------- Close Popup --------------------------- */
  closePopup() {
    this.showPopup = false;
  }
}
