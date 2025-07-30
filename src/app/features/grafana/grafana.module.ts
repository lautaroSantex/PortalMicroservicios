import { NgModule } from '@angular/core';
import { GrafanaRoutingModule } from './grafana-routing.module';
import { GrafanaMainComponent } from './pages/grafana-main/grafana-main.component';

@NgModule({
  imports: [
    GrafanaMainComponent,
    GrafanaRoutingModule
  ]
})
export class GrafanaModule { }