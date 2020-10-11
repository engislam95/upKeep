import { Injectable, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class HeadersService {
  // companySlug = 'upkeep';
  companySlug: any = '';
  // baseAPI = '/upkeep/';
  baseAPI = 'https://clientmobile.reviews.upkeep.com.sa/upkeep/'
  // baseAPI  = 'https://tech-connection.reviews.upkeep.com.sa/upkeep/' ;
  // baseAPI = 'https://pusher.reviews.upkeep.com.sa/upkeep/';
  // baseAPI = 'https://development.reviews.upkeep.com.sa/upkeep/';
  // baseAPI = '192.168.1.2:8000/api/';
  // baseAPI = 'https://testing.reviews.upkeep.com.sa/upkeep/';
  // baseAPI = 'https://develop.reviews.upkeep.com.sa/upkeep/';
  // baseAPI = 'https://staging.upkeep.com.sa/upkeep/';
  // baseAPI = 'https://testupkeep.reviews.upkeep.com.sa/upkeep/';
  // baseAPI = 'https://develop.frontreviews.upkeep.com.sa/';

  // tslint:disable-next-line: no-inferrable-types
  token: string = '';
  // tslint:disable-next-line: no-inferrable-types
  baseUrl: string = '';
  superURL: string = '';

  constructor() {
    if (localStorage.getItem('currentUser')) {
      this.companySlug = JSON.parse(localStorage.getItem('currentUser'))[
        'company_slug'
      ];
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.token = currentUser.access_token;
      // this.companySlug = currentUser.company_slug;
      this.baseUrl = this.baseAPI + 'api/company/' + this.companySlug + '/';
    }
    this.superURL = this.baseAPI + 'api/';
  }
  getHttpHeader(): HttpHeaders {
    const header = new HttpHeaders({
      Authorization: 'Bearer ' + this.token,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
    return header;
  }
}
