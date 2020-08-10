import { ChartsComponent } from './charts/all-charts.component';
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
import { ChartsRoutingModule } from './charts-routing.module';
import { MatPaginatorModule } from '@angular/material';

@NgModule({
  declarations: [ChartsComponent],
  imports: [
    CommonModule,
    ChartsRoutingModule,
    SharedComponentsModule,
    MatPaginatorModule,
    ColorPickerModule,
    ChartModule,
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
export class ChartsModule {}
