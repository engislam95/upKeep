import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* -------------------- Angular Material -------------------- */
import { MatBadgeModule } from '@angular/material';
/* ----------------------- Routing Module ---------------------- */
import { HomeRoutingModule } from './home-routing.module';
/* ------------------- Components --------------------- */
import { HomePageComponent } from './home-page/home-page.component';
/* ------------------- Sharing Module --------------------------- */
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedComponentsModule,
    MatBadgeModule
  ]
})
export class HomeModule { }
