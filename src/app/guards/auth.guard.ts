import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
@Injectable()
export class AuthGuard implements CanActivate {
  /* --------------- Constructor -------------------- */
  constructor(private router: Router) {}
  canActivate() {
    if (localStorage.getItem('currentUser')) {
      return true;
    }
    this.router.navigate(['access/login']);
    return false;
  }
}
