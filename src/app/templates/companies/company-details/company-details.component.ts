import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from './../../../tools/shared-services/loader.service';
import { CoreService } from './../../../tools/shared-services/core.service';
import { fade } from './../../../tools/shared_animations/fade';
@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss'],
  animations: [fade]
})
export class CompanyDetailsComponent implements OnInit {
  /* -------------- Variables ---------------------- */
  pageLoaded: boolean = false;
  companyId: any = '';
  company: any = '';
  user: any = '';
  superAdmin: any = '';
  /* ------------------------ Constructor --------------------- */
  constructor(
    private loaderService: LoaderService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
  }
  /* ------------------ Oninit ----------------------- */
  ngOnInit() {
    /* --------------- Start Loading ----------------- */
    this.startLoading();
    /* ---------------- Get User Details ------------------------ */
    this.activatedRoute.queryParams.subscribe(params => {
      this.companyId = params.companyId;
      this.coreService
        .superGet('owner/company/show/' + this.companyId, {})
        .subscribe((company: any) => {
          console.log(company);
          this.company = company;
          this.superAdmin = company.super_admin[0];
          /* --------------- End Loading ----------------- */
          this.endLoading();
        });
    });
  }
  /* --------------- Start Loading ----------------- */
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  /* --------------- End Loading ----------------- */
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
  }
}
