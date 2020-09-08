import { UserDetailsComponent } from './user-details/user-details.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AgmCoreModule } from '@agm/core';

import { ToolsModule } from './../../tools/tools.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import {
  MatInputModule,
  MatTableModule,
  MatSlideToggleModule,
  MatBadgeModule,
  MatMenuModule,
  MatPaginatorModule,
  MatSelectModule,
  MatCheckboxModule,
  MatGridListModule
} from '@angular/material';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [
    AllUsersComponent,
    AddUserComponent,
    UserDetailsComponent,
  ],
  imports: [
    //
    CommonModule,
    UsersRoutingModule,
    SharedComponentsModule,
    MatInputModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    CKEditorModule,
    ToolsModule,
    MatSlideToggleModule,
    NgxMaterialTimepickerModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatSelectModule,
    MatGridListModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB43NW6QmXMMqA8vv0iFmCKmklFcG4pofs',
      libraries: ['geometry', 'places']
    })
  ]
})
export class UsersModule { }
