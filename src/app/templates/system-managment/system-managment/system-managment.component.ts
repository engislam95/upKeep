import { Component, OnInit } from '@angular/core';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';
import { LoaderService } from '../../../tools/shared-services/loader.service';
import { CoreService } from '../../../tools/shared-services/core.service';

@Component({
  selector: 'app-system-managment',
  templateUrl: './system-managment.component.html',
  styleUrls: ['./system-managment.component.scss'],

})
export class SystemManagmentComponent implements OnInit {
  /* ----------------- Variables --------------------------- */
  showSideMenu: boolean = false;
  overLayShow: boolean = false;
  windowWidth = window.innerWidth;
  responseState: any = '';
  responseData: any = '';
  user: any = '';
  pageLoaded: boolean = false;

  /* ----------------------- Constructor ------------------------ */
    
   
    constructor( private responseStateService: ResponseStateService ,private loaderService: LoaderService,  private coreService: CoreService,  )  {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }
  /* --------------------- Oninit ------------------------------- */
  ngOnInit() {
    
    if (this.windowWidth > 991) {
      this.showSideMenu = true;
    } else {
      this.showSideMenu = false;
    }

  }

  systemOFF()
  {
    

    this.coreService.superPost('owner/setting/active', { "active" : 0 } ).subscribe(
      (res) => {
        this.showSuccess("system turned off")
       console.log(res);
      
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

  systemON()
  {
    

    this.coreService.superPost('owner/setting/active', { "active" : 1 } ).subscribe(
      (res) => {
        
        this.showSuccess("system turned on")
        console.log(res);
      
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

    /* ------------------------ Show Success Message ------------------------- */
    showSuccess(successText) {
       this.endLoading();
      this.responseState = 'success';
      this.responseData = successText;
      this.responseStateService.responseState(
        this.responseState,
        this.responseData
      );
    }

      /* ---------------------- Show Error Message ------------------------- */
  showErrors(errors) {
    this.endLoading();
    this.responseState = 'error';
    this.responseData = errors;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }

    endLoading() {
     
        this.pageLoaded = true;
        this.loaderService.endLoading();
      }
    
  


}
