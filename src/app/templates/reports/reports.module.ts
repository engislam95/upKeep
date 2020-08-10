import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from './../../components/shared-components.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ToolsModule } from './../../tools/tools.module';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ChartModule } from 'primeng/chart';
import {
  MatInputModule,
  MatTableModule,
  MatCheckboxModule,
  MatBadgeModule,
  MatSlideToggleModule,
  MatTabsModule
} from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/all-reports.component';
import { MatPaginatorModule } from '@angular/material';

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedComponentsModule,
    ColorPickerModule,
    ChartModule,
    MatPaginatorModule,
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
export class ReportsModule {}
