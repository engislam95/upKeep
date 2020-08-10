import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllCompaniesComponent } from './all-companies/all-companies.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { CompanyCitiesComponent } from './company-cities/company-cities.component';

const routes: Routes = [
  { path: 'all-companies', component: AllCompaniesComponent },
  { path: 'add-company', component: AddCompanyComponent },
  { path: 'update-company', component: AddCompanyComponent },
  { path: 'company-details', component: CompanyDetailsComponent },
  { path: 'company-dashboard', component: CompanyDashboardComponent },
  { path: 'company-cities', component: CompanyCitiesComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule { }
