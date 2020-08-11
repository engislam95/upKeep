import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from './animations';
import { MessagingService } from './tools/shared-services/messaging.service';
import { CoreService } from './tools/shared-services/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {
  showSideMenu = false;
  // message: any = '';
    constructor(private messagingService: MessagingService , private coreService: CoreService) { 

        
    window.addEventListener('beforeunload', function (e) { 
      // e.preventDefault(); 
      // console.log(sessionStorage.getItem('notificationToken') )

      coreService
      .postMethod('fcm/remove', {
        token: sessionStorage.getItem('notificationToken')
        // token: 'dZpGTF2VNsU:APA91bHHtkq4qJIMbUPoSZ-Cq-nkHnuYLGqZdN7aVZeBH2jlEroIMaMhuOcQGyQrley91Eqx0uF0e1ANEES1ln8XRgIz3QU6G341MTVKdtQeI4VjUqsz3UGDVnD6muGeRSN-g13d5dio'
      })
      .subscribe(
        (res) => {
          console.log(res)
        },
        (err) => {
          console.log(err)
        }
      );
          // e.returnValue = "Hello! I am an alert box!!"; 
       }); 
    }
    
  ngOnInit() {

    const userId = 'user001';

    this.messagingService.requestPermission(userId);
    this.messagingService.receiveMessage();


  
  }
}
