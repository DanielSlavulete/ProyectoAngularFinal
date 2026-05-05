import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

// Permite entrar solo si hay sesión activa.
export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  // Auth comprueba si existe token/usuario guardado en la sesión.
  if (auth.isLoggedIn()) {
    return true;
  }

  // Si no hay sesión, redirigimos al login.
  return router.createUrlTree(['/login']);
};