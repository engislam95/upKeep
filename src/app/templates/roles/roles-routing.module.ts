import { RoleDetailsComponent } from './role-details/role-details.component';
import { AddTRoleComponent } from './add-role/add-role.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllRolesComponent } from './all-roles/all-roles.component';

const routes: Routes = [
  //
  { path: 'add-role', component: AddTRoleComponent },
  { path: 'update-role', component: AddTRoleComponent },
  { path: 'role-details', component: RoleDetailsComponent },
  { path: 'all-roles', component: AllRolesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
