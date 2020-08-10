import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule } from '@angular/material';
import { AlifeFileToBase64Module } from 'alife-file-to-base64';

import { OnlyNumbersDirective } from './shared_directives/only-numbers.directive';
import { HeadersService } from './shared-services/headers.service';
import { LoaderService } from './shared-services/loader.service';
import { ResponseStateService } from './shared-services/response-state.service';
import { CoreService } from './shared-services/core.service';
import { PaginationService } from './shared-services/pagination.service';
import { SelectSearchService } from './shared-services/select-search.service';

@NgModule({
  declarations: [OnlyNumbersDirective],
  imports: [CommonModule, HttpClientModule, MatAutocompleteModule],
  exports: [
    //
    OnlyNumbersDirective,
    HttpClientModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    AlifeFileToBase64Module
  ],
  providers: [HeadersService, LoaderService, ResponseStateService, CoreService, PaginationService, SelectSearchService]
})
export class ToolsModule {}
