import { TemplateOneComponent } from './template-one/template-one.component';
import { AddTemplateComponent } from './add-template/add-template.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  //
  { path: '', component: AddTemplateComponent },
  { path: 'template-one', component: TemplateOneComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecTemplatesRoutingModule { }
