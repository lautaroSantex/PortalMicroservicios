import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaultMainComponent } from './pages/vault-main/vault-main.component';

const routes: Routes = [
  {
    path: '',
    component: VaultMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VaultRoutingModule { }