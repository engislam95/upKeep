import { ClassificationsRoutingModule } from './classifications-routing.module';
import { AddClassificationComponent } from './add-classification/add-classification.component';
import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AgmCoreModule } from '@agm/core';

import { ToolsModule } from './../../tools/tools.module';
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
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { AllClassificationsComponent } from './all-classifications/all-classifications.component';
import { ClassificationDetailsComponent } from './classification-details/classification-details.component';

@NgModule({
  declarations: [
    AllClassificationsComponent,
    AddClassificationComponent,
    ClassificationDetailsComponent
  ],
  imports: [
    //
    CommonModule,
    ClassificationsRoutingModule,
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
export class ClassificationsModule {}
