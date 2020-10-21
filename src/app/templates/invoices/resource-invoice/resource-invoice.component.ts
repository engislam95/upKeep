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
  selector: 'app-resource-invoice',
  templateUrl: './resource-invoice.component.html',
  styleUrls: ['./resource-invoice.component.scss'],
  animations: fade
})
export class ResourceInvoiceComponent implements OnInit {
  //
  // ─── START GENERAL DATA ──────────────────────────────────────────
  //

  pageLoaded = true;
  // used
  orderItemTypesLoaded = false;
  taxesLoaded = false;
  responseState;
  responseData;
  orderDetails;
  orderId;
  orderItemName = '';
  orderItemPrice: any = '';
  orderItemTypeId: any = '';
  orderItemDetails = '';
  addOrderItemActive = false;
  invoiceItems = [];
  totalPrice = 0;
  totalTaxes = 0;
  priceWithTaxes;
  taxesArray;
  clientObject: any = '';
  taxSum: any = 0;

  //
  // ───────────────────────────────────────────────────────── END GENERAL DATA ─────
  //
  /* ---------------Editor --------------- */
  public Editor = ClassicEditor;
  public config = {
    language: 'ar'
  };

  //
  // ─── START SELECT AIR CONDITIONER ────────────────────────────────
  //

  orderItemTypesArray = [];
  orderItemTypesFilteredOptions: Observable<any>;

  //
  // ──────────────────────────────── END SELECT AIR CONDITIONER ─────
  //

  //
  // ─── START SELECT CLIENT ─────────────────────────────────────────
  //

  sourcesArray = [];
  sourcesFilteredOptions: Observable<any>;
  sourcesArrayLoaded = false;
  showNote = false;

  //
  // ───────────────────────────────────────── END SELECT CLIENT ─────
  //

  //
  // ─── START FORM DATA ─────────────────────────────────────────────
  //

  resourceInvoiceForm = new FormGroup({
    orderItemDetails: new FormControl(''),
    sourceObj: new FormControl('', [emptyValidator, Validators.required]),
    items: new FormControl([]),
    receipt_type: new FormControl('source_receipt'),
    sourceName: new FormControl('', [Validators.required]),
    orderItemTypesObj: new FormControl(''),
    model: new FormControl(''),
    date: new FormControl(new Date().toLocaleDateString("en-US")),
    discount: new FormControl(''),
    receipt_object_id: new FormControl('', Validators.required)
  });
  submitted = false;
  newModel = false;
  date = new Date().toLocaleDateString("en-US");
  total: any = '';
  index = '';
  updateMode = false;
  modelArray: any = [];
  modelID;
  modelName: any = '';
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
  ModelsFilteredOptions: Observable<any>;
  number: any = '';
  orderItemTypeName: any = '';
  invoiceID = '';
  updatedInvoice: any = '';
  updatedMode = false;
  flageUpdatedItems = false;
  newTax = false;
  taxArr = [];
  //
  // ───────────────────────────────────────────── END FORM DATA ─────
  //
  constructor(
    //
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
            console.log(rec['data'][0]);
            this.updatedInvoice = rec['data'][0];
            this.resourceInvoiceForm.controls.receipt_object_id.setValue(
              this.updatedInvoice.client_id
            );
            this.resourceInvoiceForm.controls.sourceObj.setValue(
              this.updatedInvoice.client_id
            );
            // this.resourceInvoiceForm.controls.clientIdObj.status = 'VALID';
            this.resourceInvoiceForm.controls.sourceName.setValue(
              this.updatedInvoice.client_name
            );
            this.resourceInvoiceForm.controls.date.setValue(
              this.updatedInvoice.datecreated_at
            );
            this.resourceInvoiceForm.controls.discount.setValue(
              this.updatedInvoice.discount
            );
            this.discount = this.updatedInvoice.discount;
            this.totalPrice = this.updatedInvoice.totalItems;
            this.date = this.updatedInvoice.datecreated_at;
            for (let i = 0; i < this.updatedInvoice.items.length; i++) {
              console.log(this.updatedInvoice.items[i]);
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

  //
  // ─── START ONINIT ────────────────────────────────────────────────
  //

  ngOnInit() {
    // Start START Loading
    this.startLoading();
    // End START Loading
    // Start Get Resources
    this.getSources();
    // End Get Resources
    // Start Get Order Items Types
    this.getOrderItemTypes();
    // End Get Order Items Types
    // Start Get Taxes
    if (!this.updatedMode) {
      this.getTaxes();
    }
    if (this.updatedMode) {
      document.getElementById('client').style.display = 'none';
    }
    // End Get Taxes
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
        source_id: this.resourceInvoiceForm.controls.receipt_object_id.value,
        receipt_object_id: this.resourceInvoiceForm.controls.receipt_object_id
          .value,
        receipt_type: 'source_receipt',
        client_name: this.resourceInvoiceForm.controls.sourceName.value,
        date: this.date,
        items: this.invoiceItems,
        taxes: this.taxesArray,
        discount: this.resourceInvoiceForm.controls.discount.value,
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
  //
  // ──────────────────────────────────────────────── END ONINIT ─────
  //
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
      this.resourceInvoiceForm.patchValue({
        date: orderDate
      });
    } else {
      orderDateArray = event.targetElement.value.split('/');
      orderDate =
        orderDateArray[2] + '/' + orderDateArray[0] + '/' + orderDateArray[1];
      this.resourceInvoiceForm.patchValue({
        date: orderDate
      });
    }
    this.date = orderDate;
  }
  //
  // ─── START ONSUBMIT ──────────────────────────────────────────────
  //

  submit() {
    this.startLoading();
    this.coreService
      .postMethod('receipts/save', {
        source_id: this.resourceInvoiceForm.controls.receipt_object_id.value,
        receipt_object_id: this.resourceInvoiceForm.controls.receipt_object_id
          .value,
        receipt_type: 'source_receipt',
        client_name: this.resourceInvoiceForm.controls.sourceName.value,
        date: this.date,
        items: this.invoiceItems,
        taxes: this.taxesArray,
        discount: this.resourceInvoiceForm.controls.discount.value,
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

  //
  // ────────────────────────────────────────────── END ONSUBMIT ─────
  //

  //
  // ─── START GET SOURCES ───────────────────────────────────────────
  //

  getSources() {
    this.coreService
      .getMethod('resources/active', {})
      .subscribe((sourcesResponse: any) => {
        console.log(sourcesResponse);
        this.sourcesArray = sourcesResponse.data;
        this.sourcesArrayLoaded = true;
        // Start End Loading
        this.endLoading();
        // End End Loading
        // Start Select Search For Home Contract Types
        this.sourcesFilteredOptions = this.resourceInvoiceForm
          .get('sourceObj')
          .valueChanges.pipe(
            startWith(''),
            map(value => this.filterSources(value))
          );
        // End Select Search For Home Contract Types
      });
  }
  filterSources(value: any) {
    if (typeof value === 'object') {
      this.clientObject = value;
      this.resourceInvoiceForm.controls.sourceName.setValue(value.name);
      this.resourceInvoiceForm.patchValue({
        receipt_object_id: value.id
      });
    }
    return this.sourcesArray.filter(option => option.name.includes(value));
  }

  //
  // ─────────────────────────────────────────── END GET SOURCES ─────
  //

  //
  // ─── START ADD ITEM TO INVOICE ───────────────────────────────────
  //
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
    this.resourceInvoiceForm.patchValue({
      items: this.invoiceItems
    });
    this.dataSource = new MatTableDataSource(this.invoiceItems);
    this.orderItemDetails = '';
    this.modelID = '';
    this.modelName = '';
    this.orderItemPrice = '';
    this.number = '';
    this.total = 0;
    this.resourceInvoiceForm.controls.orderItemDetails.setValue('');
    if (document.querySelector('#orderItemName') as HTMLInputElement) {
      (document.querySelector('#orderItemName') as HTMLInputElement).value = '';
    }
    (document.querySelector('#number') as HTMLInputElement).value = '';
    (document.querySelector('#orderItemPrice') as HTMLInputElement).value = '';
    (document.querySelector('#orderItemType') as HTMLInputElement).value = '';
    this.orderItemTypesFilteredOptions = this.resourceInvoiceForm
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
    this.resourceInvoiceForm.controls.orderItemDetails.setValue(
      row.description
    );
    this.total = +row.price;
    this.addOrderItemActive = false;
    this.endLoading();
  }
  updateItem() {
    this.startLoading();
    console.log(this.index);
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
    this.resourceInvoiceForm.patchValue({
      items: this.invoiceItems
    });
    this.dataSource = new MatTableDataSource(this.invoiceItems);
    this.orderItemDetails = '';
    this.orderItemName = '';
    this.modelID = '';
    this.modelName = '';
    this.orderItemPrice = '';
    this.total = 0;
    this.number = '';
    this.resourceInvoiceForm.controls.orderItemDetails.setValue('');
    if (document.querySelector('#orderItemName') as HTMLInputElement) {
      (document.querySelector('#orderItemName') as HTMLInputElement).value = '';
    }
    (document.querySelector('#number') as HTMLInputElement).value = '';
    (document.querySelector('#orderItemPrice') as HTMLInputElement).value = '';
    (document.querySelector('#orderItemType') as HTMLInputElement).value = '';
    this.orderItemTypesFilteredOptions = this.resourceInvoiceForm
      .get('orderItemTypesObj')
      .valueChanges.pipe(
        startWith(''),
        map(value => this.filterOrderItemTypes(value))
      );
    this.ModelsFilteredOptions = this.resourceInvoiceForm
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
    console.log(+value);
    this.discount = +value;
    this.countInvoiceTotalPrice();
  }
  xReset(key) {
    if (key == 'orderItemType') {
      this.getOrderItemTypes();
    }
    if (key == 'orderItemName') {
      this.getModels();
    }
    (document.getElementById(key) as HTMLInputElement).value = '';
  }
  //
  // ───────────────────────────── END COUNT INVOICE TOTAL PRICE ─────
  //

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
  // ─── START ONSUBMIT ──────────────────────────────────────────────
  //
  numberChange(event) {
    console.log(this.total);
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

  deleteListItem(i) {
    this.invoiceItems.splice(i, 1);
    this.resourceInvoiceForm.patchValue({
      items: this.invoiceItems
    });
    this.dataSource = new MatTableDataSource(this.invoiceItems);
    // Start Count Invoice Total Price
    this.countInvoiceTotalPrice();
    // End Count Invoice Total Price
  }

  //
  // ────────────────────────────────────────────── END ONSUBMIT ─────
  //

  //
  // ─── START ITEM NAME CHANGED ─────────────────────────────────────
  //

  itemNameChanged(name) {
    this.orderItemName = name;
    // this.checkActiveButton();
  }
  displayOptionsFunction2(state) {
    if (state !== null) {
      return state.set_name;
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
    console.log(+price);
    console.log(+this.number);
    this.total = +price * +this.number;
    console.log(this.total);

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
  // checkActiveButton() {
  //   if (
  //     this.modelName !== '' &&
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
  // ──────────────────────────────────── END ITEM PRICE CHANGED ─────
  //

  //
  // ─── START ITEM DETAILS CHANGED ──────────────────────────────────
  //

  itemDetailsChanged(details) {
    this.orderItemDetails = details;
  }
  //
  // ────────────────────────────────── END ITEM DETAILS CHANGED ─────
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
        this.orderItemTypesFilteredOptions = this.resourceInvoiceForm
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
        this.ModelsFilteredOptions = this.resourceInvoiceForm
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
    // this.checkActiveButton();
    return this.modelArray.filter(option => option.set_name.includes(value));
  }
  //
  // ─────────────────────────────────────────── END GET SOURCES ─────
  //

  //
  // ─── START DISPLAY OPTIONS FOR SELECT ────────────────────────────
  //

  displayOptionsFunction(state) {
    if (state !== null) {
      if (state.user) {
        return state.user.name;
      } else {
        return state.name;
      }
    }
  }
  //
  // ──────────────────────────── END DISPLAY OPTIONS FOR SELECT ─────
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
