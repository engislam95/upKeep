import { Component, OnInit, Input } from '@angular/core';
import { ResponseStateService } from 'src/app/tools/shared-services/response-state.service';
import { fade } from 'src/app/tools/shared_animations/fade';
@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  animations: fade
})
export class AlertsComponent implements OnInit {
  /* ---------------------- Variables -------------------------- */
  success: boolean = false;
  wrong: boolean = false;
  warn: boolean = false;
  details: boolean = false;
  successData: any = '';
  warnData: any = '';
  detailsData: any = '';
  messeges: any = [];
  /* --------------------------- Constructor ------------------------------- */
  constructor(private responseStateService: ResponseStateService) {
    this.responseStateService.stateObservable.subscribe(response => {
      switch (response[0]) {
        case 'error':
          this.wrong = true;
          // Error Display Messeges
          let id = 0;
          if (typeof response[1] === 'string') {
            this.messeges.push(response[1]);
          } else {
            Object.values(response[1]).forEach((values: any) => {
              values.forEach(message => {
                setTimeout(() => {
                  this.messeges.push(message);
                }, 500 * id);
                id++;
              });
            });
          }
          setTimeout(() => {
            this.messeges.forEach(message => {
              setTimeout(() => {
                this.messeges.splice(-1);
              }, 500 * id);
              id++;
            });
          }, id * 500 + 3500);
          // Error Display Messeges
          break;
        case 'warning':
          this.warnData = response[1];
          this.warn = true;
          // Success Display Messeges
          setTimeout(() => {
            this.warn = false;
          }, 3000);
          // Success Display Messeges
          break;
        case 'details':
          this.detailsData = response[1];
          this.details = true;
          // Success Display Messeges
          setTimeout(() => {
            this.details = false;
          }, 4500);
          // Success Display Messeges
          break;
        case 'success':
          this.successData = response[1];
          this.success = true;
          // Success Display Messeges
          setTimeout(() => {
            this.success = false;
          }, 1500);
          // Success Display Messeges
          break;
      }
    });
  }
  /* --------------------- Oninit ---------------------- */
  ngOnInit() { }
}
