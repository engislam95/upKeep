import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsModule } from '../../tools/tools.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {
  MatInputModule,
  MatSlideToggleModule,
  MatTableModule,
  MatCheckboxModule
} from '@angular/material';
import { AddClientComponent } from './add-client/add-client.component';
import { AllClientsComponent } from './all-clients/all-clients.component';
import { AddNewMapComponent } from './add-new-map/add-new-map.component';
import { ClientsGroupComponent } from './clients-group/clients-group.component';

@NgModule({
  declarations: [
    ClientDetailsComponent,
    AddClientComponent,
    AllClientsComponent,
    AddNewMapComponent,
    ClientsGroupComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    SharedComponentsModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTableModule,
    ToolsModule,
    NgxMaterialTimepickerModule,
    MatCheckboxModule,
    MatTooltipModule
  ]
})
export class ClientsModule {}
