import { Routes } from '@angular/router';
import { ProjectSelectorComponent } from './shared/components/project-selector/project-selector.component';
import { ProjectDashboardComponent } from './shared/components/project-dashboard/project-dashboard.component';
import { projectGuard } from './guards/project.guard';


export const routes: Routes = [
 {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full'
  },
  {
    path: 'projects',
    component: ProjectSelectorComponent,
    title: 'Seleccionar Proyecto'
  },
  {
    path: 'project/:projectId',
    component: ProjectDashboardComponent,
    canActivate: [projectGuard],
    title: 'Dashboard del Proyecto',
    children: [
      {
        path: '',
        redirectTo: 'tools',
        pathMatch: 'full'
      },
      {
        path: 'tools',
        loadComponent: () => import('./shared/components/tools-grid/tools-grid.component')
          .then(m => m.ToolsGridComponent)
      },
      {
        path: 'grafana',
        loadComponent: () => import('./shared/components/tool-frame/tool-frame.component')
          .then(m => m.ToolFrameComponent),
        data: { tool: 'grafana' }
      },
      {
        path: 'consul',
        loadComponent: () => import('./shared/components/tool-frame/tool-frame.component')
          .then(m => m.ToolFrameComponent),
        data: { tool: 'consul' }
      },
      {
        path: 'vault',
        loadComponent: () => import('./shared/components/tool-frame/tool-frame.component')
          .then(m => m.ToolFrameComponent),
        data: { tool: 'vault' }
      },
      {
        path: 'health-check',
        loadComponent: () => import('./shared/components/tool-frame/tool-frame.component')
          .then(m => m.ToolFrameComponent),
        data: { tool: 'healthCheck' }
      },
      {
        path: 'kubernetes',
        loadComponent: () => import('./shared/components/tool-frame/tool-frame.component')
          .then(m => m.ToolFrameComponent),
        data: { tool: 'kubernetes' }
      },
      {
        path: 'portal',
        loadComponent: () => import('./shared/components/tool-frame/tool-frame.component')
          .then(m => m.ToolFrameComponent),
        data: { tool: 'portalLink' }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'projects'
  }
];