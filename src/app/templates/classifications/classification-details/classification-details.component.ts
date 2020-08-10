import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from './../../../tools/shared-services/loader.service';
import { CoreService } from './../../../tools/shared-services/core.service';
import { fade } from './../../../tools/shared_animations/fade';
@Component({
  selector: 'app-classification-details',
  templateUrl: './classification-details.component.html',
  styleUrls: ['./classification-details.component.scss'],
  animations: [fade]
})
export class ClassificationDetailsComponent implements OnInit {
  /* -------------- Variables ---------------------- */
  pageLoaded: boolean = false;
  userID: any = '';
  userDetails: any = '';
  /* ------------------------ Constructor --------------------- */
  constructor(
    private loaderService: LoaderService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }
  /* ------------------ Oninit ----------------------- */
  ngOnInit() {
    /* --------------- Start Loading ----------------- */
    this.startLoading();
    /* ---------------- Get User Details ------------------------ */
    this.activatedRoute.queryParams.subscribe(params => {
      this.userID = params.userID;
      this.coreService
        .getMethod('users/' + this.userID, {})
        .subscribe((userDetails: any) => {
          this.userDetails = userDetails.data;
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
