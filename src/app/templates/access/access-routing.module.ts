import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/* ---------------- Component ----------------------- */
import { LoginComponent } from './login/login.component';

/* ------------------ Routes ------------------------- */
const routes: Routes = [{ path: 'login', component: LoginComponent }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessRoutingModule { }
