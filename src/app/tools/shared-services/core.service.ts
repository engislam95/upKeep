import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from './headers.service';
@Injectable()
export class CoreService {
  constructor(
    private httpClient: HttpClient,
    private headersService: HeadersService
  ) { }
  /* --------------------------- Post Method -------------------------- */
  postMethod(url, data) {
    let baseURL;
    if (url !== 'tkn') {
      baseURL = this.headersService.baseUrl;
    } else {
      baseURL = this.headersService.baseAPI + 'api/';
    }
    if (url === 'logout') {
      baseURL = this.headersService.baseAPI + 'api/';
      return this.httpClient.post(baseURL + url, data, {
        headers: this.headersService.getHttpHeader(),
        params: { ...data }
      });
    }
    return this.httpClient.post(baseURL + url, data, {
      headers: this.headersService.getHttpHeader()
    });
  }
  /* --------------------------- Get Method -------------------------- */
  superPost(url, data) {
    let baseURL = this.headersService.superURL;
    return this.httpClient.post(baseURL + url, data, {
      headers: this.headersService.getHttpHeader()
    });
  }
  /* --------------------------- Get Method -------------------------- */
  getMethod(url, params?) {
    let baseURL;
    if (url === 'notifications') {
      baseURL = this.headersService.baseAPI + 'api/';
    } else {
      baseURL = this.headersService.baseUrl;
    }
    return this.httpClient.get(baseURL + url, {
      headers: this.headersService.getHttpHeader(),
      params: { ...params }
    });
  }
  /* --------------------------- Get Method -------------------------- */
  superGet(url, params?) {
    let baseURL = this.headersService.superURL;
    return this.httpClient.get(baseURL + url, {
      headers: this.headersService.getHttpHeader(),
      params: { ...params }
    });
  }
  /* --------------------------- Delete Method -------------------------- */
  deleteMethod(url) {
    return this.httpClient.delete(this.headersService.baseUrl + url, {
      headers: this.headersService.getHttpHeader()
    });
  }
  /* ---------------------- Put Method ----------------------- */
  updateMethod(url, data) {
    return this.httpClient.put(this.headersService.baseUrl + url, data, {
      headers: this.headersService.getHttpHeader()
    });
  }
  /* ------------------- Put Method -------------------------- */
  superUpdate(url, data) {
    let baseURL = this.headersService.superURL;
    return this.httpClient.put(baseURL + url, data, {
      headers: this.headersService.getHttpHeader()
    });
  }
  superDelete(url) {
    let baseURL = this.headersService.superURL;
    return this.httpClient.delete(baseURL + url, {
      headers: this.headersService.getHttpHeader()
    });
  }
}
