import { Routes } from '@angular/router';
import { DashboardMainComponent } from './features/dashboard/pages/dashboard-main/dashboard-main.component';
import { GrafanaMainComponent } from './features/grafana/pages/grafana-main/grafana-main.component';
import { ConsulMainComponent } from './features/consul/pages/consul-main/consul-main.component';
import { VaultMainComponent } from './features/vault/pages/vault-main/vault-main.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardMainComponent
  },
  {
    path: 'grafana',
    component: GrafanaMainComponent
  },
  {
    path: 'consul',
    component: ConsulMainComponent
  },
  {
    path: 'vault',
    component: VaultMainComponent
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];