import { Component, OnInit, TemplateRef } from '@angular/core';
import { LoaderService } from 'src/app/tools/shared-services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'src/app/tools/shared-services/core.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';

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
  max: number = 6;
  rate: number = 4;
  isReadonly: boolean = true;
  modalRef: BsModalRef;
  responseState;
  responseData;

  /* ----------------------- Constructor ------------------------ */
  constructor(
    private loaderService: LoaderService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router ,
    private modalService: BsModalService , 
    private responseStateService: ResponseStateService,
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.user);
    this.technicians = this.user.modules.technicians;
    if (this.technicians) {
      this.technicians.map(ele => {
        switch (ele) {
          case 'add':
            this.technician_add = true;
            break;
          case 'all':
            this.technician_all = true;
            break;
          case 'update':
            this.technician_update = true;
            break;
          case 'delete':
            this.technician_delete = true;
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
      this.getTechnicalData() ;

      // this.coreService
      //   .getMethod('technicians/' + this.tecniciansId, {})
      //   .subscribe((technicalDetails: any) => {
      //     console.log(technicalDetails.data);
      //     this.technicalDetails = technicalDetails.data;
      //     this.endLoading();
      //   });
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

  copyURL(text) {
    console.log(text);
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.showSuccess('تم النسخ');
  }

  
  openModalImage() {
            // Get the modal
          var modal = document.getElementById("imageTechModel");

          console.log(modal)

          // Get the image and insert it inside the modal - use its "alt" text as a caption
          var img = document.getElementById("imageTech");
       
            modal.style.display = "block";
            
          

          // Get the <span> element that closes the modal
          var span = document.getElementsByClassName("close")[0];

          // When the user clicks on <span> (x), close the modal
        
  }

  closeImageTech()
  {
   
    console.log( document.getElementById("imageTechModel"));
    
    document.getElementById("imageTechModel").style.display = "none";
  }

  
  openModalPin() {
      // Get the modal
      var modal = document.getElementById("imageTechPinModel");
       modal.style.display = "block";
        
  }

  getTechnicalData()
  {

    this.coreService
        .getMethod('technicians/' + this.tecniciansId, {})
        .subscribe((technicalDetails: any) => {
          console.log(technicalDetails.data);
          this.technicalDetails = technicalDetails.data;
          this.endLoading();
        });

  }

  closeImagePin()
  {
    document.getElementById("imageTechPinModel").style.display = "none";
  }

  stopTechnical()
  {
    this.coreService
    .updateMethod('technicians/' + this.tecniciansId + '/toggle-active' , {
      active : 0
    })
    .subscribe((technicalDetails: any) => {
      console.log(technicalDetails.data);
      this.showSuccess('تم تشغيل حساب  الفنى   ');
      this.getTechnicalData() ;

      this.endLoading();
    });
  }

  activateTechnical()
  {
    this.coreService
    .updateMethod('technicians/' + this.tecniciansId + '/toggle-active' , {
      active : 1
    })
    .subscribe((technicalDetails: any) => {
      console.log(technicalDetails.data);
       this.showSuccess('تم  إيقاف حساب  الفنى   ');
      this.getTechnicalData() ;

      this.endLoading();
    });
  }


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


