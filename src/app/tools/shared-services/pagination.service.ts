import { Injectable } from '@angular/core';

@Injectable()
export class PaginationService {
  checkPaginationButtons(pageId, arrayLength) {
    let firstPage;
    let lastPage;
    // Length 0 or 1
    if (pageId === 1 && arrayLength <= 1) {
      // first page
      firstPage = true;
      lastPage = true;
    }
    // Length 0 or 1
    // Length 2
    if (pageId === 1 && arrayLength === 2) {
      // first page
      firstPage = true;
      lastPage = false;
    }
    if (pageId === 2 && arrayLength === 2) {
      // last page
      firstPage = false;
      lastPage = true;
    }
    // Length 2
    // Length more than 2
    if (pageId === 1 && arrayLength > 2) {
      firstPage = true;
      lastPage = false;
    }
    if (pageId === 2 && arrayLength > 2) {
      firstPage = false;
      lastPage = false;
    }
    if (pageId === arrayLength && arrayLength > 2) {
      firstPage = false;
      lastPage = true;
    }
    // Length more than 2
    return [firstPage, lastPage];
  }
}
