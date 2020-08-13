import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/tools/shared-services/loader.service';
import { CoreService } from 'src/app/tools/shared-services/core.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss']
})
export class OfferDetailsComponent implements OnInit {
  pageLoaded = false;
  offerId;
  offerDetails;

  offers: any = [];
  offer_add: boolean = false;
  offer_all: boolean = false;
  offer_update: boolean = false;
  offer_delete: boolean = false;
  user: any = '';

  constructor(
    private loaderService: LoaderService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute
  ) {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log(this.user);
    this.offers = this.user.modules.offers;
    if (this.offers) {
      this.offers.map(ele => {
        switch (ele) {
          case 'create': this.offer_add = true;
            break;
          case 'all': this.offer_all = true;
            break;
          case 'update': this.offer_update = true;
            break;
          case 'delete': this.offer_delete = true;
            break;
        }
      });
    }
  }

  ngOnInit() {
    // start loading
    this.startLoading();
    // End Loading
    this.activatedRoute.queryParams.subscribe(params => {
      this.offerId = params.offerId;
      this.coreService
        .getMethod('offers/' + this.offerId, {})
        .subscribe((offerDetails: any) => {
          this.offerDetails = offerDetails.data;
          // Start END Loading
          this.endLoading();
          // End END Loading
        });
    });
  }
  //
  // ─── START LOADING FUNCTION ─────────────────────────────────────────────────────
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
  // ────────────────────────────────────────────────────────────── END LOADING ─────
  //
}
