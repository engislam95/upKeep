import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

import { TechniciansRoutingModule } from './technicians-routing.module';
import { MatTableModule, MatInputModule, MatSlideToggleModule } from '@angular/material';
import { AddTechnicalComponent } from './add-technical/add-technical.component';
import { AllTechniciansComponent } from './all-technicians/all-technicians.component';
import { TechnicalDetailsComponent } from './technical-details/technical-details.component';
import { ToolsModule } from 'src/app/tools/tools.module';
import { RatingModule } from 'ngx-bootstrap/rating';

@NgModule({
  declarations: [AddTechnicalComponent, AllTechniciansComponent, TechnicalDetailsComponent],
  imports: [
    //
    CommonModule,
    TechniciansRoutingModule,
    SharedComponentsModule,
    ToolsModule,
    MatInputModule,
    MatTableModule,
    MatSlideToggleModule ,
    RatingModule.forRoot()
  ]
})
export class TechniciansModule {}
