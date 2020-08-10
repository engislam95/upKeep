import { InvoiceSettingsComponent } from './invoice-settings/invoice-settings.component';
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
  MatTabsModule,
  MatSlideToggleModule,
  MatExpansionModule
} from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { InvoiceSettingsRoutingModule } from './invoice-settings-routing.module';

@NgModule({
  declarations: [InvoiceSettingsComponent],
  imports: [
    CommonModule,
    InvoiceSettingsRoutingModule,
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
    MatSlideToggleModule,
    MatRadioModule,
    MatExpansionModule
  ]
})
export class InvoiceSettingsModule {}
