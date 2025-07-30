import { NgModule } from '@angular/core';
import { VaultRoutingModule } from './vault-routing.module';
import { VaultMainComponent } from './pages/vault-main/vault-main.component';

@NgModule({
  imports: [
    VaultMainComponent,
    VaultRoutingModule
  ]
})
export class VaultModule { }