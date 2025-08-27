import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el usuario ya está autenticado, permite el acceso
  if (authService.isAuthenticated()) {
    return true;
  }
  
  // Si no está autenticado, inicia el flujo de login
  // Importante: No podemos simplemente llamar a login() aquí porque causa un bucle.
  // La redirección al IdP la manejará la librería o una acción del usuario.
  // Lo correcto es redirigir a una página pública de login/bienvenida.
  console.log('AuthGuard: Usuario no autenticado. Redirigiendo a /welcome.');
  router.navigate(['/welcome']);
  return false;
};