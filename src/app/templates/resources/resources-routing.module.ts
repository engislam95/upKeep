import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddResourceComponent } from './add-resource/add-resource.component';
import { AllResourcesComponent } from './all-resources/all-resources.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { ResourcesDetailsComponent } from './resources-details/resource-details.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';

const routes: Routes = [
  //
  { path: 'add-resource', component: AddResourceComponent },
  { path: 'update-resource', component: AddResourceComponent },
  { path: 'add-employee', component: AddEmployeeComponent },
  // { path: 'resource-details', component: ResourceDetailsComponent },
  { path: 'employee-details', component: EmployeeDetailsComponent },
  { path: 'all-resources', component: AllResourcesComponent },
  { path: 'resources-details', component: ResourcesDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourcesRoutingModule {}
