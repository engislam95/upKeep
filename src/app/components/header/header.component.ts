import { Component, OnInit, AfterViewInit } from '@angular/core';
import { trigger, animate, transition, style } from '@angular/animations';
import { LoaderService } from '../../tools/shared-services/loader.service';
import { CoreService } from './../../tools/shared-services/core.service';
import { fade } from './../../tools/shared_animations/fade';
import { AuthService } from './../../guards/auth.service';
import { SidebarTriggerService } from './../../tools/shared-services/sidebar-trigger.service';
import { MessagingService } from './../../tools/shared-services/messaging.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('popupAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(5%) ', opacity: 0 }),
        animate('150ms', style({ transform: 'translateY(0) ', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0) ', opacity: 1 }),
        animate('150ms', style({ transform: 'translateY(5%)', opacity: 0 }))
      ])
    ]),
    fade
  ]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  /* --------------------------- Variables ------------------------------- */
  today: Date = new Date();
  hours: any = '';
  mins: any = '';
  seconds: any = '';
  order_id: any = '';
  adminImage = '';
  adminTitle = '';
  currentNotification: any = '';
  timer: any = '';
  notifications = [];
  message: any = [];
  n: any = [];
  pageId: number = 1;
  alertNotification: any = '';
  getNotification: boolean = true;
  displayBoolean: boolean = true;
  loading: boolean = false;
  showLoggedUser: boolean = false;
  emptyNotificationArray: boolean = false;
  showNotification: boolean = false;
  playNotificationSound: boolean = false;
  /* ------------------- Constructor ------------------------ */
  constructor(
    private coreService: CoreService,
    private loader: LoaderService,
    private authService: AuthService,
    private sidebarTriggerService: SidebarTriggerService,
    private messagingService: MessagingService
  ) {
    /* -------------- Get User Details ------------------------ */
    if (localStorage.getItem('currentUser')) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.adminImage = currentUser.image;
      this.adminTitle = currentUser.name;
    }
    this.loader.loaderObservable.subscribe((params: any) => {
      this.loading = params;
    });
    // Receive Notifications
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data.data) {
        this.message.unshift(event.data);
        this.playNotificationSound = true;
        setTimeout(() => {
          this.playNotificationSound = false;
        }, 2000);
      }
    });
  }
  /* ------------------------- Logout ------------------------- */
  logOut() {
    this.authService.logout();
  }
  /* ---------------------- Oninit --------------------------- */
  ngOnInit() {
    this.getNotifications();
    this.messagingService.orderUpdatedNotification.subscribe(
      (orderUpdate: any) => {
        console.log(orderUpdate);
        this.order_id = orderUpdate.id;
        console.log(this.order_id);
      }
    );
    /* ----------------------- Get Alert Noftification ------------------------ */
    this.messagingService.currentMessage.subscribe(currentMessage => {
      console.log(currentMessage);
      this.currentNotification = currentMessage;
      currentMessage.forEach(message => {
        this.message.unshift(message);
        this.playNotificationSound = true;
        setTimeout(() => {
          this.playNotificationSound = false;
        }, 2000);
      });
      if (currentMessage.length > 0 && this.displayBoolean === true) {
      }
    });
    setInterval(() => {
      this.today = new Date();
    }, 1000);
  }
  /* ------------------- After View Init ----------------------- */
  ngAfterViewInit() {
    document.getElementById('listBody').addEventListener('scroll', e => {
      const scrollTop = (e.target as HTMLElement).scrollTop;
      const notificationArrayLength = this.message.length;
      const liHeight = (document.querySelector('#listBody > li') as HTMLElement)
        .offsetHeight;
      const viewHeight = (e.target as HTMLElement).clientHeight;
      const totalScroll =
        (notificationArrayLength - viewHeight / liHeight) * liHeight;
      if (scrollTop >= totalScroll) {
        if (this.getNotification && !this.emptyNotificationArray) {
          this.getNotification = false;
          this.pageId++;
          this.getNotifications();
        }
      }
    });
    // this.hidePopupNotifications();
  }
  /* ------------------- Get Notification ----------------------- */
  getNotifications() {
    this.coreService
      .getMethod('notifications', { page: this.pageId })
      .subscribe((notifications: any) => {
        notifications.data.notifications.data.length === 0
          ? (this.emptyNotificationArray = true)
          : null;
        notifications.data.notifications.data.forEach(message => {
          this.message.push(message);
        });
        this.getNotification = true;
      });
  }
  /* --------------------- Sidebar --------------------- */
  sidebarTrigger() {
    this.sidebarTriggerService.toggelSidemenu();
    this.sidebarTriggerService.toggelOverlay();
  }
  /* ----------------- Close Notification --------------------------- */
  closeNotifications(index) {
    this.currentNotification.splice(index, 1);
  }
  /* ----------------- Hide Notification ----------------------- */
  hidePopupNotifications() {
    setTimeout(() => {
      (document.getElementById(
        'alert-notification'
      ) as HTMLElement).setAttribute(
        'style',
        'transition: 5s; transform: translateY(0); display: none'
      );
      this.displayBoolean = false;
    }, 5000);
  }
}
