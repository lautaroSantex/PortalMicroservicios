import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project, Tool } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private currentProjectSubject = new BehaviorSubject<Project | null>(null);
  public currentProject$ = this.currentProjectSubject.asObservable();

  private projects: Project[] = [
    {
      key: 'apilink',
      name: 'ApiLink',
      description: 'API Gateway y servicios principales',
      icon: '🔗',
      status: 'active',
      tools: {
        grafana: {
          name: 'Grafana',
          url: 'http://apilink-grafana.com:3000',
          description: 'Dashboard de monitoreo ApiLink',
          category: 'monitoring'
        },
        consul: {
          name: 'Consul',
          url: 'http://10.172.13.72:8500/ui/dc1/services/ApiLink/instances',
          description: 'Service discovery ApiLink',
          category: 'infrastructure'
        },
        vault: {
          name: 'Vault',
          url: 'http://10.172.13.76:8200',
          description: 'Gestión de secretos ApiLink',
          category: 'security'
        },
        healthCheck: {
          name: 'Health Check',
          url: 'http://10.172.13.71:7209/health-ui',
          description: 'Health Check ApiLink',
          category: 'monitoring'
        },
        kubernetes: {
          name: 'Kubernetes Dashboard',
          url: 'http://10.172.13.33/',
          description: 'Cluster Kubernetes ApiLink',
          category: 'infrastructure'
        },
        portalLink: {
          name: 'Portal Link',
          url: 'http://10.172.13.77',
          description: 'Portal Link Application',
          category: 'application'
        }
      },
      metrics: {
        uptime: 99.9,
        responseTime: 120,
        errorRate: 0.1
      }
    },
    {
      key: 'hb-judiciales',
      name: 'HB Judiciales',
      description: 'Home banking judiciales',
      icon: '💳',
      status: 'active',
      tools: {
        grafana: {
          name: 'Grafana',
          url: 'http://payments-grafana.com:3000',
          description: 'Dashboard de monitoreo HB Judiciales',
          category: 'monitoring'
        },
        consul: {
          name: 'Consul',
          url: 'http://payments-consul.com:8500',
          description: 'Service discovery HB Judiciales',
          category: 'infrastructure'
        },
        vault: {
          name: 'Vault',
          url: 'http://payments-vault.com:8200',
          description: 'Gestión de secretos HB Judiciales',
          category: 'security'
        },
        healthCheck: {
          name: 'Health Check',
          url: 'http://payments-jenkins.com:8080',
          description: 'Health Check HB Judiciales',
          category: 'monitoring'
        },
        kubernetes: {
          name: 'Kubernetes Dashboard',
          url: 'http://payments-k8s.com',
          description: 'Cluster Kubernetes HB Judiciales',
          category: 'infrastructure'
        },
        portalLink: {
          name: 'Portal HB',
          url: 'http://payments-portal.com',
          description: 'Portal HB Judiciales',
          category: 'application'
        }
      },
      metrics: {
        uptime: 99.5,
        responseTime: 200,
        errorRate: 0.5
      }
    },
    {
      key: 'renaper',
      name: 'Renaper',
      description: 'Gestión de usuarios y autenticación',
      icon: '👥',
      status: 'maintenance',
      tools: {
        grafana: {
          name: 'Grafana',
          url: 'http://users-grafana.com:3000',
          description: 'Dashboard de monitoreo Renaper',
          category: 'monitoring'
        },
        consul: {
          name: 'Consul',
          url: 'http://users-consul.com:8500',
          description: 'Service discovery Renaper',
          category: 'infrastructure'
        },
        vault: {
          name: 'Vault',
          url: 'http://users-vault.com:8200',
          description: 'Gestión de secretos Renaper',
          category: 'security'
        },
        healthCheck: {
          name: 'Health Check',
          url: 'http://users-jenkins.com:8080',
          description: 'Health Check Renaper',
          category: 'monitoring'
        },
        kubernetes: {
          name: 'Kubernetes Dashboard',
          url: 'http://users-k8s.com',
          description: 'Cluster Kubernetes Renaper',
          category: 'infrastructure'
        },
        portalLink: {
          name: 'Portal Renaper',
          url: 'http://users-portal.com',
          description: 'Portal Renaper',
          category: 'application'
        }
      },
      metrics: {
        uptime: 98.5,
        responseTime: 150,
        errorRate: 1.5
      }
    },
    {
      key: 'BCRA',
      name: 'Coneciones BCRA',
      description: 'Conexiones con el Banco Central de la República Argentina',
      icon: '🏦',
      status: 'active',
      tools: {
        grafana: {
          name: 'Grafana',
          url: 'http://notifications-grafana.com:3000',
          description: 'Dashboard de monitoreo Notifications',
          category: 'monitoring'
        },
        consul: {
          name: 'Consul',
          url: 'http://notifications-consul.com:8500',
          description: 'Service discovery Notifications',
          category: 'infrastructure'
        },
        vault: {
          name: 'Vault',
          url: 'http://notifications-vault.com:8200',
          description: 'Gestión de secretos Notifications',
          category: 'security'
        },
        healthCheck: {
          name: 'Health Check',
          url: 'http://notifications-jenkins.com:8080',
          description: 'Health Check Notifications',
          category: 'monitoring'
        },
        kubernetes: {
          name: 'Kubernetes Dashboard',
          url: 'http://notifications-k8s.com',
          description: 'Cluster Kubernetes Notifications',
          category: 'infrastructure'
        },
        portalLink: {
          name: 'Portal Notifications',
          url: 'http://notifications-portal.com',
          description: 'Portal Notifications',
          category: 'application'
        }
      },
      metrics: {
        uptime: 99.99,
        responseTime: 50,
        errorRate: 0.01
      }
    }
  ];

  constructor() {
    // Cargar proyecto desde localStorage si existe
    const savedProjectId = this.getLastSelectedProject();
    if (savedProjectId) {
      const project = this.getProjectById(savedProjectId);
      if (project) {
        this.currentProjectSubject.next(project);
      }
    }
  }

  /**
   * Obtiene todos los proyectos
   */
  getAllProjects(): Project[] {
    return this.projects;
  }

  /**
   * Alias para getAllProjects (por compatibilidad)
   */
  getProjects(): Project[] {
    return this.getAllProjects();
  }

  /**
   * Obtiene un proyecto por su ID
   */
  getProjectById(projectId: string): Project | null {
    return this.projects.find(p => p.key === projectId) || null;
  }

  /**
   * Establece el proyecto actual
   */
  setCurrentProject(project: Project): void {
    this.currentProjectSubject.next(project);
    localStorage.setItem('lastSelectedProject', project.key);
  }

  /**
   * Obtiene el proyecto actual
   */
  getCurrentProject(): Project | null {
    return this.currentProjectSubject.value;
  }

  /**
   * Obtiene una herramienta específica de un proyecto
   */
  getToolFromProject(projectId: string, toolKey: string): Tool | null {
    const project = this.getProjectById(projectId);
    if (!project) return null;
    return project.tools[toolKey] || null;
  }

  /**
   * Guarda el último proyecto seleccionado
   */
  private getLastSelectedProject(): string | null {
    return localStorage.getItem('lastSelectedProject');
  }

  /**
   * Gestión de proyectos recientes
   */
  getRecentProjectIds(): string[] {
    const recent = localStorage.getItem('recentProjects');
    return recent ? JSON.parse(recent) : [];
  }

  /**
   * Agrega un proyecto a los recientes
   */
  addToRecent(projectId: string): void {
    let recent = this.getRecentProjectIds();
    
    // Eliminar si ya existe y agregar al principio
    recent = recent.filter(id => id !== projectId);
    recent.unshift(projectId);
    
    // Mantener solo los últimos 3
    recent = recent.slice(0, 3);
    
    localStorage.setItem('recentProjects', JSON.stringify(recent));
  }

  /**
   * Verifica si un proyecto está disponible
   */
  isProjectAvailable(projectId: string): boolean {
    const project = this.getProjectById(projectId);
    return project ? project.status !== 'inactive' : false;
  }

  /**
   * Obtiene las métricas de un proyecto
   */
  getProjectMetrics(projectId: string): any {
    const project = this.getProjectById(projectId);
    return project?.metrics || null;
  }

  /**
   * Filtra herramientas por categoría
   */
  getToolsByCategory(projectId: string, category: string): Tool[] {
    const project = this.getProjectById(projectId);
    if (!project) return [];
    
    return Object.values(project.tools).filter(tool => tool.category === category);
  }

  /**
   * Limpia la selección actual
   */
  clearCurrentProject(): void {
    this.currentProjectSubject.next(null);
    localStorage.removeItem('lastSelectedProject');
  }
}