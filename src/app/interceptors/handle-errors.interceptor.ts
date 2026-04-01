import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

export const handleErrorsInterceptor: HttpInterceptorFn = (req, next) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);
  const alertService: AlertService = inject(AlertService);

  return next(req).pipe(
    catchError((error: any): Observable<any> => {
      
      let errorMessage = 'Error de login.';
      console.log('Error de login HANDLE ERRORS.SERVICE:', error);
      console.log('Request URL:', req.url);
      
      // if ((error.status === 401 || error.status === 403) && !req.url.includes('auth')) {

      if ((error.status === 401 ) && req.url.includes('auth')) { //!req.url.includes('auth') antes
        errorMessage = 'Error, revisar información de usuario';
        alertService.displayAlert(
          'error',
          errorMessage,
          'center',
          'top',
          ['error-snackbar']
        );
      }
      if (error.status === 403 && error.error?.description === 'The JWT token has expired') {
        authService.logout();
        window.location.assign('/token-expired');
        return of({ status: false });
      }
      if ((error.status === 403) && req.url.includes('auth')){
        errorMessage = 'Usuario deshabilitado';
        alertService.displayAlert(
          'error',
          errorMessage,
          'center',
          'top',
          ['error-snackbar']
        );
        authService.logout();
        router.navigateByUrl('/login');
        return of({ status: false });
      }

      if (error.status === 422) {
        throw error.error;
      }
      if (error.status === 404) {
        throw { status: false };
      }
      return of({ status: false });
    })
  );
};
