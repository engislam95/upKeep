import { SystemOffComponent } from './system-off/system-off.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material';

import { SharedComponentsModule } from '../../components/shared-components.module'
import { SystemOffRoutingModule } from './system-off-routing.module';

@NgModule({
  declarations: [SystemOffComponent ],
  imports: [
    CommonModule,
    SystemOffRoutingModule,
    SharedComponentsModule,
    MatBadgeModule
  ]
})
export class SystemOffModule { }
