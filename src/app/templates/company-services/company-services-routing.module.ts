import { AllMainServicesComponent } from './all-main-services/all-main-services.component';
import { AllSubServicesComponent } from './all-sub-services/all-sub-services.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'all-main-services' },
  { path: 'all-sub-services', component: AllSubServicesComponent },
  { path: 'all-main-services', component: AllMainServicesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyServicesRoutingModule { }
