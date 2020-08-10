import { UserDetailsComponent } from './user-details/user-details.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  //
  { path: 'all-users', component: AllUsersComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'update-user', component: AddUserComponent },
  { path: 'user-details', component: UserDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
