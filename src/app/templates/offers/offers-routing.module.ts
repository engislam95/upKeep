import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllOffersComponent } from './all-offers/all-offers.component';
import { AddOfferComponent } from './add-offer/add-offer.component';
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import { AvailableOffersComponent } from './available-offers/available-offers.component';

const routes: Routes = [
  //
  { path: 'all-offers', component: AllOffersComponent },
  { path: 'offer-details', component: OfferDetailsComponent },
  { path: 'add-offer', component: AddOfferComponent },
  { path: 'update-offer', component: AddOfferComponent },
  { path: 'available-offers', component: AvailableOffersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffersRoutingModule {}
