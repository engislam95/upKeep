import { Component, OnInit } from '@angular/core';
import { CoreService } from './../../../tools/shared-services/core.service';

@Component({
  selector: 'app-managment',
  templateUrl: './managment.component.html',
  styleUrls: ['./managment.component.scss']
})
export class ManagmentComponent implements OnInit {
  clientsCount;
  offersCount;
  postponedCount;
  receiptedCount;
  stoppedCount;
  todayCount;
  constructor(private coreService: CoreService) { }

  ngOnInit() {
    this.getCounts();
  }

  //
  // ─── START GET COUNT ─────────────────────────────────────────────
  //

  getCounts() {
    this.coreService.getMethod('dashboard', {}).subscribe((dashboard: any) => {
      this.clientsCount = dashboard.data.clients_count;
      this.offersCount = dashboard.data.offers_count;
      this.postponedCount = dashboard.data.postponed_count;
      this.receiptedCount = dashboard.data.receipted_count;
      this.stoppedCount = dashboard.data.stopped_count;
      this.todayCount = dashboard.data.today_count;
    });
  }
  //
  // ──────────────────────────────────────────── END GET COUNTS ─────
  //
}
