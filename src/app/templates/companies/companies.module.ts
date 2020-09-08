import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AgmCoreModule } from '@agm/core';

import { ToolsModule } from './../../tools/tools.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import {
  MatInputModule,
  MatTableModule,
  MatSlideToggleModule,
  MatBadgeModule,
  MatMenuModule,
  MatPaginatorModule,
  MatSelectModule,
  MatCheckboxModule,
  MatGridListModule
} from '@angular/material';
import { CompaniesRoutingModule } from './companies-routing.module';
import { AllCompaniesComponent } from './all-companies/all-companies.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { CompanyCitiesComponent } from './company-cities/company-cities.component';



@NgModule({
  declarations: [
    AllCompaniesComponent,
    AddCompanyComponent,
    CompanyDetailsComponent,
    CompanyDashboardComponent,
    CompanyCitiesComponent
  ],
  imports: [
    //
    CommonModule,
    CompaniesRoutingModule,
    SharedComponentsModule,
    MatInputModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    CKEditorModule,
    ToolsModule,
    MatSlideToggleModule,
    NgxMaterialTimepickerModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatSelectModule,
    MatGridListModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB43NW6QmXMMqA8vv0iFmCKmklFcG4pofs',
      libraries: ['geometry', 'places']
    })
  ]
})
export class CompaniesModule { }
