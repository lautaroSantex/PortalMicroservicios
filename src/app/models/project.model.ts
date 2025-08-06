// models/project.model.ts

export interface Tool {
  name: string;
  url: string;
  description: string;
  category?: 'monitoring' | 'infrastructure' | 'security' | 'application' | 'other';
  icon?: string;
  status?: 'online' | 'offline' | 'maintenance';
}

export interface Project {
  key: string;
  name: string;
  description: string;
  icon: string;
  status?: 'active' | 'maintenance' | 'inactive';
  tools: { [key: string]: Tool };
  metrics?: ProjectMetrics;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectMetrics {
  uptime: number;
  responseTime: number;
  errorRate: number;
  lastChecked?: Date;
}

export interface NavigationItem {
  label: string;
  route: string;
  icon?: string;
  badge?: string | number;
}

export interface QuickAction {
  name: string;
  action: () => void;
  icon: string;
  color?: string;
}