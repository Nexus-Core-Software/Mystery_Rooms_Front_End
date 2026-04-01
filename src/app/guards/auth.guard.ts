import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthGoogleService } from '../services/auth-google.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const authGoogleService = inject(AuthGoogleService);
  if (authService.check() || authGoogleService.isProcessingGoogleAutentication == 'true') return true;

  router.navigateByUrl('/login');
  return false;
};
