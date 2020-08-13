import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { take } from 'rxjs/operators';
import { BehaviorSubject, Subject, ReplaySubject } from 'rxjs';
@Injectable()
export class MessagingService {
  /* ----------------------- Variables ------------------------- */
  messagesArray = [];
  currentMessage = new BehaviorSubject(this.messagesArray);
  orderUpdatedNotification = new ReplaySubject();
  tokenSubject = new Subject();
  /* ---------------- Constructor ------------------------ */
  constructor(
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging
  ) {
    this.angularFireMessaging.messaging.subscribe(messaging => {
      messaging.onMessage = messaging.onMessage.bind(messaging);
      messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging);
    });
  }
  /* ------------------ Update Token in Firebase ------------------ */
  updateToken(userId, token) {
    this.angularFireAuth.authState.pipe(take(1)).subscribe(() => {
      const data = {};
      data[userId] = token;
      this.angularFireDB.object('fcmTokens/').update(data);
    });
  }
  requestPermission(userId) {
    this.angularFireMessaging.requestToken.subscribe(
      token => {
        localStorage.setItem('notificationToken', JSON.stringify(token));
        this.tokenSubject.next(token);
        this.updateToken(userId, token);
      },
      err => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe((payload: any) => {
      console.log(payload.data);
      this.orderUpdatedNotification.next(
        JSON.parse(payload.data.notification_value)
      );
      console.log(payload);
      this.messagesArray.push(payload);
      this.currentMessage.next(this.messagesArray);
    });
  }
}
