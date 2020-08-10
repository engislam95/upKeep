import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CoreService } from './../tools/shared-services/core.service';
import { HeadersService } from './../tools/shared-services/headers.service';
@Injectable()
export class AuthService {
  /* --------------------------- Variables --------------------------- */
  notificationToken: any = '';
  loginSubject = new Subject();
  loginObservable = this.loginSubject.asObservable();
  /* ------------------ Constructor ------------------- */
  constructor(
    private coreService: CoreService,
    private router: Router,
    private headersService: HeadersService
  ) {}
  /* ---------------------- Login ------------------------ */
  login(email: string, password: string) {
    const notificationToken = JSON.parse(
      localStorage.getItem('notificationToken')
    );
    /* ---------------------- Login ------------------------ */
    this.coreService
      .postMethod('tkn', {
        email,
        password,
        mobtkn: notificationToken,
        is_mobile: 0
      })
      .subscribe(
        (user: any) => {
          this.loginSubject.next(user);
          this.headersService.token = user.access_token;
          this.headersService.companySlug = user.company_slug;
          this.headersService.baseUrl =
            this.headersService.baseAPI +
            'api/company/' +
            this.headersService.companySlug +
            '/';
          localStorage.setItem('currentUser', JSON.stringify(user));
          const userData = JSON.parse(localStorage.getItem('currentUser'));
          if (userData.privilege == 'owner' || userData.privilege == 'Owner') {
            setTimeout(() => {
              this.router.navigate(['/owner']);
            }, 700);
          } else {
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 700);
          }
        },
        error => {
          this.loginSubject.next(error);
        }
      );
  }
  /* ----------------------- Logout ------------------ */
  logout() {
    let user_id = JSON.parse(localStorage.getItem('currentUser')).id;
    const notificationToken = JSON.parse(
      localStorage.getItem('notificationToken')
    );
    this.coreService
      .postMethod('logout', { tkn: notificationToken, id: user_id })
      .subscribe(deleteToken => {
        setTimeout(() => {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('notificationToken');
          location.href = '/access/login';
        }, 500);
      });
  }
}
