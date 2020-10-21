import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
import { MatTableDataSource } from '@angular/material';
import '@ckeditor/ckeditor5-build-classic/build/translations/ar';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-client-invoice',
  templateUrl: './client-invoice.component.html',
  styleUrls: ['./client-invoice.component.scss'],
  animations: fade
})
export class ClientInvoiceComponent implements OnInit {
  pageLoaded = false;
  orderDetailsLoaded = false;
  orderItemTypesLoaded = false;
  taxesLoaded = false;
  responseState;
  responseData;
  orderDetails;
  orderId;
  orderItemName = '';
  orderItemPrice: any = '';
  orderItemTypeId: any;
  orderItemTypeName: any = '';
  orderItemDetails = '';
  addOrderItemActive = false;
  invoiceItems = [];
  totalPrice = 0;
  totalTaxes = 0;
  priceWithTaxes;
  taxesArray;
  number: any = '';
  showNote = false;
  orderItemTypesArray = [];
  orderItemTypesFilteredOptions: Observable<any>;
  clientsArray = [];
  clientsFilteredOptions: Observable<any>;
  ModelsFilteredOptions: Observable<any>;
  clientsArrayLoaded = false;
  viewClientDetails = false;
  selectClient = false;
  clientObject: any = '';
  clientInvoiceForm = new FormGroup({
    orderItemDetails: new FormControl(''),
    clientIdObj: new FormControl('', [emptyValidator, Validators.required]),
    clientName: new FormControl('', Validators.required),
    items: new FormControl([]),
    receipt_type: new FormControl('client_receipt'),
    orderItemTypesObj: new FormControl(''),
    model: new FormControl(''),
    date: new FormControl(new Date().toLocaleDateString("en-US")),
    discount: new FormControl(''),
    receipt_object_id: new FormControl('', Validators.required)
  });
  submitted = false;
  date = new Date().toLocaleDateString("en-US");
  total: any = '';
  index = '';
  updateMode = false;
  updatedMode = false;
  modelArray: any = [];
  modelID;
  modelName: any = '';
  flageUpdatedItems = false;
  displayedColumns: string[] = [
    'id',
    'Item_type',
    // 'Item_details',
    'the_number',
    'unit_price',
    'notes',
    'total',
    'details_invoice'
  ];
  dataSource: any = [];
  accept: any = false;
  discount: any = 0;
  invoiceID = '';
  updatedInvoice: any = '';
  newTax = false;
  taxSum: any = 0;
  taxArr = [];
  newModel = false;
  /* ---------------Editor --------------- */
  public Editor = ClassicEditor;
  public config = {
    language: 'ar'
  };

  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    let formatDate = new Date().toLocaleString('en-GB', {
      timeZone: 'Asia/Riyadh',
      timeZoneName: 'short'
    }).split(',')[0]
      .split('/')
      .reverse()
      .join('/');
    this.orderDateChanged(formatDate, 'init');
    setTimeout(() => {
      const orderDateSplit = formatDate.split('/');
      const OrderDateAfterSwap =
        orderDateSplit[1] + '/' + orderDateSplit[2] + '/' + orderDateSplit[0];
      (document.getElementById(
        'inoviceDate'
      ) as HTMLInputElement).value = OrderDateAfterSwap;
    }, 100);
    // let dateArr = formatDate[2] + '/' + formatDate[0] + '/' + formatDate[1];
    // this.date = dateArr;
    // this.clientInvoiceForm.controls.date.setValue(dateArr);
    this.route.queryParams.subscribe(data => {
      console.log(data);
      if (data.updatedMode == 'true') {
        this.updatedMode = true;

        this.invoiceID = data.incoiveID;
        this.startLoading();
        this.coreService
          .getMethod('receipts/' + this.invoiceID)
          .subscribe(rec => {
            this.endLoading();
            console.log(rec['data'][0]);
            this.updatedInvoice = rec['data'][0];
            this.clientInvoiceForm.controls.receipt_object_id.setValue(
              this.updatedInvoice.client_id
            );
            this.clientInvoiceForm.controls.clientIdObj.setValue(
              this.updatedInvoice.client_id
            );
            // this.clientInvoiceForm.controls.clientIdObj.status = 'VALID';
            this.clientInvoiceForm.controls.clientName.setValue(
              this.updatedInvoice.client_name
            );
            this.clientInvoiceForm.controls.date.setValue(
              this.updatedInvoice.datecreated_at
            );
            this.clientInvoiceForm.controls.discount.setValue(
              this.updatedInvoice.discount
            );
            this.discount = this.updatedInvoice.discount;
            this.totalPrice = this.updatedInvoice.totalItems;
            this.date = this.updatedInvoice.datecreated_at;
            for (let i = 0; i < this.updatedInvoice.items.length; i++) {
              this.invoiceItems.push({
                name: this.updatedInvoice.items[i].name,
                item_price: this.updatedInvoice.items[i].item_price,
                type: this.updatedInvoice.items[i].item_type.id,
                typeName: this.updatedInvoice.items[i].item_type.name,
                number: this.updatedInvoice.items[i].count,
                description: this.updatedInvoice.items[i].description,
                price: this.updatedInvoice.items[i].price
              });
            }
            console.log(this.invoiceItems);
            this.dataSource = new MatTableDataSource(this.invoiceItems);
            this.taxesArray = this.updatedInvoice.tax_details;
            this.taxArr = this.updatedInvoice.tax_details;
            this.totalTaxes = 0;
            this.taxSum = 0;
            for (let i = 0; i < this.taxesArray.length; i++) {
              if (this.taxesArray[i].method === 'percent') {
                this.taxSum +=
                  (+this.totalPrice * +this.taxesArray[i].value) / 100;
                this.totalTaxes +=
                  (this.totalPrice - this.discount) *
                  (+this.taxesArray[i].value / 100) +
                  this.totalPrice -
                  this.discount;
                console.log(this.totalTaxes);
              } else if (this.taxesArray[i].method === 'value') {
                console.log(this.taxesArray[i].value);

                this.taxSum += +this.taxesArray[i].value;
                this.totalTaxes +=
                  this.totalPrice - this.discount + this.taxesArray[i].value;
                console.log(this.totalTaxes);
              }
            }
            this.priceWithTaxes = Math.ceil(this.updatedInvoice.total);
            this.accept = true;
          });
      }
    });
  }

  showModel(event) {
    if (event == true) {
      this.newModel = true;
    }
    else if (event == false) {
      this.newModel = false;
    }
  }

  modelNameValue(event) {
    console.log(event.target.value);
    this.modelName = event.target.value;
  }

  updateInvo() {
    this.startLoading();
    this.coreService
      .updateMethod('receipts/update/' + this.invoiceID, {
        client_id: this.clientInvoiceForm.controls.receipt_object_id.value,
        receipt_object_id: this.clientInvoiceForm.controls.receipt_object_id
          .value,
        receipt_type: 'client_receipt',
        client_name: this.clientInvoiceForm.controls.clientName.value,
        date: this.date,
        items: this.invoiceItems,
        taxes: this.taxesArray,
        discount: this.clientInvoiceForm.controls.discount.value,
        total: this.priceWithTaxes,
        new_taxes: this.newTax
      })
      .subscribe(
        () => {
          this.showSuccess('تم تعديل الفاتورة بنجاح');
          this.endLoading();
          setTimeout(() => {
            this.router.navigate(['/invoices/all-invoices']);
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

  ngOnInit() {

    this.getOrderItemTypes();
    this.getModels();
    console.log(this.updatedMode);
    if (!this.updatedMode) {
      this.getTaxes();
    }
    // End Get Taxes
    const clientInput = document.getElementById('clientInput');
    const clientInputEvent = fromEvent(clientInput, 'keyup');
    clientInputEvent
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe((value: any) =>
        this.selectClient ? null : this.getClients(value)
      );
    if (this.updatedMode) {
      document.getElementById('client').style.display = 'none';
    }
  }
  submit() {
    this.startLoading();
    this.coreService
      .postMethod('receipts/save', {
        client_id: this.clientInvoiceForm.controls.receipt_object_id.value,
        receipt_object_id: this.clientInvoiceForm.controls.receipt_object_id
          .value,
        receipt_type: 'client_receipt',
        client_name: this.clientInvoiceForm.controls.clientName.value,
        date: this.date,
        items: this.invoiceItems,
        taxes: this.taxesArray,
        discount: this.clientInvoiceForm.controls.discount.value,
        total: this.priceWithTaxes
      })
      .subscribe(
        () => {
          this.showSuccess('تم إصدار الفاتورة بنجاح');
          this.endLoading();
          setTimeout(() => {
            this.router.navigate(['/invoices/all-invoices']);
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
  /* --------------------------- Date ------------------------------- */
  orderDateChanged(event, ...mode) {
    // console.log(event.targetElement.value);
    let orderDateArray;
    let orderDate;
    if (mode[0] === 'init') {
      orderDate = event;
    }
    else if (mode[0] === 'updateMode') {
      orderDateArray = event.split('-');
      orderDate =
        orderDateArray[0] + '/' + orderDateArray[1] + '/' + orderDateArray[2];
      this.clientInvoiceForm.patchValue({
        date: orderDate
      });
    } else {
      orderDateArray = event.targetElement.value.split('/');
      orderDate =
        orderDateArray[2] + '/' + orderDateArray[0] + '/' + orderDateArray[1];
      this.clientInvoiceForm.patchValue({
        date: orderDate
      });
    }
    this.date = orderDate;
  }



  numberChange(event) {
    this.number = Number(
      event
        .replace(/[٠١٢٣٤٥٦٧٨٩]/g, d => {
          return d.charCodeAt(0) - 1632; // Convert Arabic numbers
        })
        .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, d => {
          return d.charCodeAt(0) - 1776; // Convert Persian numbers
        })
    );
    this.total = +event * +this.orderItemPrice;
    // this.checkActiveButton();
  }
  addItem() {
    this.startLoading();
    const itemsObj = {
      name: this.modelName,
      item_price: this.orderItemPrice,
      type: this.orderItemTypeId,
      typeName: this.orderItemTypeName,
      number: this.number,
      description: this.orderItemDetails,
      price: this.total
    };
    this.invoiceItems.push(itemsObj);
    console.log(this.invoiceItems);
    this.clientInvoiceForm.patchValue({
      items: this.invoiceItems
    });
    this.dataSource = new MatTableDataSource(this.invoiceItems);
    this.orderItemDetails = '';
    this.clientInvoiceForm.controls.orderItemDetails.setValue('');
    this.modelID = '';
    this.modelName = '';
    this.orderItemPrice = '';
    this.total = 0;
    this.number = '';
    if (document.querySelector('#orderItemName') as HTMLInputElement) {
      (document.querySelector('#orderItemName') as HTMLInputElement).value = '';
    }
    (document.querySelector('#number') as HTMLInputElement).value = '';
    (document.querySelector('#orderItemPrice') as HTMLInputElement).value = '';
    (document.querySelector('#orderItemType') as HTMLInputElement).value = '';
    this.orderItemTypesFilteredOptions = this.clientInvoiceForm
      .get('orderItemTypesObj')
      .valueChanges.pipe(
        startWith(''),
        map(value => this.filterOrderItemTypes(value))
      );
    this.countInvoiceTotalPrice();
    this.endLoading();
  }
  updateItems(row, i) {
    this.flageUpdatedItems = true;
    this.orderItemTypeId = +row.type;
    console.log(this.orderItemTypeId);
    this.getModels();
    this.startLoading();
    console.log(row);
    this.index = i;
    this.updateMode = true;
    this.modelName = row.name;
    // this.modelID = row.model.id;
    this.orderItemPrice = +row.item_price;
    this.orderItemTypeId = +row.type;
    this.orderItemTypeName = row.typeName;
    this.number = +row.number;
    this.orderItemDetails = row.description;
    this.clientInvoiceForm.controls.orderItemDetails.setValue(row.description);
    this.total = +row.price;
    this.addOrderItemActive = true;
    console.log(this.orderItemDetails);
    this.endLoading();
  }
  updateItem() {
    this.startLoading();
    const itemsObj = {
      name: this.modelName,
      item_price: this.orderItemPrice,
      type: this.orderItemTypeId,
      typeName: this.orderItemTypeName,
      number: this.number,
      description: this.orderItemDetails,
      price: this.total
    };
    this.invoiceItems[this.index] = itemsObj;
    console.log(this.invoiceItems);
    this.clientInvoiceForm.patchValue({
      items: this.invoiceItems
    });
    this.dataSource = new MatTableDataSource(this.invoiceItems);
    this.orderItemDetails = '';
    // this.orderItemName = ;
    // this.modelID = '';
    this.modelName = '';
    this.total = 0;
    this.orderItemPrice = '';
    this.number = '';
    this.clientInvoiceForm.controls.orderItemDetails.setValue('');

    if (document.querySelector('#orderItemName') as HTMLInputElement) {
      (document.querySelector('#orderItemName') as HTMLInputElement).value = '';
    }
    (document.querySelector('#number') as HTMLInputElement).value = '';
    (document.querySelector('#orderItemPrice') as HTMLInputElement).value = '';
    (document.querySelector('#orderItemType') as HTMLInputElement).value = '';
    this.orderItemTypesFilteredOptions = this.clientInvoiceForm
      .get('orderItemTypesObj')
      .valueChanges.pipe(
        startWith(''),
        map(value => this.filterOrderItemTypes(value))
      );
    this.ModelsFilteredOptions = this.clientInvoiceForm
      .get('model')
      .valueChanges.pipe(
        startWith(''),
        map(value => this.filterModel(value))
      );
    this.countInvoiceTotalPrice();
    this.updateMode = false;
    this.endLoading();
    this.flageUpdatedItems = false;
  }

  countInvoiceTotalPrice() {
    this.totalPrice = 0;
    // Total Price
    this.invoiceItems.forEach(item => {
      this.totalPrice += +item.price;
      // Total Taxes
    });
    this.taxSum = 0;
    let totalBeforeTax = this.totalPrice - this.discount;
    this.totalTaxes = totalBeforeTax;
    this.taxesArray.forEach(tax => {
      if (tax.method === 'percent') {
        console.log(tax.value);
        this.taxSum += (totalBeforeTax * +tax.value) / 100;
        this.totalTaxes += totalBeforeTax * (+tax.value / 100);

        console.log(this.totalTaxes);
      } else if (tax.method === 'value') {
        console.log(tax.value);
        this.taxSum += +tax.value;
        this.totalTaxes += tax.value;
        console.log(this.totalTaxes);
      }
      console.log(tax.value);

      // Total Taxes
      console.log(this.taxSum);
    });
    if (this.totalTaxes != 0) {
      console.log(this.totalTaxes);
      this.totalTaxes = Math.abs(this.totalTaxes - totalBeforeTax);
      console.log(this.totalTaxes);
    } else if (this.totalTaxes == 0) {
      this.totalTaxes = 0;
    }
    // Total Price
    console.log(this.totalTaxes);

    this.priceWithTaxes = Math.ceil(totalBeforeTax + this.totalTaxes);
  }
  //
  // ───────────────────────────── END COUNT INVOICE TOTAL PRICE ─────
  //
  discountValue(value) {
    this.discount = +value;
    this.countInvoiceTotalPrice();
  }

  //
  // ─── START GET TAXES ─────────────────────────────────────────────
  //

  getTaxes() {
    this.startLoading();
    this.coreService.getMethod('settings/taxes', {}).subscribe((taxes: any) => {
      console.log(taxes);
      this.taxesArray = taxes.data;
      this.taxesLoaded = true;
      this.endLoading();
    });
  }

  //
  // ───────────────────────────────────────────── END GET TAXES ─────
  //
  xReset(key) {
    if (key == 'orderItemType') {
      this.clientInvoiceForm.controls.orderItemTypesObj.setValue('');
      this.getOrderItemTypes();
    }
    if (key == 'orderItemName') {
      this.getModels();
      this.clientInvoiceForm.controls.model.setValue('');
    }
    (document.getElementById(key) as HTMLInputElement).value = '';
  }
  //
  // ─── START ONSUBMIT ──────────────────────────────────────────────
  //

  deleteListItem(i) {
    this.invoiceItems.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.invoiceItems);
    this.clientInvoiceForm.patchValue({
      items: this.invoiceItems
    });
    // Start Count Invoice Total Price
    this.countInvoiceTotalPrice();
    // End Count Invoice Total Price
  }
  acceptance(event) {
    if (event == true) {
      this.accept = true;
    } else if (event == false) {
      this.accept = false;
    }
  }
  newTaxes(event) {
    if (event == true) {
      this.newTax = true;
      this.startLoading();
      this.coreService
        .getMethod('settings/taxes', {})
        .subscribe((taxes: any) => {
          console.log(taxes.data);
          this.taxesArray = taxes.data;
          this.taxSum = 0;
          this.totalTaxes = 0;
          for (let i = 0; i < this.taxesArray.length; i++) {
            if (this.taxesArray[i].method === 'percent') {
              this.taxSum +=
                (+this.totalPrice * +this.taxesArray[i].value) / 100;
              this.totalTaxes +=
                (this.totalPrice - this.discount) *
                (+this.taxesArray[i].value / 100) +
                this.totalPrice -
                this.discount;
              console.log(this.totalTaxes);
            } else if (this.taxesArray[i].method === 'value') {
              console.log(this.taxesArray[i].value);

              this.taxSum += +this.taxesArray[i].value;
              this.totalTaxes +=
                this.totalPrice - this.discount + this.taxesArray[i].value;
              console.log(this.totalTaxes);
            }
          }
          this.countInvoiceTotalPrice();
          this.endLoading();
        });
    } else if (event == false) {
      this.startLoading();
      this.newTax = false;
      this.taxesArray = this.taxArr;
      this.taxSum = 0;
      this.totalTaxes = 0;
      for (let i = 0; i < this.taxesArray.length; i++) {
        if (this.taxesArray[i].method === 'percent') {
          this.taxSum += (+this.totalPrice * +this.taxesArray[i].value) / 100;
          this.totalTaxes +=
            (this.totalPrice - this.discount) *
            (+this.taxesArray[i].value / 100) +
            this.totalPrice -
            this.discount;
          console.log(this.totalTaxes);
        } else if (this.taxesArray[i].method === 'value') {
          console.log(this.taxesArray[i].value);

          this.taxSum += +this.taxesArray[i].value;
          this.totalTaxes +=
            this.totalPrice - this.discount + this.taxesArray[i].value;
          console.log(this.totalTaxes);
        }
      }
      this.countInvoiceTotalPrice();
      this.endLoading();
    }
  }
  //
  // ───────────────────────────────────── END ITEM NAME CHANGED ─────
  //

  //
  // ─── START ITEM PRICE CHANGED ────────────────────────────────────
  //

  itemPriceChanged(price) {
    this.total = 0;
    this.total = +price * +this.number;

    this.orderItemPrice = Number(
      price
        .replace(/[٠١٢٣٤٥٦٧٨٩]/g, d => {
          return d.charCodeAt(0) - 1632; // Convert Arabic numbers
        })
        .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, d => {
          return d.charCodeAt(0) - 1776; // Convert Persian numbers
        })
    );
    // this.checkActiveButton();
  }

  //
  // ──────────────────────────────────── END ITEM PRICE CHANGED ─────
  //

  //
  // ─── START ITEM DETAILS CHANGED ──────────────────────────────────
  //

  itemDetailsChanged(details) {
    console.log(details);
    this.orderItemDetails = details;
  }

  //
  // ────────────────────────────────── END ITEM DETAILS CHANGED ─────
  //

  //
  // ─── START CHACK ADD ORDER ITEM ACTIVE ───────────────────────────
  //

  // checkActiveButton() {
  //   if (
  //     this.modelName !== '' &&
  //     this.orderItemPrice !== '' &&
  //     this.number !== '' &&
  //     this.orderItemTypeId !== ''
  //   ) {
  //     this.addOrderItemActive = true;
  //   } else {
  //     this.addOrderItemActive = false;
  //   }
  // }

  //
  // ─────────────────────────── END CHACK ADD ORDER ITEM ACTIVE ─────
  //

  //
  // ─── START GET SOURCES ───────────────────────────────────────────
  //

  getOrderItemTypes() {
    this.startLoading();
    this.coreService
      .getMethod('lookup/receipt-item-types', {})
      .subscribe((orderItemTypes: any) => {
        this.orderItemTypesLoaded = true;
        this.orderItemTypesArray = orderItemTypes.data;
        // Start End Loading
        this.endLoading();
        // End End Loading
        // Start Select Search For Home Contract Types
        this.orderItemTypesFilteredOptions = this.clientInvoiceForm
          .get('orderItemTypesObj')
          .valueChanges.pipe(
            startWith(''),
            map(value => this.filterOrderItemTypes(value))
          );
        // End Select Search For Home Contract Types
      });
  }
  filterOrderItemTypes(value: any) {
    this.orderItemTypeId = value.id;
    this.orderItemTypeName = value.name;
    this.getModels();
    // this.checkActiveButton();
    if (this.orderItemTypesArray !== null) {
      return this.orderItemTypesArray.filter(option =>
        option.name.includes(value)
      );
    }
  }

  getModels() {
    this.startLoading();
    this.coreService
      .getMethod('settings/invoiceSets?set_type_id=' + this.orderItemTypeId)
      .subscribe((orderItemTypes: any) => {
        console.log(orderItemTypes);
        this.modelArray = orderItemTypes.data;
        // Start End Loading
        this.endLoading();
        // End End Loading
        // Start Select Search For Home Contract Types
        this.ModelsFilteredOptions = this.clientInvoiceForm
          .get('model')
          .valueChanges.pipe(
            startWith(''),
            map(value => this.filterModel(value))
          );
        // End Select Search For Home Contract Types
      });
  }
  filterModel(value: any) {
    if (this.flageUpdatedItems == false) {
      this.modelID = value.id;
      this.modelName = value.set_name;
    }
    // this.clientInvoiceForm.controls.orderItemTypesObj.disable();
    return this.modelArray.filter(option => option.set_name.includes(value));
  }

  getClients(value) {
    if (value === '') {
      this.clientsArray = [];
    } else {
      // Start Loading
      this.startLoading();
      // End Loading
      this.coreService
        .getMethod('clients/active', { name: value })
        .subscribe((clientsResponse: any) => {
          this.clientsArray = clientsResponse;
          this.clientsArrayLoaded = true;
          // Start End Loading
          this.endLoading();
          // End End Loading
          // Start Select Search For Home Contract Types
          this.clientsFilteredOptions = this.clientInvoiceForm
            .get('clientIdObj')
            .valueChanges.pipe(
              startWith(''),
              map(values => this.filterClients(values))
            );
          // End Select Search For Home Contract Types
        });
    }
  }
  viewClientDetailsFunction() {
    const clientId = this.clientInvoiceForm.value.client_id;
    window.open('/clients/client-details?clientId=' + clientId, '_blank');
  }
  filterClients(value: any) {
    if (typeof value === 'object') {
      this.clientObject = value;
      console.log(value);
      this.clientInvoiceForm.controls.clientName.setValue(value.user.name);
      this.clientInvoiceForm.patchValue({
        receipt_object_id: value.id
      });
      // View Client Details
      this.viewClientDetails = true;
      this.selectClient = true;
      // View Client Details
    } else {
      this.viewClientDetails = false;
      this.selectClient = false;
    }
    if (this.clientsArray !== null) {
      return this.clientsArray.filter(option =>
        option.user.name.includes(value)
      );
    }
  }

  addNewClient() {
    this.startLoading();
    this.router.navigate(['/clients/add-client'], {
      queryParams: { invoiceClient: true }
    });
    this.endLoading();
  }
  displayOptionsFunction(state) {
    if (state !== null) {
      if (state.user) {
        return state.user.name;
      } else {
        return state.name;
      }
    }
  }
  displayOptionsFunction2(state) {
    if (state !== null) {
      return state.set_name;
    }
  }

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
    this.endLoading();
    this.responseState = 'error';
    this.responseData = errors;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  showSuccess(text) {
    this.endLoading();
    this.responseState = 'success';
    this.responseData = text;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  //
  // ───────────────────────────────────── END RESPONSE MESSEGES ─────
  //
}
