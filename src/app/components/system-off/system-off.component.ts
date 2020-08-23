import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-system-off',
  templateUrl: './system-off.component.html',
  styleUrls: ['./system-off.component.scss'],

})
export class SystemOffComponent implements OnInit {
  /* ----------------- Variables --------------------------- */
  showSideMenu: boolean = false;
  overLayShow: boolean = false;
  windowWidth = window.innerWidth;
  user: any = '';
  /* ----------------------- Constructor ------------------------ */
  constructor() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }
  /* --------------------- Oninit ------------------------------- */
  ngOnInit() {
    if (this.windowWidth > 991) {
      this.showSideMenu = true;
    } else {
      this.showSideMenu = false;
    }

  }
  


}
