import { Component, OnInit } from '@angular/core';
import { CoreService } from './../../../tools/shared-services/core.service';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent implements OnInit {
  user: any = '';
  constructor(private coreService: CoreService) {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
  }
  ngOnInit() {
  }
}
