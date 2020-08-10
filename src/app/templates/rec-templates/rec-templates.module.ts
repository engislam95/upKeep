import { RecTemplatesRoutingModule } from './rec-templates-routing.module';
import { TemplateOneComponent } from './template-one/template-one.component';
import { AddTemplateComponent } from './add-template/add-template.component';
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
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    AddTemplateComponent,
    TemplateOneComponent,
  ],
  imports: [
    CommonModule,
    RecTemplatesRoutingModule,
    SharedComponentsModule,
    ColorPickerModule,
    ModalModule.forRoot(),
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
export class RecTemplatesModule { }
