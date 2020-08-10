import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ToolsModule } from '../../tools/tools.module';

import { OffersRoutingModule } from './offers-routing.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MatInputModule, MatSlideToggleModule, MatTableModule } from '@angular/material';
import { AllOffersComponent } from './all-offers/all-offers.component';
import { AddOfferComponent } from './add-offer/add-offer.component';
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import { AvailableOffersComponent } from './available-offers/available-offers.component';

@NgModule({
  declarations: [AllOffersComponent, AddOfferComponent, OfferDetailsComponent, AvailableOffersComponent],
  imports: [
    //
    CommonModule,
    OffersRoutingModule,
    SharedComponentsModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTableModule,
    CKEditorModule,
    ToolsModule
  ]
})
export class OffersModule {}
