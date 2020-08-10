import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddTechnicalComponent } from './add-technical/add-technical.component';
import { AllTechniciansComponent } from './all-technicians/all-technicians.component';
import { TechnicalDetailsComponent } from './technical-details/technical-details.component';

const routes: Routes = [
  //
  { path: 'add-technical', component: AddTechnicalComponent },
  { path: 'update-technical', component: AddTechnicalComponent },
  { path: 'technical-details', component: TechnicalDetailsComponent },
  { path: 'all-technicians', component: AllTechniciansComponent },
  { path: 'technicians_details', component: TechnicalDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechniciansRoutingModule {}
