import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface Dashboard {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  status: 'active' | 'inactive';
  panels: number;
}

@Component({
  selector: 'app-grafana-main',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule
  ],
  templateUrl: './grafana-main.component.html',
  styleUrls: ['./grafana-main.component.scss']
})
export class GrafanaMainComponent implements OnInit {

  dashboards: Dashboard[] = [
    {
      id: 'system-overview',
      name: 'Sistema General',
      description: 'Métricas generales del sistema y infraestructura',
      lastUpdated: '5 min ago',
      status: 'active',
      panels: 12
    },
    {
      id: 'api-gateway',
      name: 'API Gateway',
      description: 'Monitoreo del gateway principal y rutas',
      lastUpdated: '2 min ago',
      status: 'active',
      panels: 8
    },
    {
      id: 'database-metrics',
      name: 'Base de Datos',
      description: 'Rendimiento y conexiones de bases de datos',
      lastUpdated: '1 min ago',
      status: 'active',
      panels: 15
    },
    {
      id: 'microservices',
      name: 'Microservicios',
      description: 'Métricas individuales de cada microservicio',
      lastUpdated: '3 min ago',
      status: 'active',
      panels: 20
    },
    {
      id: 'infrastructure',
      name: 'Infraestructura',
      description: 'CPU, memoria, disco y red de servidores',
      lastUpdated: '10 min ago',
      status: 'active',
      panels: 10
    },
    {
      id: 'applications',
      name: 'Aplicaciones',
      description: 'Métricas de aplicaciones y servicios externos',
      lastUpdated: '15 min ago',
      status: 'inactive',
      panels: 6
    }
  ];

  grafanaUrl = 'http://grafana.company.local:3000';

  constructor() { }

  ngOnInit(): void {
  }

  openGrafana(): void {
    window.open(this.grafanaUrl, '_blank');
  }

  openDashboard(dashboardId: string): void {
    const url = `${this.grafanaUrl}/d/${dashboardId}`;
    window.open(url, '_blank');
  }

  refreshDashboards(): void {
    console.log('Refreshing Grafana dashboards...');
    // Aquí implementarías la lógica para refrescar los dashboards
  }

  getTotalPanels(): number {
    return this.dashboards.reduce((total, dashboard) => total + dashboard.panels, 0);
  }

  getActiveDashboardsCount(): number {
    return this.dashboards.filter(d => d.status === 'active').length;
  }
}