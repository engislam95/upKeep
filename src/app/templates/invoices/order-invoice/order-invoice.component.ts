import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CoreService } from './../../../tools/shared-services/core.service';
import { ResponseStateService } from './../../../tools/shared-services/response-state.service';
import { LoaderService } from './../../../tools/shared-services/loader.service';
import { fade } from './../../../tools/shared_animations/fade';
import { MatTableDataSource } from '@angular/material';
import { emptyValidator } from 'src/app/tools/shared_validators/Empty.validator';
import '@ckeditor/ckeditor5-build-classic/build/translations/ar';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-order-invoice',
  templateUrl: './order-invoice.component.html',
  styleUrls: ['./order-invoice.component.scss'],
  animations: fade
})
export class OrderInvoiceComponent implements OnInit {
  /* -------------------------- Variables ----------------------------- */
  pageLoaded: boolean = false;
  orderDetailsLoaded: boolean = false;
  submitted: boolean = false;
  orderItemTypesLoaded: boolean = false;
  taxesLoaded: boolean = false;
  responseState: any = '';
  responseData: any = '';
  orderDetails: any = '';
  orderId: any = '';
  orderItemName: any = '';
  clientsFilteredOptions: Observable<any>;
  taxSum = 0;
  orderItemPrice: any = '';
  orderItemTypeId: any = '';
  orderItemDetails: any = '';
  addOrderItemActive: boolean = false;
  invoiceItems: any = [];
  totalPrice: number = 0;
  totalTaxes: number = 0;
  priceWithTaxes: any = '';
  taxesArray: any = '';
  orderItemTypesArray: any = [];
  orderItemTypesFilteredOptions: Observable<any>;
  total: any = '';
  index = '';
  updateMode = false;
  ModelsFilteredOptions: Observable<any>;
  updatedMode = false;
  modelArray: any = [];
  modelID;
  service_id: any = '';
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
  invoiceID = '';
  updatedInvoice: any = '';
  orderItemTypeName: any = '';
  number: any = '';
  date: any = new Date().toLocaleDateString("en-US");
  clientsArray = [];
  clientObject = '';
  invoiceObj: any = '';
  orderID: any = '';
  flageUpdatedItems = false;
  newTax = false;
  taxArr = [];
  showNote = false;
  newModel = false;

  /* ---------------Editor --------------- */
  public Editor = ClassicEditor;
  public config = {
    language: 'ar'
  };
  /* ----------------------------- Order Invoice Form ----------------------------- */
  orderInvoiceForm = new FormGroup({
    items: new FormControl([]),
    receipt_type: new FormControl('order_receipt'),
    orderItemDetails: new FormControl(''),
    orderItemTypesObj: new FormControl(''),
    clientName: new FormControl('', Validators.required),
    model: new FormControl(''),
    date: new FormControl(new Date().toLocaleDateString("en-US")),
    discount: new FormControl(''),
    receipt_object_id: new FormControl('', Validators.required)
  });
  /* --------------------------- Constructor --------------------------------- */
  constructor(
    private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router
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
    this.startLoading();
    this.coreService
      .getMethod('lookup/receipt-item-types', {})
      .subscribe((orderItemTypes: any) => {
        console.log(orderItemTypes);
        this.orderItemTypesLoaded = true;
        this.orderItemTypesArray = orderItemTypes.data;
        // Start End Loading
        this.endLoading();
        // End End Loading
        // Start Select Search For Home Contract Types
        this.orderItemTypesFilteredOptions = this.orderInvoiceForm
          .get('orderItemTypesObj')
          .valueChanges.pipe(
            startWith(''),
            map(value => this.filterOrderItemTypes(value))
          );
        // End Select Search For Home Contract Types
      });
    this.activatedRoute.queryParams.subscribe(data => {
      console.log(data);
      if (data.updatedMode !== 'true') {
        // this.updatedMode = true;
        this.orderID = data.orderId;
        this.startLoading();
        this.coreService
          .getMethod('orders/' + this.orderID + '/details')
          .subscribe(rec => {
            console.log(rec['data']);
            this.endLoading();
            this.invoiceObj = rec['data'];
            if (this.invoiceObj) {
              this.orderInvoiceForm.controls.orderItemTypesObj.setValue(
                this.invoiceObj.id
              );
              this.orderInvoiceForm.controls.receipt_object_id.setValue(
                this.invoiceObj.id
              );
              this.orderInvoiceForm.controls.clientName.setValue(
                this.invoiceObj.client.user.name
              );
              this.service_id = this.invoiceObj.service.parent_service.id;
            }
          });
      }
      if (data.updatedMode == 'true') {
        this.updatedMode = true;
        console.log(true);
        this.invoiceID = data.incoiveID;
        this.startLoading();
        this.coreService
          .getMethod('receipts/' + this.invoiceID)
          .subscribe(rec => {
            console.log(rec['data'][0]);
            this.endLoading();
            this.updatedInvoice = rec['data'][0];
            // this.coreService
            //   .getMethod('orders/' + rec['data'][0].order_id + '/details')
            //   .subscribe(recs => {
            //     console.log(recs);
            //     this.invoiceObj = recs['data'];
            //     this.orderInvoiceForm.controls.orderItemTypesObj.setValue(
            //       this.invoiceObj.id
            //     );
            //     this.orderInvoiceForm.controls.receipt_object_id.setValue(
            //       this.invoiceObj.id
            //     );
            //   });
            this.orderInvoiceForm.controls.receipt_object_id.setValue(
              this.updatedInvoice.order.id
            );
            this.service_id = this.updatedInvoice.order.service.parent;
            this.discount = this.updatedInvoice.discount;
            this.totalPrice = this.updatedInvoice.totalItems;
            this.orderInvoiceForm.controls.clientName.setValue(
              this.updatedInvoice.client_name
            );
            this.orderInvoiceForm.controls.date.setValue(
              this.updatedInvoice.datecreated_at
            );
            this.orderInvoiceForm.controls.discount.setValue(
              this.updatedInvoice.discount
            );
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

  /* ----------------------- Oninit ---------------------------------- */
  ngOnInit() {
    this.getOrderItemTypes();
    this.getOrderDetails();
    if (!this.updatedMode) {
      this.getTaxes();
    }
  }

  updateInvo() {
    this.startLoading();
    this.coreService
      .updateMethod('receipts/update/' + this.invoiceID, {
        receipt_object_id: this.orderInvoiceForm.controls.receipt_object_id
          .value,
        receipt_type: 'order_receipt',
        client_name: this.orderInvoiceForm.controls.clientName.value,
        date: this.date,
        items: this.invoiceItems,
        taxes: this.taxesArray,
        discount: this.orderInvoiceForm.controls.discount.value,
        total: this.priceWithTaxes,
        new_taxes: this.newTax,
        service_id: this.service_id
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

  /* ------------------------------- Create Invoice -------------------------- */
  submit() {
    this.startLoading();
    this.coreService
      .postMethod('receipts/save', {
        receipt_object_id: this.orderInvoiceForm.controls.receipt_object_id
          .value,
        receipt_type: 'order_receipt',
        client_name: this.orderInvoiceForm.controls.clientName.value,
        date: this.date,
        items: this.invoiceItems,
        taxes: this.taxesArray,
        discount: this.orderInvoiceForm.controls.discount.value,
        total: this.priceWithTaxes,
        service_id: this.service_id
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
  /* --------------------------- Date ------------------------------- */
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
      this.orderInvoiceForm.patchValue({
        date: orderDate
      });
    } else {
      orderDateArray = event.targetElement.value.split('/');
      orderDate =
        orderDateArray[2] + '/' + orderDateArray[0] + '/' + orderDateArray[1];
      this.orderInvoiceForm.patchValue({
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
    this.orderInvoiceForm.patchValue({
      items: this.invoiceItems
    });
    this.dataSource = new MatTableDataSource(this.invoiceItems);
    this.orderItemDetails = '';
    this.modelID = '';
    this.modelName = '';
    this.total = 0;
    this.orderItemPrice = '';
    this.orderInvoiceForm.controls.orderItemDetails.setValue('');
    this.number = '';
    if (document.querySelector('#orderItemName') as HTMLInputElement) {
      (document.querySelector('#orderItemName') as HTMLInputElement).value = '';
    }
    (document.querySelector('#number') as HTMLInputElement).value = '';
    (document.querySelector('#orderItemPrice') as HTMLInputElement).value = '';
    (document.querySelector('#orderItemType') as HTMLInputElement).value = '';
    this.orderItemTypesFilteredOptions = this.orderInvoiceForm
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
    this.orderInvoiceForm.controls.orderItemDetails.setValue(row.description);
    this.total = +row.price;
    this.addOrderItemActive = true;
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
    this.orderInvoiceForm.patchValue({
      items: this.invoiceItems
    });
    this.dataSource = new MatTableDataSource(this.invoiceItems);
    this.orderItemDetails = '';
    // this.orderItemName = ;
    // this.modelID = '';
    this.modelName = '';
    this.orderItemPrice = '';
    this.total = 0;
    this.number = '';
    this.orderInvoiceForm.controls.orderItemDetails.setValue('');
    if (document.querySelector('#orderItemName') as HTMLInputElement) {
      (document.querySelector('#orderItemName') as HTMLInputElement).value = '';
    }
    (document.querySelector('#number') as HTMLInputElement).value = '';
    (document.querySelector('#orderItemPrice') as HTMLInputElement).value = '';
    (document.querySelector('#orderItemType') as HTMLInputElement).value = '';
    this.orderItemTypesFilteredOptions = this.orderInvoiceForm
      .get('orderItemTypesObj')
      .valueChanges.pipe(
        startWith(''),
        map(value => this.filterOrderItemTypes(value))
      );
    this.ModelsFilteredOptions = this.orderInvoiceForm
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
  discountValue(value) {
    this.discount = value;
    this.countInvoiceTotalPrice();
  }
  /* ------------------------------ Get Taxes ---------------------------- */
  getTaxes() {
    this.coreService.getMethod('settings/taxes', {}).subscribe((taxes: any) => {
      console.log(taxes);

      this.taxesArray = taxes.data;
      this.taxesLoaded = true;
      this.endLoading();
    });
  }
  /* --------------------------- Delete Item -------------------------- */
  deleteListItem(i) {
    this.invoiceItems.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.invoiceItems);
    this.orderInvoiceForm.patchValue({
      items: this.invoiceItems
    });
    // Start Count Invoice Total Price
    this.countInvoiceTotalPrice();
    // End Count Invoice Total Price
  }
  /* ----------------------------- Name Change ------------------------------- */
  itemNameChanged(name) {
    this.orderItemName = name;
    // this.checkActiveButton();
  }
  /* -------------------------- Price Change ---------------------------- */
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

  /* ------------------------ Details Change --------------------------- */
  itemDetailsChanged(details) {
    this.orderItemDetails = details;
  }
  /* ------------------------- Active ----------------------------- */
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
  displayOptionsFunction2(state) {
    if (state !== null) {
      return state.set_name;
    }
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
          // Start End Loading
          this.endLoading();
          // End End Loading
          // Start Select Search For Home Contract Types
          this.clientsFilteredOptions = this.orderInvoiceForm
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
    const clientId = this.orderInvoiceForm.value.client_id;
    window.open('/clients/client-details?clientId=' + clientId, '_blank');
  }
  filterClients(value: any) {
    if (typeof value === 'object') {
      this.clientObject = value;
      console.log(this.clientObject);
      this.orderInvoiceForm.controls.clientName.setValue(value.user.name);
      // this.orderInvoiceForm.patchValue({
      //   receipt_object_id: value.id
      // });
    }

    if (this.clientsArray !== null) {
      return this.clientsArray.filter(option =>
        option.user.name.includes(value)
      );
    }
  }

  getOrderItemTypes() {
    this.startLoading();
    this.coreService
      .getMethod('lookup/receipt-item-types', {})
      .subscribe((orderItemTypes: any) => {
        console.log(orderItemTypes);
        this.orderItemTypesLoaded = true;
        this.orderItemTypesArray = orderItemTypes.data;
        // Start End Loading
        this.endLoading();
        // End End Loading
        setTimeout(() => {
          this.orderItemTypesFilteredOptions = this.orderInvoiceForm
            .get('orderItemTypesObj')
            .valueChanges.pipe(
              startWith(''),
              map(value => this.filterOrderItemTypes(value))
            );
        }, 1000);
        // Start Select Search For Home Contract Types

        // End Select Search For Home Contract Types
      });
  }
  filterOrderItemTypes(value: any) {
    console.log(value);

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

  /* --------------------------- Get Order Details --------------------------- */
  getOrderDetails() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.orderId = params.orderId;
      this.orderInvoiceForm.patchValue({
        receipt_object_id: +this.orderId
      });
      this.coreService
        .getMethod('orders/' + this.orderId + '/details', {})
        .subscribe((order: any) => {
          this.orderDetails = order.data;
          this.orderDetailsLoaded = true;
          this.endLoading();
        });
    });
  }
  /* -------------------------- Display Options -------------------------- */
  displayOptionsFunction(state) {
    if (state !== null) {
      return state.name;
    }
  }

  getModels() {
    console.log(this.orderItemTypeId);
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
        this.ModelsFilteredOptions = this.orderInvoiceForm
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

  /* -------------------- Start Loading -------------------------- */
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  /* ------------------- End Loading --------------------------- */
  endLoading() {
    if (this.orderItemTypesLoaded) {
      this.pageLoaded = true;
      this.loaderService.endLoading();
    }
  }
  /* --------------------------- Show Error Message ---------------------------- */
  showErrors(errors) {
    this.endLoading();
    this.responseState = 'error';
    this.responseData = errors;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  /* ------------------------ Show Success Message ------------------------------ */
  showSuccess(text) {
    this.endLoading();
    this.responseState = 'success';
    this.responseData = text;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
}
