// src/app/config/environment.config.ts

export type Environment = 'qa' | 'prod';

export interface EnvironmentConfig {
  name: string;
  key: Environment;
  color: string;
  badgeClass: string;
  iconClass: string;
}

export const ENVIRONMENTS: EnvironmentConfig[] = [
  {
    name: 'QA',
    key: 'qa',
    color: '#f59e0b',
    badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    iconClass: 'bg-yellow-100'
  },
  {
    name: 'Producción',
    key: 'prod',
    color: '#ef4444',
    badgeClass: 'bg-red-100 text-red-800 border-red-300',
    iconClass: 'bg-red-100'
  }
];

// URLs por entorno para cada herramienta
interface ToolEnvironmentUrls {
  [key: string]: string;
}

interface ProjectEnvironmentUrls {
  qa: ToolEnvironmentUrls;
  prod: ToolEnvironmentUrls;
}

interface ToolUrlsConfig {
  [key: string]: ProjectEnvironmentUrls;
}

export const TOOL_URLS: ToolUrlsConfig = {
  apilink: {
    qa: {
      grafana: 'http://10.172.13.70:3000',  // QA Grafana
      consul: 'http://10.172.13.72:8500/ui/dc1/services/ApiLink/instances',  // QA Consul
      vault: 'http://10.172.13.76:8200',  // QA Vault
      healthCheck: 'http://10.172.13.71:7209/health-ui',  // QA Health Check
      kubernetes: 'http://10.172.13.33:8001',  // QA Kubernetes
      portalLink: 'http://10.172.13.77'  // QA Portal
    },
    prod: {
      grafana: 'http://10.172.13.80:3000',  // PROD Grafana
      consul: 'http://10.172.13.72:8500/ui/dc1/services/ApiLink/instances',  // PROD Consul
      vault: 'http://10.172.13.76:8200',  // PROD Vault
      healthCheck: 'http://10.172.13.71:7209/health-ui',  // PROD Health Check
      kubernetes: 'http://10.172.13.33',  // PROD Kubernetes
      portalLink: 'http://10.172.13.77'  // PROD Portal
    }
  },
  'hb-judiciales': {
    qa: {
      grafana: 'http://10.172.14.70:3000',  // Ajusta estas IPs según tu infraestructura
      consul: 'http://10.172.14.72:8500/ui/dc1/services/HB-Judiciales-QA/instances',
      vault: 'http://10.172.14.76:8200',
      healthCheck: 'http://10.172.14.71:8080/health-ui',
      kubernetes: 'http://10.172.14.33:8001',
      portalLink: 'http://10.172.14.77:8080'
    },
    prod: {
      grafana: 'http://10.172.14.80:3000',
      consul: 'http://10.172.14.72:8500/ui/dc1/services/HB-Judiciales/instances',
      vault: 'http://10.172.14.76:8200',
      healthCheck: 'http://10.172.14.71:8080/health-ui',
      kubernetes: 'http://10.172.14.33',
      portalLink: 'http://10.172.14.77'
    }
  },
  renaper: {
    qa: {
      grafana: 'http://10.172.15.70:3000',  // Ajusta estas IPs según tu infraestructura
      consul: 'http://10.172.15.72:8500/ui/dc1/services/Renaper-QA/instances',
      vault: 'http://10.172.15.76:8200',
      healthCheck: 'http://10.172.15.71:8080/health-ui',
      kubernetes: 'http://10.172.15.33:8001',
      portalLink: 'http://10.172.15.77:8080'
    },
    prod: {
      grafana: 'http://10.172.15.80:3000',
      consul: 'http://10.172.15.72:8500/ui/dc1/services/Renaper/instances',
      vault: 'http://10.172.15.76:8200',
      healthCheck: 'http://10.172.15.71:8080/health-ui',
      kubernetes: 'http://10.172.15.33',
      portalLink: 'http://10.172.15.77'
    }
  },
  notifications: {
    qa: {
      grafana: 'http://10.172.16.70:3000',  // Ajusta estas IPs según tu infraestructura
      consul: 'http://10.172.16.72:8500/ui/dc1/services/Notifications-QA/instances',
      vault: 'http://10.172.16.76:8200',
      healthCheck: 'http://10.172.16.71:8080/health-ui',
      kubernetes: 'http://10.172.16.33:8001',
      portalLink: 'http://10.172.16.77:8080'
    },
    prod: {
      grafana: 'http://10.172.16.80:3000',
      consul: 'http://10.172.16.72:8500/ui/dc1/services/Notifications/instances',
      vault: 'http://10.172.16.76:8200',
      healthCheck: 'http://10.172.16.71:8080/health-ui',
      kubernetes: 'http://10.172.16.33',
      portalLink: 'http://10.172.16.77'
    }
  }
};