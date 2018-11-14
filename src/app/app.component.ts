import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CognitoService } from './services/cognito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  isLoggedIn = false;
  username = '';

  modalForm = new FormGroup({
    isSignInSignUpError: new FormControl(false),
    SignInSignUpErrorMessage: new FormControl('')
  });

  constructor(
    private authService: CognitoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.authService.subscribeToStatus();

    this.authService.isLoggedInSubject.subscribe(
      (authenticated) => {
        this.isLoggedIn = authenticated;
        if (authenticated) {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/login']);
        }
      }
    );

    this.authService.LoggedInUsername.subscribe((name) => {
      this.username = name;
    });

    this.authService.ErrorMessage.subscribe((message: string) => {
      console.log('that.SignInSignUpErrorMessage = ', message);
      if (message.length > 0) {
        this.modalForm.setValue({
          isSignInSignUpError: true,
          SignInSignUpErrorMessage: message
        }, { emitEvent: false });
      }
    });

    this.authService.isSessionValid();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  onModalClose() {
    console.log('in onModalClose');
    this.modalForm.setValue({
      isSignInSignUpError: false,
      SignInSignUpErrorMessage: ''
    }, { emitEvent: false });
  }

  onSourceClicked() {
    console.log('in onSourceClicked');
    window.open('https://github.com/aripovula/findYourMatchSLS', '_blank');
  }

  onLogoutClicked() {
    this.authService.logOut();
  }

}
