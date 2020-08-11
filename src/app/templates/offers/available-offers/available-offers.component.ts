import { OnInit, Component } from '@angular/core';
import { CoreService } from './../../../tools/shared-services/core.service';
import { ResponseStateService } from './../../../tools/shared-services/response-state.service';
import { LoaderService } from './../../../tools/shared-services/loader.service';
import { PaginationService } from './../../../tools/shared-services/pagination.service';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-available-offers',
  templateUrl: './available-offers.component.html',
  styleUrls: ['./available-offers.component.scss']
})
export class AvailableOffersComponent implements OnInit {
  getOffersResponseTotal;
  // Start General Data
  pageLoaded = false;
  responseState;
  responseData;
  //
  deletedOfferName: string;
  deletedOfferId: number;
  showDeletePopup = false;
  //
  updatedOfferName: string;
  updatedOfferId: number;
  showUpdatePopup = false;
  //  Filter Data
  filteredOffersData = '';
  //  Filter Data

  //   End General Data
  filterForm = new FormGroup({
    filterName: new FormControl()
  });
  //  Start Table Data
  displayedColumns = [
    //
    'id',
    'name',
    'sourceName',
    'serviceName',
    'status',
    // 'email',
    // 'offer_details'
    // "delete_order"
  ];
  offersArray = [];
  pagesNumbers = [];
  pageId = 1; // number
  firstPage; // any
  lastPage;

  offers: any = [];
  offer_add: boolean = false;
  offer_all: boolean = false;
  offer_update: boolean = false;
  offer_delete: boolean = false;
  user: any = '';

  // End Table Data
  constructor(
    //
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private paginationService: PaginationService
  ) {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log(this.user);
    this.offers = this.user.modules.offers;
    if (this.offers) {
      this.offers.map(ele => {
        switch (ele) {
          case 'create': this.offer_add = true;
            break;
          case 'show': this.offer_all = true;
            break;
          case 'update': this.offer_update = true;
            break;
          case 'delete': this.offer_delete = true;
            break;
        }
      });
    }
    if (this.user.privilege == 'super-admin' || this.offer_all) {
      console.log(this.displayedColumns)
      this.displayedColumns[5] = 'offer_details';
    }
    if (this.user.privilege == 'super-admin' || this.offer_update) {
      console.log(this.displayedColumns)
      this.displayedColumns[6] = 'edit_order';
    }
  }

  //
  // ─── START ONINIT ────────────────────────────────────────────────
  //

  ngOnInit() {
    // Start START Loading
    this.startLoading();
    // End START Loading
    // Start Get All Resources
    this.getAllOffers(this.pageId);
    // End Get All Resources

    //
    // ─── START FILTERS ───────────────────────────────────────────────
    //

    // Filter Name
    const filterName = document.getElementById('filterName');
    const filterNameListner = fromEvent(filterName, 'keyup');
    filterNameListner
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        this.pageId = 1;
        this.filteredOffersData = value;
        this.getAllOffers(this.pageId);
      });
    // Filter Name
    //
    // ─────────────────────────────────────────────── END FILTERS ─────
    //
  }

  //
  // ──────────────────────────────────────────────── END ONINIT ─────
  //

  //
  // ─── START X RESET INPUTS ────────────────────────────────────────
  //

  xResetInputs(key) {
    if (key === 'filterName') {
      this.filterForm.patchValue({
        filteredOffersData: '',
        filterName: ''
      });
      this.filteredOffersData = '';
    }

    this.getAllOffers(this.pageId);
  }

  //
  // ──────────────────────────────────────── END X RESET INPUTS ─────
  //

  //
  // ─── START GET ALL OFFERS ────────────────────────────────────────
  //

  getAllOffers(pageId) {
    this.loaderService.startLoading();
    this.coreService
      .getMethod('offers?page=' + pageId, {
        name: this.filteredOffersData
      })
      .subscribe((getOffersResponse: any) => {
        // Start Assign Data
        this.getOffersResponseTotal = getOffersResponse.data.data;
        this.offersArray = getOffersResponse.data.data.filter(offer => {
          return offer.active === 1;
        });

        if (this.offersArray.length === 0 && this.pageId > 1) {
          // last page
          this.pageId -= 1;
          this.pagesNumbers.splice(-1);
          this.goPage(this.pageId);
        }
        // Start Assign Data
        // Start END Loading
        this.endLoading();
        // End END Loading
        //  Start Pagination Count
        this.pagination(
          getOffersResponse.data.total,
          getOffersResponse.data.per_page
        );
        //  End Pagination Count
      });
  }

  //
  // ──────────────────────────────────────── END GET ALL OFFERS ─────
  //

  //
  // ─── START PAGINATION ────────────────────────────────────────────
  //

  pagination(totalOffersNumber, OffersPerPAge) {
    this.pagesNumbers = [];
    const totalPages = Math.ceil(totalOffersNumber / OffersPerPAge);
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      this.pagesNumbers.push(pageNumber);
    }
    this.checkPagination(this.pageId);
  }
  //
  // ──────────────────────────────────────────── END PAGINATION ─────
  //

  //
  // ─── START GO PAGE ───────────────────────────────────────────────
  //

  goPage(i) {
    if (i >= 1 && i <= this.pagesNumbers.length) {
      this.pageId = i;
      this.checkPagination(i);
      // Start START Loading
      this.loaderService.startLoading();
      // End START Loading
      this.getAllOffers(this.pageId);
    }
  }
  //
  // ─────────────────────────────────────────────── END GO PAGE ─────
  //

  //
  // ─── START CHECK FOR PAGINATION BUTTONS ──────────────────────────
  //

  checkPagination(pageId) {
    const [firstPage, lastPage] = this.paginationService.checkPaginationButtons(
      pageId,
      this.pagesNumbers.length
    );
    this.firstPage = firstPage;
    this.lastPage = lastPage;
  }

  //
  // ────────────────────────── END CHECK FOR PAGINATION BUTTONS ─────
  //

  //
  // ─── START DELETE OFFER ──────────────────────────────────────────
  //

  openDeletePopup(id, name) {
    this.deletedOfferName = name;
    this.deletedOfferId = id;
    this.showDeletePopup = true;
  }
  deleteOffer() {
    this.closePopup();
    this.startLoading();
    this.coreService.deleteMethod('offers/' + this.deletedOfferId).subscribe(
      () => {
        this.showSuccess();
        this.getAllOffers(this.pageId);
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
  // ────────────────────────────────────────── END DELETE OFFER ─────
  //

  //
  // ─── START UPDATE OFFER ──────────────────────────────────────────
  //

  openUpdatePopup(id, name) {
    this.deletedOfferName = name;
    this.deletedOfferId = id;
    this.showDeletePopup = true;
  }

  //
  // ────────────────────────────────────────── END UPDATE OFFER ─────
  //

  //
  // ─── START CHECK FOR DATA EXISTANCE ──────────────────────────────
  //

  dataExistance() { }

  //
  // ────────────────────────────── END CHECK FOR DATA EXISTANCE ─────
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
    window.scroll({ top: 0, behavior: 'smooth' });
    this.endLoading();
    this.responseState = 'error';
    this.responseData = errors;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  showSuccess() {
    window.scroll({ top: 0, behavior: 'smooth' });
    this.endLoading();
    this.responseState = 'success';
    this.responseData = 'تم حذف العرض بنجاح';
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }

  //
  // ───────────────────────────────────── END RESPONSE MESSEGES ─────
  //
}
