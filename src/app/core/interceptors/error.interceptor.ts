import {
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    timeout(10000),
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Error desconocido';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 0:
            errorMessage = 'No se puede conectar al servidor';
            break;
          case 400:
            errorMessage = 'Solicitud inválida';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado';
            break;
          case 500:
            errorMessage = 'Error interno del servidor';
            break;
          default:
            errorMessage = `Error ${error.status}: ${error.statusText}`;
        }
      }

      console.error('Error interceptado:', errorMessage, error);
      return throwError(() => new Error(errorMessage));
    })
  );
};
