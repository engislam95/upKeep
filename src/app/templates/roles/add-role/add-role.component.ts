import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { fade } from '../../../tools/shared_animations/fade';
import { LoaderService } from '../../../tools/shared-services/loader.service';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CoreService } from '../../../tools/shared-services/core.service';
@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
  animations: fade
})
export class AddTRoleComponent implements OnInit {
  /* ---------------------- Variables --------------------- */
  public Editor = ClassicEditor;
  public config = {
    language: 'ar'
  };
  modeTitle: any = 'إضافة ادوار جديدة';
  responseState: any = '';
  responseData: any = '';
  pageLoaded: boolean = false;
  submitted: boolean = false;
  updateMode: boolean = false;
  updatedRoleId: any = '';
  updatedRoleDataLoaded: boolean = false;
  updatedRoleData: any = '';
  /* ----------------------- Role Form ------------------------ */
  rolesForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('')
  });
  /* ---------------- Constructor ------------------------ */
  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  /* ----------------- Oninint -------------------- */
  ngOnInit() {
    /* ------------------ Scrolling --------------------- */
    window.scroll({ top: 0, behavior: 'auto' });
    /* ------------ Start Loading --------------------- */
    this.startLoading();
    /* ----------------- Update Mode --------------------- */
    this.activatedRoute.queryParams.subscribe(queryParams => {
      console.log(queryParams);

      if (queryParams.updateMode) {
        this.updateMode = queryParams.updateMode === 'true';
        this.updatedRoleId = +queryParams.updatedRoleID;
        // --------------------- Get Role Details -------------------- */
        if (this.updateMode) {
          this.getUpdatedRoleDetails();
        }
        this.modeTitle = 'تعديل الدور';
        // Get Order Details
      } else {
        // end loading in add technicians
        this.startLoading();
        this.updatedRoleDataLoaded = true;
        setTimeout(() => {
          this.endLoading();
        }, 1000);
      }
    });
  }
  /* ------------------------- Reset -------------------------- */
  xResetInputs(key) {
    if (key === 'name') {
      (document.getElementById('name') as HTMLInputElement).value = '';
      this.rolesForm.patchValue({ name: '' });
    }
    else {
      (document.getElementById(key) as HTMLInputElement).value = '';
      this.rolesForm.controls[key].patchValue('');
    }
  }
  /* ----------------------- Get Data -------------------------------- */
  getUpdatedRoleDetails() {
    this.coreService.getMethod('role/show/' + this.updatedRoleId, {}).subscribe((role: any) => {
      console.log(role);
      this.updatedRoleDataLoaded = true;
      this.updatedRoleData = role;
      this.rolesForm.controls.name.setValue(role.name);
      this.rolesForm.controls.description.setValue(role.description);
      /* -------------------- End Loading -------------------- */
      this.endLoading();
      /* --------------------- Assign Data ------------------------ */
      this.assignUpdatedData();
    });
  }
  /* -------------------------- Assign Update Data ---------------------- */
  assignUpdatedData() {
    const data = this.updatedRoleData;
    this.rolesForm.patchValue({
      name: data.name,
      active: data.active === 1 ? true : false
    });
  }
  /* --------------------- Update Role -------------------------- */
  onUpdate() {
    this.submitted = true;
    this.startLoading();
    this.coreService.updateMethod('role/update/' + this.updatedRoleId, this.rolesForm.value).subscribe(
      () => {
        this.showSuccess('تم تعديل الدور بنجاح');
        setTimeout(() => {
          this.router.navigate(['/roles/all-roles']);
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
  /* -------------------------- Create Role -------------------- */
  onSubmit() {
    this.submitted = true;
    this.startLoading();
    this.coreService.postMethod('role/create', this.rolesForm.value).subscribe(
      () => {
        this.showSuccess('تم تسجيل الدور بنجاح');
        setTimeout(() => {
          this.router.navigate(['/roles/all-roles']);
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
  /* ------------------ Start Loading -------------------- */
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  /* ------------------- End Loading -------------------- */
  endLoading() {
    if (this.updatedRoleDataLoaded) {
      this.pageLoaded = true;
      this.loaderService.endLoading();
    }
  }
  /* --------------------- Show Error Messages ---------------------- */
  showErrors(errors) {
    this.endLoading();
    this.submitted = false;
    this.responseState = 'error';
    this.responseData = errors;
    this.responseStateService.responseState(this.responseState, this.responseData);
  }
  /* --------------------- Show Success Messages ---------------------- */
  showSuccess(successText) {
    this.endLoading();
    this.submitted = false;
    this.responseState = 'success';
    this.responseData = successText;
    this.responseStateService.responseState(this.responseState, this.responseData);
  }
}
