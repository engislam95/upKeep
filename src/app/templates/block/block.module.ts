import { AddBlockComponent } from './add-block/add-block.component';
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
import { BlockRoutingModule } from './block-routing.module';
import { AllBlockComponent } from './all-blocks/all-blocks.component';



@NgModule({
  declarations: [
    AddBlockComponent,
    AllBlockComponent,
  ],
  imports: [
    CommonModule,
    BlockRoutingModule,
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
    MatRadioModule, MatExpansionModule
  ]
})
export class BlockModule { }
