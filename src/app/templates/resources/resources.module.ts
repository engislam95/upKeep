import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsModule } from '../../tools/tools.module';

import { ResourcesRoutingModule } from './resources-routing.module';
import { AllResourcesComponent } from './all-resources/all-resources.component';
import { AddResourceComponent } from './add-resource/add-resource.component';
import { SharedComponentsModule } from '../../components/shared-components.module';
import {
  MatInputModule,
  MatTableModule,
  MatSlideToggleModule,
  MatCheckboxModule,
  MAT_CHECKBOX_CLICK_ACTION
} from '@angular/material';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { ResourcesDetailsComponent } from './resources-details/resource-details.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';

@NgModule({
  declarations: [
    AllResourcesComponent,
    AddResourceComponent,
    AddEmployeeComponent,
    ResourcesDetailsComponent,
    EmployeeDetailsComponent
  ],
  imports: [
    //
    CommonModule,
    ResourcesRoutingModule,
    SharedComponentsModule,
    MatInputModule,
    MatTableModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    ToolsModule
  ],
  providers: [{ provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check' }]
})
export class ResourcesModule {}
