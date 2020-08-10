import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/tools/shared-services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'src/app/tools/shared-services/core.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss']
})
export class RoleDetailsComponent implements OnInit {
  /* ------------------ Variables ----------------------- */
  pageLoaded: boolean = false;
  roleID: any = '';
  roleDetails: any = '';
  description: any = '';
  public Editor = ClassicEditor;
  public config = {
    language: 'ar'
  };
  /* ---------------------- Constructor ------------------- */
  constructor(
    private loaderService: LoaderService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.startLoading();
    this.activatedRoute.queryParams.subscribe(params => {
      this.roleID = params.roleID;
      this.coreService
        .getMethod('role/show/' + this.roleID, {})
        .subscribe((roleDetails: any) => {
          console.log(roleDetails);
          this.roleDetails = roleDetails;
          this.description = roleDetails.description;
          console.log(this.description);

          this.endLoading();
        });
    });
  }
  /* --------------------- Oninit ------------------------ */
  ngOnInit() {

  }
  /* ---------------- Start Loading -------------------- */
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  /* -------------------- End Loading ------------------------- */
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
  }
}
