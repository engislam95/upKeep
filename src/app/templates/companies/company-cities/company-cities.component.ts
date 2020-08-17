import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from './../../../tools/shared-services/loader.service';
import { CoreService } from './../../../tools/shared-services/core.service';
import { fade } from './../../../tools/shared_animations/fade';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';

import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
// import { Console } from 'console';
import { tick } from '@angular/core/src/render3';
@Component({
  selector: 'app-company-cities',
  templateUrl: './company-cities.component.html',
  styleUrls: ['./company-cities.component.scss'],
  animations: [fade]
})
export class CompanyCitiesComponent implements OnInit {
  /* -------------- Variables ---------------------- */
  pageLoaded: boolean = false;
  companyId: any = '';
  company: any = '';
  user: any = '';
  ClassiciationFilteredOptions: Observable<any>;
  classificationArray: any = [];
  filterServiceID: any = '';
  services: any = [];
  className: any = 'المملكة العربية السعودية';
  classID: any = '';
  IDsArray: any = [];
  responseState: any = '';
  responseData: any = '';
  passed = false;
  companySlug = JSON.parse(localStorage.getItem('currentUser')).companySlug;

  /*--------------- Form -------------------- */
  companyForm = new FormGroup({
    usedService: new FormControl()
  });
  /* ------------------------ Constructor --------------------- */
  constructor(
    private loaderService: LoaderService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private responseStateService: ResponseStateService
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
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

          // if (company['classification']) {
          //   this.className = company['classification'].name;
          //   this.classID = company['classification'].id;
          // }
        });

        this.coreService
        .superGet('company/' + this.companySlug + '/countries/' + '191' + '/cities/' + this.companyId)
        .subscribe(data => {
          console.log(data);
          this.services = data['data'];
          this.services.map(ele => {
            if (ele.checked == true) {
              this.IDsArray.push(ele.id);
              console.log(this.IDsArray);
            }
          });
        });

      /* --------------------- Get Classifications ------------------------- */
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      let companySlug = currentUser.company_slug;

      this.coreService
        .superGet('company/' + companySlug + '/countries')
        .subscribe(classification => {
          console.log(classification);
          this.classificationArray = classification['data'];
          this.className = this.classificationArray[0].name;
          this.classID = this.classificationArray[0].id;
          this.ClassiciationFilteredOptions = this.companyForm
            .get('usedService')
            .valueChanges.pipe(
              startWith(''),
              map(value => this.filterService(value))
            );
        });
    });
    this.endLoading();
  }
  /* ------------------------ Display Option ----------------------------- */
  displayOptionsFunction(state) {
    if (state !== null) {
      return state.name;
    }
  }
  /* -------------------- Reset ---------------------- */
  xResetInputs(key) {
    (document.getElementById(key) as HTMLInputElement).value = '';
    this.companyForm.controls[key].patchValue('');
  }
  /*----------------------- Service Filter ----------------------- */
  filterService(value: any) {
    console.log(value);
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let companySlug = currentUser.company_slug;

    if (typeof value === 'object') {
      this.filterServiceID = value.id;
      this.classID = value.id;
      console.log(value.id);
      this.className = value.name;
      this.coreService
        .superGet('company/' + companySlug + '/countries/' + '191' + '/cities/' + this.companyId)
        .subscribe(data => {
          console.log(data);
          this.services = data['data'];
          this.services.map(ele => {
            if (ele.checked == true) {
              this.IDsArray.push(ele.id);
              console.log(this.IDsArray);
            }
          });
        });
    }
    if (value === '') {
      this.filterServiceID = '';
    }
    return this.classificationArray.filter(option =>
      option.name.includes(value)
    );
  }
  /* -------------------- Check All ---------------------- */
  checkAll(event) {
    console.log(event);
    this.services.map(ele => {
      if (event.checked == true) {
        return (ele.checked = true);
      } else if (event.checked == false) {
        return (ele.checked = false);
      }
    });
    this.services.map(ele => {
      if (event.checked == true && this.IDsArray.indexOf(ele.id) === -1) {
        return this.IDsArray.push(ele.id);
      } else if (
        event.checked == false &&
        this.IDsArray.indexOf(ele.id) != -1
      ) {
        this.IDsArray.splice(this.IDsArray.indexOf(ele.id), 1);
      }
    });
    console.log(this.services);
    console.log(this.IDsArray);
  }

  /* --------------------- Check Item ----------------------- */
  checkItem(event, service, i) {
    // if(service.checked == true || event.checked == true)
    // {
    //   this.passed = true
    // }
    // else
    // {
    //   this.passed = false

    // }

    console.log(this.services);

    console.log(event.source.value);

    if (event.checked == true && this.IDsArray.indexOf(service.id) === -1) {
      this.IDsArray.push(service.id);
    } else if (
      event.checked == false &&
      this.IDsArray.indexOf(service.id) != -1
    ) {
      this.IDsArray.splice(this.IDsArray.indexOf(service.id), 1);
    }
    console.log(this.IDsArray);
  }
  /* ------------------ Assign Services -------------------------- */
  assignServices() {
    this.startLoading();
    this.coreService
      .superPost('owner/location/create', {
        company_id: this.company.id,
        cities: this.IDsArray
      })
      .subscribe(
        () => {
          this.showSuccess('تم اضافة المواقع الى الشركة بنجاح');
          setTimeout(() => {
            this.router.navigate(['/companies/all-companies']);
          }, 2500);
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
