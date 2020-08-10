import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/tools/shared-services/loader.service';
import { ResponseStateService } from 'src/app/tools/shared-services/response-state.service';
import { CoreService } from 'src/app/tools/shared-services/core.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PaginationService } from 'src/app/tools/shared-services/pagination.service';

@Component({
  selector: 'app-add-block',
  templateUrl: './add-block.component.html',
  styleUrls: ['./add-block.component.scss']
})
export class AddBlockComponent implements OnInit {

  mainService: any = [];
  subServices: any = [];
  services: any = [];
  mainServiceID: any = '';
  subServiceID: any = '';
  serviceID: any = '';
  updatedMode: boolean = false;
  pageLoaded: boolean = false;
  hideme: any = [];
  responseState: any = '';
  responseData: any = '';
  displayedColumns = [
    'ID',
    'tax_name',
    'tax_name_on_invoice',
    'value_tax',
    'details',
  ];
  dataSource: any = [];
  pagesNumbers: any = [];
  countPerPage: any = [];
  pageId: any = 1;
  firstPage: any;
  lastPage: any;
  per_page: any = 10;
  showDeletePopup: boolean = false;
  deletedUserName: any = '';
  deletedUserID: any = '';
  showOrdercontrolst: boolean = false;
  updatedID: any = '';
  clientName: any = '';

  taxForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    method: new FormControl(''),
    value: new FormControl(''),
    type: new FormControl(''),
  });

  techData: any = [];
  techIDs: any = [];
  allCheck: boolean = false;
  roleData: any = [];
  roleArrayIDs: any = [];

  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private paginationService: PaginationService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    /* ----------------------------- Update Mode --------------------------- */
    this.activatedRoute.queryParams.subscribe(queryParams => {
      console.log(queryParams);
      if (queryParams.updatedMode == 'true') {
        this.updatedMode = true;
        this.updatedID = +queryParams.companyId;
        this.clientName = queryParams.clientName;
        this.startLoading();
        this.coreService
          .getMethod('ClientInvoice/showAllowed/' + this.updatedID)
          .subscribe(company => {
            console.log(company);
            this.techData = company['data']['technician'];
            this.roleData = company['data']['roles'];
            console.log(this.roleData);
            this.endLoading();
            this.techData.map(ele => {
              return ele.check = false;
            })
            console.log(this.techData);
            for (let i = 0; i < this.techData.length; i++) {
              // console.log(this.techData[i]);
              for (let y = 0; y < this.techData[i]['receipt_client'].length; y++) {
                if (this.techData[i]['receipt_client'][y]['id'] == this.updatedID) {
                  {
                    this.techData[i].check = true;
                    this.techIDs.push(this.techData[i]['id']);
                  }
                }
              }
            }

            this.roleData.map(ele => {
              return ele.users.map(el => {
                return el.check = false;
              });
            })
            console.log(this.roleData);
            for (let i = 0; i < this.roleData.length; i++) {
              // console.log(this.techData[i]);
              for (let y = 0; y < this.roleData[i]['users'].length; y++) {
                for (let x = 0; x < this.roleData[i]['users'][y]['receipt_client'].length; x++) {
                  console.log(this.roleData[i]['users'][y]['receipt_client'][x]);

                  if (this.roleData[i]['users'][y]['receipt_client'][x]['id'] == this.updatedID) {
                    {
                      this.roleData[i]['users'][y].check = true;
                      this.roleArrayIDs.push(this.roleData[i]['users'][y]['id']);
                    }
                  }
                }
              }
            }
          })
      }
    })
  }

  checkAllValues(event) {
    this.techIDs = [];
    if (event.checked == true) {
      console.log(this.techData);
      this.techData.map(ele => {
        this.techIDs.push(ele['id'])
        return ele.check = true;
      })
    }
    else if (event.checked == false) {
      this.techData.map(ele => {
        return ele.check = false;
      })
    }
  }

  getCheckValue(event) {
    if (event.checked == true && this.techIDs.indexOf(event.source.value) === -1) {
      this.techIDs.push(event.source.value);
    }
    else if (event.checked == false && this.techIDs.indexOf(event.source.value) != -1) {
      this.techIDs.splice(this.techIDs.indexOf(event.source.value), 1);
    };
  }

  getRoleCheckValue(event, i) {
    if (event.checked == true && this.roleArrayIDs.indexOf(event.source.value) === -1) {
      // this.techIDs.push(event.source.value);
      this.roleArrayIDs.push(event.source.value);
    }
    else if (event.checked == false && this.roleArrayIDs.indexOf(event.source.value) != -1) {
      // this.techIDs.splice(this.techIDs.indexOf(event.source.value), 1);
      this.roleArrayIDs.splice(this.roleArrayIDs.indexOf(event.source.value), 1);
    };
  }

  addBlock() {
    let arr = this.techIDs.concat(this.roleArrayIDs);
    console.log(arr);
    this.startLoading();
    this.coreService.postMethod('ClientInvoice/allow/' + this.updatedID, {
      users: arr
    }).subscribe(data => {
      console.log(data);
      this.showSuccess('تم تسجيل الحظر بنجاح');
      this.router.navigateByUrl('/receipts-managment/all-blocks');
      this.endLoading();
    },
      error => {
        if (error.error.errors) {
          this.showErrors(error.error.errors);
        } else {
          this.showErrors(error.error.message);
        }
      })
  }

  ngOnInit() {
  }
  /* -------------------------- Start Loading --------------------- */
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  /* -------------------------- End Loading --------------------- */
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
  }
  /* ----------------------------- Show Error Messages --------------------- */
  showErrors(errors) {
    this.endLoading();
    this.responseState = 'error';
    this.responseData = errors;
    this.responseStateService.responseState(this.responseState, this.responseData);
  }
  /* ----------------------------- Show Success Messages --------------------- */
  showSuccess(successText) {
    this.endLoading();
    this.responseState = 'success';
    this.responseData = successText;
    this.responseStateService.responseState(this.responseState, this.responseData);
  }
  /* ------------------------ Open Delete Popup ---------------------- */
  openDeletePopup(id, name) {
    this.deletedUserName = name;
    this.deletedUserID = id;
    this.showDeletePopup = true;
  }
}
