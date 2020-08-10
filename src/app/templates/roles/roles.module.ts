import { RoleDetailsComponent } from './role-details/role-details.component';
import { AllRolesComponent } from './all-roles/all-roles.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

import { RolesRoutingModule } from './roles-routing.module';
import { MatTableModule, MatInputModule, MatSlideToggleModule } from '@angular/material';
import { ToolsModule } from 'src/app/tools/tools.module';
import { AddTRoleComponent } from './add-role/add-role.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


@NgModule({
  declarations: [AddTRoleComponent, AllRolesComponent, RoleDetailsComponent],
  imports: [
    //
    CommonModule,
    RolesRoutingModule,
    CKEditorModule,
    SharedComponentsModule,
    ToolsModule,
    MatInputModule,
    MatTableModule,
    MatSlideToggleModule
  ]
})
export class RolesModule { }
