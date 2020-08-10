import { AddClassificationComponent } from './add-classification/add-classification.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllClassificationsComponent } from './all-classifications/all-classifications.component';
import { ClassificationDetailsComponent } from './classification-details/classification-details.component';

const routes: Routes = [
  { path: 'all-classifications', component: AllClassificationsComponent },
  { path: 'add-classification', component: AddClassificationComponent },
  { path: 'update-classification', component: AddClassificationComponent },
  { path: 'classification-details', component: ClassificationDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassificationsRoutingModule { }
