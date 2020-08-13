import { Injectable, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class HeadersService {
  // companySlug = 'upkeep';
  companySlug;
  // baseAPI = '/upkeep/';
  baseAPI = 'https://development.reviews.upkeep.com.sa/upkeep/';
  // baseAPI = '192.168.1.2:8000/api/';
  // baseAPI = 'https://testing.reviews.upkeep.com.sa/upkeep/';
  // baseAPI = 'https://test.upkeep.com.sa/upkeep/';
  // baseAPI = 'https://staging.upkeep.com.sa/upkeep/';
  // tslint:disable-next-line: no-inferrable-types
  token: string = '';
  // tslint:disable-next-line: no-inferrable-types
  baseUrl: string = '';
  superURL: string = '';
  constructor() {
    if (sessionStorage.getItem('currentUser')) {
      this.companySlug = JSON.parse(sessionStorage.getItem('currentUser'))[
        'company_slug'
      ];
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      this.token = currentUser.access_token;
      // this.companySlug = currentUser.company_slug;
      this.baseUrl = this.baseAPI + 'api/company/' + this.companySlug + '/';
      this.superURL = this.baseAPI + 'api/';
    }
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
