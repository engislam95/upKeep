import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CoreService } from './../../../tools/shared-services/core.service';
import { AuthService } from './../../../guards/auth.service';
import { ResponseStateService } from '../../../tools/shared-services/response-state.service';
import { MessagingService } from './../../../tools/shared-services/messaging.service';
import { fade } from '../../../tools/shared_animations/fade';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: fade
})
export class LoginComponent {
  /* ---------------------- Variables -------------------------- */
  responseState: any = '';
  responseData: any = '';
  notificationToken: any = '';
  submitted: boolean = false;
  loginProccessFinished: boolean = true;
  pageLoaded: boolean = false;
  /* -------------------- Constructor ------------------------------- */
  constructor(
    private authService: AuthService,
    private responseStateService: ResponseStateService,
    private messagingService: MessagingService
  ) {
    /* ------------------------- Listen Notification Token ------------------------- */
    this.messagingService.tokenSubject.subscribe(token => {
      this.notificationToken = token;
    });
    this.authService.loginObservable.subscribe((loginResponse: any) => {
      if (loginResponse.error) {
        if (loginResponse.error.errors) {
          this.showErrors(loginResponse.error.errors);
        } else {
          this.showErrors(loginResponse.error.message);
        }
        this.loginProccessFinished = true;
      } else {
        this.showSuccess();
        this.loginProccessFinished = true;
      }
    });
  }
  /* -------------------------- Login Form ----------------------------- */
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.email,
      Validators.required,
      Validators.pattern('^[a-zA-Z][a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}')
    ]),
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.required
    ])
  });
  /* ------------------------------- Submit Login ------------------------- */
  onSubmit() {
    this.submitted = true;
    this.loginProccessFinished = false;
    this.authService.login(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
  }
  /* ---------------------- Show Error Message --------------------------- */
  showErrors(errors) {
    this.responseState = 'error';
    this.responseData = errors;
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
  /* --------------------- Show Success Message ----------------------- */
  showSuccess() {
    this.responseState = 'success';
    this.responseData = 'تم تسجيل الدخول بنجاح';
    this.responseStateService.responseState(
      this.responseState,
      this.responseData
    );
  }
}
