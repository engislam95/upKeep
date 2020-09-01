import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemOffComponent } from './system-off/system-off.component';

const routes: Routes = [{ path: '', component: SystemOffComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemOffRoutingModule { }
