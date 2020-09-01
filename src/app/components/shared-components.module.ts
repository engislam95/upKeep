import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
/* ------------------- Serivces ------------------------ */
import { LoaderService } from '../tools/shared-services/loader.service';
import { ResponseStateService } from '../tools/shared-services/response-state.service';
/* ------------------- Components ------------------------ */
import { SideMenuMgtComponent } from './side-menu-mgt/side-menu-mgt.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { SideMenuOwnerComponent } from './side-menu-owner/side-menu-owner.component';
import { HeaderComponent } from './header/header.component';
import { HeaderOwnerComponent } from './header-owner/header-owner.component';
import { AlertsComponent } from './alerts/alerts.component';
import { MultiselectFilterComponent } from './multiselect-filter/multiselect-filter.component';
import { MapComponent } from './map/map.component';
import { SystemManagmentComponent } from './system-managment/system-managment.component'
import { SystemOffComponent } from './system-off/system-off.component'

/* -------------------- Angular Material ----------------------- */
import {
  MatProgressBarModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatAutocompleteModule
} from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
/* -------------------- Ngx TimePicker ---------------------- */
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
/* --------------- Map ----------------- */
import { AgmCoreModule } from '@agm/core';
@NgModule({
  declarations: [
    SideMenuComponent,
    MultiselectFilterComponent,
    SideMenuOwnerComponent,
    SideMenuMgtComponent,
    HeaderComponent,
    HeaderOwnerComponent,
    AlertsComponent,
    MapComponent ,
    SystemManagmentComponent ,
    SystemOffComponent
  ],
  exports: [
    ReactiveFormsModule,
    SideMenuMgtComponent,
    SideMenuOwnerComponent,
    HeaderOwnerComponent,
    FormsModule,
    MatAutocompleteModule,
    MatSelectModule,
    SideMenuComponent,
    HeaderComponent,
    AlertsComponent,
    MultiselectFilterComponent,
    SystemOffComponent ,
    MapComponent,
    SystemManagmentComponent ,
    SystemOffComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatAutocompleteModule,
    NgxMaterialTimepickerModule,
    AgmCoreModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCW4r_HcOqZfIGdz-ZxvFUE1R1AwpTZKBs',
      // apiKey: 'AIzaSyChTEPD15j3gS_5Z7ABhWkghruAxH0mmh0',
      libraries: ['geometry', 'places']
    })
  ],
  providers: [LoaderService, ResponseStateService]
})
export class SharedComponentsModule { }
