import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SugusService } from '../services/sugus.service';

/**
 * Guard funcional para verificar permisos específicos
 * Uso: canActivate: [permissionGuard('PERMISO_NOMBRE')]
 */
export const permissionGuard = (requiredPermission: string): CanActivateFn => {
  return (route, state) => {
    const sugusService = inject(SugusService);
    const router = inject(Router);
    
    if (sugusService.hasPermission(requiredPermission)) {
      return true;
    }
    
    // Sin permisos, ir a forbidden
    router.navigate(['/forbidden'], {
      queryParams: { 
        message: `No tienes el permiso: ${requiredPermission}` 
      }
    });
    return false;
  };
};