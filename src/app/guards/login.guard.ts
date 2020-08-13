import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
@Injectable()
export class LoginGuard implements CanActivate {
  /* ---------------- Contructor ---------------------- */
  constructor(private router: Router) { }
  canActivate() {
    if (sessionStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
