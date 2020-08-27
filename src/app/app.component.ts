import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from './animations';
import { MessagingService } from './tools/shared-services/messaging.service';
import { CoreService } from './tools/shared-services/core.service';
import { WebSocketService } from './tools/shared-services/web-socket.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {
  showSideMenu = false;
  currentUser ;
  // message: any = '';
  constructor(
    private messagingService: MessagingService,
    private coreService: CoreService ,
    private WebSocketServicee : WebSocketService ,
    private router: Router
  ) {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))

    window.addEventListener('beforeunload', function(e) {
      // e.preventDefault();
      // console.log(localStorage.getItem('notificationToken') )

      coreService
        .postMethod('fcm/remove', {
          token: localStorage.getItem('notificationToken')
          // token: 'dZpGTF2VNsU:APA91bHHtkq4qJIMbUPoSZ-Cq-nkHnuYLGqZdN7aVZeBH2jlEroIMaMhuOcQGyQrley91Eqx0uF0e1ANEES1ln8XRgIz3QU6G341MTVKdtQeI4VjUqsz3UGDVnD6muGeRSN-g13d5dio'
        })
        .subscribe(
          res => {
            console.log(res);
          },
          err => {
            console.log(err);
          }
        );
      // e.returnValue = "Hello! I am an alert box!!";
    });
  }

  ngOnInit() {
    const userId = 'user001';

    this.messagingService.requestPermission(userId);
    this.messagingService.receiveMessage();

    if(JSON.parse(localStorage.getItem('currentUser')).privilege != 'owner' )
    {

      console.log('entered')

      this.WebSocketServicee.listenChannel('company.' + this.currentUser.id )

      // this.router.navigate(['/system-off']);


    }







  }
}
