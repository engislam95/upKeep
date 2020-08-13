import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss']
})
export class AddInvoiceComponent implements OnInit {

  receipt_all: boolean = false;
  receipt_add: boolean = false;
  receipt_update: boolean = false;
  receipt_delete: boolean = false;
  receipts: any = [];
  user: any = '';

  constructor() {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    this.receipts = this.user.modules.receipts;
    if (this.receipts) {
      this.receipts.map(ele => {
        switch (ele) {
          case 'create': this.receipt_add = true;
            break;
          case 'all': this.receipt_all = true;
            break;
          case 'update': this.receipt_update = true;
            break;
          case 'delete': this.receipt_delete = true;
            break;
        }
      });
    }
  }

  ngOnInit() {
  }

}
