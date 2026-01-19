import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authservice = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authservice.isLoggedIn();
  const userRole = authservice.getRole();
  const requireRole = route.data?.['role'];

  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  if (requireRole && userRole !== requireRole) {
    router.navigate(['/menu']);
    return false;
  }

  return true;
};
