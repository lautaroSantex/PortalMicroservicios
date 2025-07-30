import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardMainComponent } from './pages/dashboard-main/dashboard-main.component';

@NgModule({
  imports: [
    DashboardMainComponent,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }