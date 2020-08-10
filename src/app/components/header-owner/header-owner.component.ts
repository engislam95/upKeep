import { Component, OnInit, AfterViewInit } from '@angular/core';
import { trigger, animate, transition, style } from '@angular/animations';
import { LoaderService } from '../../tools/shared-services/loader.service';
import { CoreService } from './../../tools/shared-services/core.service';
import { fade } from './../../tools/shared_animations/fade';
import { AuthService } from './../../guards/auth.service';
import { SidebarTriggerService } from './../../tools/shared-services/sidebar-trigger.service';
import { MessagingService } from './../../tools/shared-services/messaging.service';
@Component({
  selector: 'app-header-owner',
  templateUrl: './header-owner.component.html',
  styleUrls: ['./header-owner.component.scss'],
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
export class HeaderOwnerComponent implements OnInit {
  /* --------------------------- Variables ------------------------------- */
  user: any = '';
  /* ------------------- Constructor ------------------------ */
  constructor(
    private coreService: CoreService,
    private loader: LoaderService,
    private authService: AuthService,
    private sidebarTriggerService: SidebarTriggerService,
    private messagingService: MessagingService
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }
  /* ---------------------- Oninit --------------------------- */
  ngOnInit() {}
}
