import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

// import { WebSocketService } from '../tools/shared-services/web-socket.service'

@Injectable()
export class AuthGuard implements CanActivate {

   currentUser ;
  /* --------------- Constructor -------------------- */
  constructor(private router: Router  ) {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))


  }





  canActivate() {
    if (localStorage.getItem('currentUser')) {

    //  console.log(this.WebSocketService.listenChannel("name")) 




      return true;
    }
    else if(!localStorage.getItem('currentUser'))
    {
      this.router.navigate(['access/login']);
      return false;
    }

 
   

  
  }
}
