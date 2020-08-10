import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  startWith,
  map,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';
import { Observable, fromEvent } from 'rxjs';
import { CoreService } from './../../../tools/shared-services/core.service';
import { ResponseStateService } from './../../../tools/shared-services/response-state.service';
import { LoaderService } from './../../../tools/shared-services/loader.service';
import { fade } from './../../../tools/shared_animations/fade';
import { emptyValidator } from '../../../tools/shared_validators/Empty.validator';
import { ModalDirective } from 'ngx-bootstrap/modal';
import '@ckeditor/ckeditor5-build-classic/build/translations/ar';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-template-one',
  templateUrl: './template-one.component.html',
  styleUrls: ['./template-one.component.scss'],
  animations: fade
})
export class TemplateOneComponent implements OnInit {
  submitted: boolean = false;
  imagePlaceHolder1: any = '';
  imagePlaceHolder2: any = '';
  pageLoaded: boolean = false;
  responseState: any = '';
  responseData: any = '';
  color = '#661558';
  checkInovice: boolean = false;
  updatedData: any = '';
  updatedMode: boolean = false;
  showPopup: boolean = false;
  /* ---------------Editor --------------- */
  public Editor = ClassicEditor;
  public config = {
    language: 'ar'
  };
  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private router: Router
  ) {
    this.startLoading();
    this.coreService.getMethod('invoiceSetting/show').subscribe(data => {
      console.log(data['data']);
      this.endLoading();
      if (data['data']['receipts_count'] == 0) {
        this.checkInovice = true;
      }
      this.updatedData = data['data']['invoice_setting'][0];
      console.log(this.updatedData);
      if (this.updatedData) {
        this.updatedMode = true;
        this.companyForm.controls.name.setValue(this.updatedData.name);
        this.companyForm.controls.taxNumber.setValue(
          this.updatedData.tax_number
        );
        this.companyForm.controls.commerceNumber.setValue(
          this.updatedData.commercial_register
        );
        this.companyForm.controls.mobile.setValue(this.updatedData.phone);
        this.companyForm.controls.email.setValue(this.updatedData.email);
        this.companyForm.controls.website.setValue(this.updatedData.website);
        this.companyForm.controls.invoiceNumber.setValue(
          this.updatedData.start_invoice_number
        );
        this.companyForm.controls.invoiceImage.setValue(this.updatedData.logo);
        this.companyForm.controls.logo.setValue(
          this.updatedData.electronic_signature
        );
        this.color = this.updatedData.color;
        this.invoiceForm.controls.tax_number.setValue(this.updatedData.field1);
        this.invoiceForm.controls.commerceNumber.setValue(
          this.updatedData.field2
        );
        this.invoiceForm.controls.receipt.setValue(this.updatedData.field3);
        this.invoiceForm.controls.copy.setValue(this.updatedData.field4);
        this.invoiceForm.controls.inovice_number.setValue(
          this.updatedData.field5
        );
        this.invoiceForm.controls.date.setValue(this.updatedData.field6);
        this.invoiceForm.controls.clientName.setValue(this.updatedData.field7);
        this.invoiceForm.controls.clientPhone.setValue(this.updatedData.field8);
        this.invoiceForm.controls.name.setValue(this.updatedData.field9);
        this.invoiceForm.controls.numbers.setValue(this.updatedData.field10);
        this.invoiceForm.controls.price.setValue(this.updatedData.field11);
        this.invoiceForm.controls.notes.setValue(this.updatedData.field12);
        this.invoiceForm.controls.total.setValue(this.updatedData.field13);
        this.invoiceForm.controls.totalInR.setValue(this.updatedData.field14);
        this.invoiceForm.controls.sum.setValue(this.updatedData.field15);
        this.invoiceForm.controls.discount.setValue(this.updatedData.field16);
        this.invoiceForm.controls.end.setValue(this.updatedData.field17);
        this.invoiceForm.controls.description.setValue(
          this.updatedData.field18
        );
      }
    });
  }

  // tslint:disable-next-line: member-ordering
  companyForm = new FormGroup({
    name: new FormControl('', Validators.required),
    taxNumber: new FormControl('', Validators.required),
    commerceNumber: new FormControl('', Validators.required),
    mobile: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]* || [٠-٩]*'),
      Validators.minLength(9),
      Validators.maxLength(9)
    ]),
    email: new FormControl('', [
      Validators.email,
      Validators.required,
      Validators.pattern('^[a-zA-Z][a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}')
    ]),
    website: new FormControl('', Validators.required),
    invoiceNumber: new FormControl(
      { value: '', disabled: this.checkInovice },
      Validators.required
    ),
    invoiceImage: new FormControl('', Validators.required),
    logo: new FormControl('', Validators.required)
  });

  invoiceForm = new FormGroup({
    color: new FormControl(this.color),
    tax_number: new FormControl(''),
    inovice_number: new FormControl(''),
    commerceNumber: new FormControl(''),
    date: new FormControl(''),
    receipt: new FormControl(''),
    clientName: new FormControl(''),
    copy: new FormControl(''),
    clientPhone: new FormControl(''),
    name: new FormControl(''),
    total: new FormControl(''),
    price: new FormControl(''),
    numbers: new FormControl(''),
    totalInR: new FormControl(''),
    sum: new FormControl(''),
    notes: new FormControl(''),
    discount: new FormControl(''),
    description: new FormControl(''),
    end: new FormControl('')
  });
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    console.log(event);
    this.closePopup();
  }

  ngOnInit() {
    this.coreService
      .getMethod('invoiceSetting/CheckReceipts')
      .subscribe(data => {
        console.log(data);
        console.log(data['data']['receipts']);

        if (data['data']['receipts'] != 0) {
          this.companyForm.controls.invoiceNumber.disable();
          console.log(this.checkInovice);
        } else if (data['data']['receipts'] == 0) {
        }
      });
  }
  /* -------------------- Upload Image -------------------------- */
  onUploadImage1(e) {
    this.imagePlaceHolder1 = e[0].name;
    console.log(e[0].base64);
    this.companyForm.patchValue({
      invoiceImage: e[0].base64
    });
  }
  /* -------------------- Upload Image -------------------------- */
  onUploadImage2(e) {
    this.imagePlaceHolder2 = e[0].name;
    this.companyForm.patchValue({
      logo: e[0].base64
    });
  }
  sendCompany(form) {
    if (this.companyForm.controls.invoiceImage.value.split(':')[0] != 'data') {
      this.companyForm.controls.invoiceImage.setValue('');
    }
    if (this.companyForm.controls.logo.value.split(':')[0] != 'data') {
      this.companyForm.controls.logo.setValue('');
    }
    this.startLoading();
    // if(this.updatedMode == false) {
    this.coreService
      .postMethod('invoiceSetting/addCompanyInfo', {
        name: this.companyForm.controls.name.value,
        tax_number: this.companyForm.controls.taxNumber.value,
        phone: this.companyForm.controls.mobile.value,
        commercial_register: this.companyForm.controls.commerceNumber.value,
        website: this.companyForm.controls.website.value,
        email: this.companyForm.controls.email.value,
        start_invoice_number: this.companyForm.controls.invoiceNumber.value,
        logo: this.companyForm.controls.invoiceImage.value,
        electronic_signature: this.companyForm.controls.logo.value
      })
      .subscribe(
        data => {
          this.endLoading();
          console.log(data);
          this.showSuccess('تم التسجيل بنجاح');
          setTimeout(() => {
            this.router.navigateByUrl('/receipts-managment');
          }, 1000);
        },
        error => {
          if (error.error.errors) {
            this.showErrors(error.error.errors);
          } else {
            this.showErrors(error.error.message);
          }
        }
      );
    // }
    // else if (this.updatedMode == true) {
    //   this.coreService.updateMethod('invoiceSetting/addCompanyInfo', {
    //     name: this.companyForm.controls.name.value,
    //     tax_number: this.companyForm.controls.taxNumber.value,
    //     phone: this.companyForm.controls.mobile.value,
    //     commercial_register: this.companyForm.controls.commerceNumber.value,
    //     website: this.companyForm.controls.website.value,
    //     email: this.companyForm.controls.email.value,
    //     start_invoice_number: this.companyForm.controls.invoiceNumber.value,
    //     logo: this.companyForm.controls.invoiceImage.value,
    //     electronic_signature: this.companyForm.controls.logo.value,
    //   }).subscribe(data => {
    //     this.endLoading();
    //     console.log(data);
    //     this.showSuccess('تم التسجيل بنجاح');
    //   }, error => {
    //     if (error.error.errors) {
    //       this.showErrors(error.error.errors);
    //     } else {
    //       this.showErrors(error.error.message);
    //     }
    //   });
    // }
  }
  sendInvoice(form) {
    console.log(form);
    this.startLoading();
    this.coreService
      .postMethod('invoiceSetting/addInvoiceTexts', {
        color: this.color,
        field1: this.invoiceForm.controls.tax_number.value,
        field2: this.invoiceForm.controls.commerceNumber.value,
        field3: this.invoiceForm.controls.receipt.value,
        field4: this.invoiceForm.controls.copy.value,
        field5: this.invoiceForm.controls.inovice_number.value,
        field6: this.invoiceForm.controls.date.value,
        field7: this.invoiceForm.controls.clientName.value,
        field8: this.invoiceForm.controls.clientPhone.value,
        field9: this.invoiceForm.controls.name.value,
        field10: this.invoiceForm.controls.numbers.value,
        field11: this.invoiceForm.controls.price.value,
        field12: this.invoiceForm.controls.notes.value,
        field13: this.invoiceForm.controls.total.value,
        field14: this.invoiceForm.controls.totalInR.value,
        field15: this.invoiceForm.controls.sum.value,
        field16: this.invoiceForm.controls.discount.value,
        field17: this.invoiceForm.controls.end.value,
        field18: this.invoiceForm.controls.description.value
      })
      .subscribe(
        data => {
          console.log(data);
          this.endLoading();
          this.showSuccess('تم التسجيل بنجاح');
          this.router.navigateByUrl('/receipts-managment');
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
    this.submitted = false;
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
    this.submitted = false;
    this.responseState = 'success';
    this.responseData = successText;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  /* ------------------------ Open Delete Popup ---------------------- */
  openPopup() {
    this.showPopup = true;
  }
  /* ----------------------------- Close Popup --------------------------- */
  closePopup() {
    this.showPopup = false;
  }
}
