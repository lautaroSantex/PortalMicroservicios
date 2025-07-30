import { Component } from '@angular/core';
import { LayoutComponent } from './shared/components/layout/layout.component';
// Importar todos los componentes para precarga
import { DashboardMainComponent } from './features/dashboard/pages/dashboard-main/dashboard-main.component';
import { GrafanaMainComponent } from './features/grafana/pages/grafana-main/grafana-main.component';
import { ConsulMainComponent } from './features/consul/pages/consul-main/consul-main.component';
import { VaultMainComponent } from './features/vault/pages/vault-main/vault-main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LayoutComponent,
    // Precargar todos los componentes
    DashboardMainComponent,
    GrafanaMainComponent,
    ConsulMainComponent,
    VaultMainComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'microservices-portal';
}