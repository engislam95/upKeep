import { LocationsManagmentRoutingModule } from './locations-managment-routing.module';
import { LocationsManagmentComponent } from './locations-managment/locations-managment.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule, MatTabsModule, MatInputModule } from '@angular/material';


import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  declarations: [LocationsManagmentComponent],
  imports: [
    CommonModule,
    LocationsManagmentRoutingModule,
    MatTabsModule,
    MatInputModule,
    SharedComponentsModule,
    MatBadgeModule
  ]
})
export class LocationsManagmentModule { }
