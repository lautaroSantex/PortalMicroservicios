import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Asegúrate que la ruta sea correcta
import { filter, map, take } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  // Esperamos a que el servicio se inicialice antes de tomar una decisión
  return toObservable(authService.isInitialized).pipe(
    filter(isInitialized => isInitialized), // Espera a que sea true
    take(1), // Toma solo el primer valor true
    map(() => {
      if (authService.isAuthenticated()) {
        return true; // Si está autenticado, permite el acceso
      } else {
        authService.login(); // Si no, inicia el login
        return false;
      }
    })
  );
};