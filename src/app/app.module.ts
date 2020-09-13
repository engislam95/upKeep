import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/* ----------------------- Services ----------------------- */
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { AuthService } from './guards/auth.service';
import { CoreService } from './tools/shared-services/core.service';
import { HeadersService } from './tools/shared-services/headers.service';
import { SidebarTriggerService } from './tools/shared-services/sidebar-trigger.service';
/* ---------------- Routing Module ------------------------- */
import { AppRoutingModule } from './app-routing.module';
/* ---------------- Component ------------------------- */
import { AppComponent } from './app.component';
/* -------------------- Firebase ---------------------------- */
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { MessagingService } from './tools/shared-services/messaging.service';
import { environment } from '../environments/environment';
import { AsyncPipe } from '../../node_modules/@angular/common';
import { WebSocketService } from './tools/shared-services/web-socket.service';
@NgModule({
  declarations: [AppComponent  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    HeadersService,
    AuthGuard,
    LoginGuard,
    AuthService,
    CoreService,
    SidebarTriggerService,
    MessagingService,
    AsyncPipe ,
    WebSocketService 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
