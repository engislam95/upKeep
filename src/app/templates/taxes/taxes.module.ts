import { AllTaxesComponent } from './all-taxes/all-taxes.component';
import { AddTaxComponent } from './add-tax/add-tax.component';
import { TaxesRoutingModule } from './taxes-routing.module';
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
    AddTaxComponent,
    AllTaxesComponent,
  ],
  imports: [
    CommonModule,
    TaxesRoutingModule,
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
export class TaxesModule { }
