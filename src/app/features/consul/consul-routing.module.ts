import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsulMainComponent } from './pages/consul-main/consul-main.component';

const routes: Routes = [
  {
    path: '',
    component: ConsulMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsulRoutingModule { }