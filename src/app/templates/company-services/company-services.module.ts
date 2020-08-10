import { AllSubServicesComponent } from './all-sub-services/all-sub-services.component';
import { AllMainServicesComponent } from './all-main-services/all-main-services.component';
import { CompanyServicesRoutingModule } from './company-services-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import {
  MatInputModule,
  MatSlideToggleModule,
  MatTableModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PaginationService } from 'src/app/tools/shared-services/pagination.service';
import { SelectSearchService } from 'src/app/tools/shared-services/select-search.service';

@NgModule({
  declarations: [
    AllMainServicesComponent,
    AllSubServicesComponent,
  ],
  imports: [
    CommonModule,
    CompanyServicesRoutingModule,
    SharedComponentsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule,
    CKEditorModule
  ],
  providers: [PaginationService, SelectSearchService]
})
export class CompanyServicesModule { }
