import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/tools/shared-services/loader.service';
import { ResponseStateService } from 'src/app/tools/shared-services/response-state.service';
import { CoreService } from 'src/app/tools/shared-services/core.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
export interface PeriodicElement {

  edit_tybe: string;
  id: number;
  edit_by: string;
  notes: string;
  data_time: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, edit_tybe: ' اصدار فاتورة ', edit_by: 'Ramy Zoheir', notes: '', data_time: '02/05/2020' },
  { id: 2, edit_tybe: ' اصدار فاتورة ', edit_by: 'Ramy Zoheir', notes: '', data_time: '02/05/2020' }


];
@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnInit {

  pageLoaded = false;

  // displayedColumns: string[] = ['id', 'edit_tybe', 'edit_by', 'notes', 'data_time'];
  // dataSource: any = ELEMENT_DATA;
  invoiceID: any = '';
  taxesArray = [];
  updatedInvoice: any = {};

  constructor(private loaderService: LoaderService,
    private responseStateService: ResponseStateService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(data => {
      console.log(data);
      this.invoiceID = data.incoiveID;
      this.startLoading();
      this.coreService.getMethod('receipts/' + this.invoiceID).subscribe(rec => {
        console.log(rec['data'][0]);
        this.updatedInvoice = rec['data'][0];
      })
    })
  }


  ngOnInit() {
  }
  startLoading() {
    this.pageLoaded = false;
    this.loaderService.startLoading();
  }
  endLoading() {
    this.pageLoaded = true;
    this.loaderService.endLoading();
  }
  print() {
    window.print();
  }

}



