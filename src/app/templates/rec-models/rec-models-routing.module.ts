import { AddModelComponent } from './add-model/add-model.component';
import { AllModelsComponent } from './all-models/all-models.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  //
  { path: '', component: AllModelsComponent },
  { path: 'add-model', component: AddModelComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecModelsRoutingModule { }
