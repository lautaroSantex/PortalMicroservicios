import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tool {
  name: string;
  url: string;
  description: string;
}

interface Project {
  key: string;
  name: string;
  description: string;
  icon: string;
  tools: { [key: string]: Tool };
}

@Component({
  selector: 'app-dashboard-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.scss']
})
export class DashboardMainComponent implements OnInit {

  selectedProject: string | null = null;

  // Configuración de proyectos disponibles
  projects: Project[] = [
    {
      key: 'apilink',
      name: 'ApiLink',
      description: 'API Gateway y servicios principales',
      icon: '🔗',
      tools: {
        grafana: {
          name: 'Grafana',
          url: 'http://apilink-grafana.com:3000',
          description: 'Dashboard de monitoreo ApiLink'
        },
        consul: {
          name: 'Consul',
          url: 'http://10.172.13.72:8500/ui/dc1/services/ApiLink/instances',
          description: 'Service discovery ApiLink'
        },
        vault: {
          name: 'Vault',
          url: 'http://	10.172.13.76:8200',
          description: 'Gestión de secretos ApiLink'
        },
        HealthCheck: {
          name: 'Healt Check',
          url: 'http://10.172.13.71:7209/health-ui',
          description: 'Health Check ApiLink'
        },
        kubernetes: {
          name: 'Kubernetes Dashboard',
          url: '10.172.13.33/',
          description: 'Cluster Kubernetes ApiLink'
        },
        portalLink: {
          name: 'portalLink',
          url: 'http://10.172.13.77',
          description: 'portalLink'
        }
      }
    },
    {
      key: 'HB Judiciales',
      name: 'HB Judiciales',
      description: 'Home banking judiciales',
      icon: '💳',
      tools: {
        grafana: {
          name: 'Grafana',
          url: 'http://payments-grafana.com:3000',
          description: 'Dashboard de monitoreo Payments'
        },
        consul: {
          name: 'Consul',
          url: 'http://payments-consul.com:8500',
          description: 'Service discovery Payments'
        },
        vault: {
          name: 'Vault',
          url: 'http://payments-vault.com:8200',
          description: 'Gestión de secretos Payments'
        },
        jenkins: {
          name: 'Jenkins',
          url: 'http://payments-jenkins.com:8080',
          description: 'CI/CD Pipeline Payments'
        },
        kubernetes: {
          name: 'Kubernetes Dashboard',
          url: 'http://payments-k8s.com',
          description: 'Cluster Kubernetes Payments'
        },
        prometheus: {
          name: 'Prometheus',
          url: 'http://payments-prometheus.com:9090',
          description: 'Métricas Payments'
        }
      }
    },
    {
      key: 'Renaper',
      name: 'Renaper',
      description: 'Gestión de usuarios y autenticación',
      icon: '👥',
      tools: {
        grafana: {
          name: 'Grafana',
          url: 'http://users-grafana.com:3000',
          description: 'Dashboard de monitoreo Users'
        },
        consul: {
          name: 'Consul',
          url: 'http://users-consul.com:8500',
          description: 'Service discovery Users'
        },
        vault: {
          name: 'Vault',
          url: 'http://users-vault.com:8200',
          description: 'Gestión de secretos Users'
        },
        jenkins: {
          name: 'Jenkins',
          url: 'http://users-jenkins.com:8080',
          description: 'CI/CD Pipeline Users'
        },
        kubernetes: {
          name: 'Kubernetes Dashboard',
          url: 'http://users-k8s.com',
          description: 'Cluster Kubernetes Users'
        },
        prometheus: {
          name: 'Prometheus',
          url: 'http://users-prometheus.com:9090',
          description: 'Métricas Users'
        }
      }
    },
    {
      key: 'notifications',
      name: 'Notifications Service',
      description: 'Sistema de notificaciones y mensajería',
      icon: '📧',
      tools: {
        grafana: {
          name: 'Grafana',
          url: 'http://notifications-grafana.com:3000',
          description: 'Dashboard de monitoreo Notifications'
        },
        consul: {
          name: 'Consul',
          url: 'http://notifications-consul.com:8500',
          description: 'Service discovery Notifications'
        },
        vault: {
          name: 'Vault',
          url: 'http://notifications-vault.com:8200',
          description: 'Gestión de secretos Notifications'
        },
        jenkins: {
          name: 'Jenkins',
          url: 'http://notifications-jenkins.com:8080',
          description: 'CI/CD Pipeline Notifications'
        },
        kubernetes: {
          name: 'Kubernetes Dashboard',
          url: 'http://notifications-k8s.com',
          description: 'Cluster Kubernetes Notifications'
        },
        prometheus: {
          name: 'Prometheus',
          url: 'http://notifications-prometheus.com:9090',
          description: 'Métricas Notifications'
        }
      }
    }
  ];

  constructor() {
    console.log('🚀 Dashboard constructor - selectedProject:', this.selectedProject);
  }

  ngOnInit(): void {
    // IMPORTANTE: Forzar a null para mostrar el selector
    this.selectedProject = null;
    console.log('📋 ngOnInit - selectedProject forzado a:', this.selectedProject);
  }

  /**
   * Selecciona un proyecto específico
   * @param projectKey - Clave del proyecto a seleccionar
   */
  selectProject(projectKey: string): void {
    this.selectedProject = projectKey;
    console.log(`✅ Proyecto seleccionado: ${projectKey}`);
  }

  /**
   * Limpia la selección de proyecto y vuelve al selector
   */
  clearProjectSelection(): void {
    this.selectedProject = null;
    console.log('🔄 Selección de proyecto limpiada');
  }

  /**
   * Obtiene el nombre del proyecto seleccionado
   * @returns Nombre del proyecto o cadena vacía
   */
  getSelectedProjectName(): string {
    if (!this.selectedProject) return '';
    const project = this.projects.find(p => p.key === this.selectedProject);
    return project ? project.name : '';
  }

  /**
   * Abre la herramienta seleccionada del proyecto actual
   * @param toolKey - Clave de la herramienta a abrir
   */
  openTool(toolKey: string): void {
    if (!this.selectedProject) {
      console.error('❌ No hay proyecto seleccionado');
      return;
    }

    const project = this.projects.find(p => p.key === this.selectedProject);
    if (!project) {
      console.error(`❌ Proyecto no encontrado: ${this.selectedProject}`);
      return;
    }

    const tool = project.tools[toolKey];
    if (tool) {
      // Abrir en nueva pestaña
      window.open(tool.url, '_blank', 'noopener,noreferrer');
      
      // Log para debugging
      console.log(`🔗 Abriendo ${tool.name} del proyecto ${project.name}: ${tool.url}`);
    } else {
      console.error(`❌ Herramienta no encontrada: ${toolKey} en proyecto ${project.name}`);
    }
  }

  /**
   * Método opcional para agregar nuevos proyectos dinámicamente
   * @param project - Configuración del proyecto
   */
  addProject(project: Project): void {
    this.projects.push(project);
  }

  /**
   * Obtener todos los proyectos disponibles
   * @returns Array de proyectos
   */
  getAllProjects(): Project[] {
    return this.projects;
  }
}