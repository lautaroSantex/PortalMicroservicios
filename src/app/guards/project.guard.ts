import { CanActivateFn } from '@angular/router';

export const projectGuard: CanActivateFn = (route, state) => {
  return true;
};
