import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/tools/shared-services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'src/app/tools/shared-services/core.service';
@Component({
  selector: 'app-technical-details',
  templateUrl: './technical-details.component.html',
  styleUrls: ['./technical-details.component.scss']
})
export class TechnicalDetailsComponent implements OnInit {
  /* -------------------------- Variables -------------------------- */
  pageLoaded: boolean = false;
  tecniciansId: any = '';
  technicalDetails: any = '';
  technician_add: boolean = false;
  technician_all: boolean = false;
  technician_update: boolean = false;
  technician_delete: boolean = false;
  user: any = '';
  technicians: any = [];
  /* ----------------------- Constructor ------------------------ */
  constructor(
    private loaderService: LoaderService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log(this.user);
    this.technicians = this.user.modules.technicians;
    if (this.technicians) {
      this.technicians.map(ele => {
        switch (ele) {
          case 'add': this.technician_add = true;
            break;
          case 'all': this.technician_all = true;
            break;
          case 'update': this.technician_update = true;
            break;
          case 'delete': this.technician_delete = true;
            break;
        }
      });
    }
  }
  /* ----------------------- Oninit ------------------------- */
  ngOnInit() {
    this.startLoading();
    this.activatedRoute.queryParams.subscribe(params => {
      this.tecniciansId = params.tecniciansId;
      this.coreService
        .getMethod('technicians/' + this.tecniciansId, {})
        .subscribe((technicalDetails: any) => {
          console.log(technicalDetails.data);
          this.technicalDetails = technicalDetails.data;
          this.endLoading();
        });
    });
  }
  /* ---------------------- Start Loading ----------------------------- */
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  /* --------------------- End Loading --------------------------- */
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
  }
}
