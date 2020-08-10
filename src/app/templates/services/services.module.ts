import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import {
  MatInputModule,
  MatSlideToggleModule,
  MatTableModule,
  MatCheckboxModule
} from '@angular/material';
import { AddServiceComponent } from './add-service/add-service.component';
import { AllServicesComponent } from './all-services/all-services.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PaginationService } from 'src/app/tools/shared-services/pagination.service';
import { SelectSearchService } from 'src/app/tools/shared-services/select-search.service';
import { AddSubServiceComponent } from './add-sub-service/add-sub-service.component';
import { AllInnerServicesComponent } from './all-sub-services/all-sub-services.component';
@NgModule({
  declarations: [
    AddServiceComponent,
    AllServicesComponent,
    AddSubServiceComponent,
    AllInnerServicesComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    SharedComponentsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTableModule,
    CKEditorModule
  ],
  providers: [PaginationService, SelectSearchService]
})
export class ServicesModule { }
