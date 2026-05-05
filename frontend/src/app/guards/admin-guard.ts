import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';


// Solo permite entrar si está logueado y rol ADMIN.
export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);


  // Internamente Auth revisa si existe token/usuario guardado.
  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  // Si está logueado y el rol es ADMIN se permite acceso.
  if (auth.isAdmin()) {
    return true;
  }

  // Si está logueado pero no es admin, se redirige a la zona normal de usuario.
  return router.createUrlTree(['/home']);
};