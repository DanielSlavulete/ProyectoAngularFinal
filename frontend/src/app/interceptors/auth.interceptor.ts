import { HttpInterceptorFn } from '@angular/common/http';

// Interceptor HTTP encargado de adjuntar el token JWT automáticamente en todas las peticiones al backend.
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');

  // Si no hay token, la petición continúa normal.
  // Esto permite acceder a rutas públicas como login o register.
  if (!token) {
    return next(req);
  }

  // Clonamos petición original y añadimos la cabecera con autorizacion
  // El backend lee esta cabecera en auth.middleware.js para validar el JWT.
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};