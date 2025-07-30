import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface ConsulService {
  id: string;
  name: string;
  address: string;
  port: number;
  status: 'passing' | 'warning' | 'critical';
  tags: string[];
  checks: number;
  lastSeen: string;
}

interface ConsulNode {
  name: string;
  address: string;
  datacenter: string;
  status: 'alive' | 'left' | 'failed';
  services: number;
}

@Component({
  selector: 'app-consul-main',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule
  ],
  templateUrl: './consul-main.component.html',
  styleUrls: ['./consul-main.component.scss']
})
export class ConsulMainComponent implements OnInit {

  services: ConsulService[] = [
    {
      id: 'user-service-1',
      name: 'user-service',
      address: '10.0.1.10',
      port: 8081,
      status: 'passing',
      tags: ['http', 'users', 'v1.0'],
      checks: 2,
      lastSeen: '2 min ago'
    },
    {
      id: 'payment-service-1',
      name: 'payment-service',
      address: '10.0.1.11',
      port: 8082,
      status: 'passing',
      tags: ['http', 'payments', 'v2.1'],
      checks: 3,
      lastSeen: '1 min ago'
    },
    {
      id: 'notification-service-1',
      name: 'notification-service',
      address: '10.0.1.12',
      port: 8083,
      status: 'warning',
      tags: ['http', 'notifications', 'v1.5'],
      checks: 1,
      lastSeen: '5 min ago'
    },
    {
      id: 'auth-service-1',
      name: 'auth-service',
      address: '10.0.1.13',
      port: 8084,
      status: 'passing',
      tags: ['http', 'auth', 'jwt', 'v3.0'],
      checks: 4,
      lastSeen: '30 sec ago'
    },
    {
      id: 'api-gateway-1',
      name: 'api-gateway',
      address: '10.0.1.14',
      port: 8080,
      status: 'passing',
      tags: ['http', 'gateway', 'v2.0'],
      checks: 2,
      lastSeen: '1 min ago'
    }
  ];

  nodes: ConsulNode[] = [
    {
      name: 'consul-node-1',
      address: '10.0.1.20',
      datacenter: 'dc1',
      status: 'alive',
      services: 3
    },
    {
      name: 'consul-node-2',
      address: '10.0.1.21',
      datacenter: 'dc1',
      status: 'alive',
      services: 2
    },
    {
      name: 'consul-node-3',
      address: '10.0.1.22',
      datacenter: 'dc1',
      status: 'alive',
      services: 4
    }
  ];

  consulUrl = 'http://consul.company.local:8500';
  selectedTab = 'services'; // 'services' | 'nodes' | 'kv'

  constructor() { }

  ngOnInit(): void {
  }

  openConsulUI(): void {
    window.open(this.consulUrl, '_blank');
  }

  refreshServices(): void {
    console.log('Refreshing Consul services...');
    // Aquí implementarías la lógica para refrescar los servicios
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'passing':
      case 'alive':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
      case 'failed':
        return 'text-red-500';
      case 'left':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'passing':
      case 'alive':
        return 'check';
      case 'warning':
        return 'alert-triangle';
      case 'critical':
      case 'failed':
        return 'alert-triangle';
      case 'left':
        return 'help-circle';
      default:
        return 'help-circle';
    }
  }

  viewServiceDetails(serviceId: string): void {
    console.log('Viewing service details:', serviceId);
    // Aquí navegarías a la vista de detalles del servicio
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  getHealthyServicesCount(): number {
    return this.services.filter(s => s.status === 'passing').length;
  }

  getWarningServicesCount(): number {
    return this.services.filter(s => s.status === 'warning').length;
  }

  getCriticalServicesCount(): number {
    return this.services.filter(s => s.status === 'critical').length;
  }
}