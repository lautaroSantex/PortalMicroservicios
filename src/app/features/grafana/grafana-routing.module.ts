import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrafanaMainComponent } from './pages/grafana-main/grafana-main.component';

const routes: Routes = [
  {
    path: '',
    component: GrafanaMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrafanaRoutingModule { }