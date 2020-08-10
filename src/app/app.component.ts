import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from './animations';
import { MessagingService } from './tools/shared-services/messaging.service';
import { CoreService } from './tools/shared-services/core.service';
import Pusher from 'pusher-js';
import { WebSocketService } from './tools/shared-services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {
  pusher: any;
  channel: any;
  channels: [] = [];
  showSideMenu = false;
  // message: any = '';
  constructor(
    private messagingService: MessagingService,
    private coreService: CoreService,
    private WebSocket: WebSocketService
  ) {
    // when close window remove notification
    window.addEventListener('beforeunload', function(e) {
      coreService
        .postMethod('fcm/remove', {
          token: localStorage.getItem('notificationToken')
        })
        .subscribe(
          res => {
            console.log(res);
          },
          err => {
            console.log(err);
          }
        );
    });

    // web soket test

    this.WebSocket.listenChannel(['orders', 'test']);
  }

  ngOnInit() {
    const userId = 'user001';

    this.messagingService.requestPermission(userId);
    this.messagingService.receiveMessage();
  }
}
