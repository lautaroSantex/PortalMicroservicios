import { NgModule } from '@angular/core';
import { ConsulRoutingModule } from './consul-routing.module';
import { ConsulMainComponent } from './pages/consul-main/consul-main.component';

@NgModule({
  imports: [
    ConsulMainComponent,
    ConsulRoutingModule
  ]
})
export class ConsulModule { }