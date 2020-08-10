import { RecModelsRoutingModule } from './rec-models-routing.module';
import { AllModelsComponent } from './all-models/all-models.component';
import { AddModelComponent } from './add-model/add-model.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from './../../components/shared-components.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ToolsModule } from './../../tools/tools.module';
import { ColorPickerModule } from 'primeng/colorpicker';
import {
  MatInputModule,
  MatTableModule,
  MatCheckboxModule,
  MatBadgeModule,
  MatSlideToggleModule,
  MatTabsModule
} from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';



@NgModule({
  declarations: [
    AddModelComponent,
    AllModelsComponent,
  ],
  imports: [
    CommonModule,
    RecModelsRoutingModule,
    SharedComponentsModule,
    ColorPickerModule,
    MatTabsModule,
    MatRadioModule,
    MatInputModule,
    MatTableModule,
    CKEditorModule,
    ToolsModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatSlideToggleModule
  ]
})
export class RecModelsModule { }
