import { AddBlockComponent } from './add-block/add-block.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllBlockComponent } from './all-blocks/all-blocks.component';

const routes: Routes = [
  //
  { path: '', component: AllBlockComponent },
  { path: 'add-block', component: AddBlockComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlockRoutingModule { }
