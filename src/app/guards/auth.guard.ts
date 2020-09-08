import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { WebSocketService } from '../tools/shared-services/web-socket.service' ;

@Injectable()
export class AuthGuard implements CanActivate {

   currentUser ;
  /* --------------- Constructor -------------------- */
  constructor(private router: Router , private WebSocketService : WebSocketService  ) {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))


  }


  canActivate()
  {
    if ( localStorage.getItem('currentUser'))
    {
      // this.router.navigate(['/']);
      return true
    }

    else if(!localStorage.getItem('currentUser')  )
      {
        this.router.navigate(['access/login']);
        return false;

      }

  }


  // canActivate() {
  //   if ( (localStorage.getItem('currentUser') && localStorage.getItem('active') == '1') || localStorage.getItem('active') == '1') {

  //       return true ;
      
  //   }
  //   else if(!localStorage.getItem('currentUser')  )
  //   {
  //     this.router.navigate(['access/login']);
  //     return false;
  //   }

  //   else if(localStorage.getItem('currentUser') && localStorage.getItem('active') == '0')
  //   {

  //     this.router.navigate(['/system-off']);
  //     return false;
  //   }

  // }
}
