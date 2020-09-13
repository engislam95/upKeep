import { OwnerComponent } from './owner/owner.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material';

import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { OwnerRoutingModule } from './owner-routing.module';

@NgModule({
  declarations: [OwnerComponent ],
  imports: [
    CommonModule,
    OwnerRoutingModule,
    SharedComponentsModule,
    MatBadgeModule
  ]
})
export class OwnerModule { }
