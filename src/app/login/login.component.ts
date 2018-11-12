import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CognitoService } from './../services/cognito.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Code of all Lambda functions in AWS Lambda are also provided in AWS-BACK-UP folder in this repository

  loginForm = new FormGroup({
    username: new FormControl('Alex', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('alexAlex1', [Validators.required, Validators.minLength(8)]),
    user: new FormControl('Alex'),
  });
  modalForm = new FormGroup({
    isSignInSignUpError: new FormControl(false),
    SignInSignUpErrorMessage: new FormControl('')
  });
  prevUser = null;

  constructor(
    private authService: CognitoService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.loginForm.valueChanges.subscribe(() => {
    //   console.warn(this.loginForm.value);
    // });
  }

  onUserChange() {
    console.log('this.loginForm.value.user = ', this.loginForm.value.user);
    if (this.prevUser !== this.loginForm.value.user) {
      this.prevUser = this.loginForm.value.user;
      if (this.loginForm.value.user === 'Alex') {
        this.loginForm.setValue({
          username: 'Alex', password: 'alexAlex1', user: 'Alex'
        }, { emitEvent: false });
      }
      if (this.loginForm.value.user === 'Ann') {
        this.loginForm.setValue({
          username: 'Ann', password: 'annann12', user: 'Ann'
        }, { emitEvent: false });
      }
      if (this.loginForm.value.user === 'John') {
        this.loginForm.setValue({
          username: 'John', password: 'johnjohn1', user: 'John'
        }, { emitEvent: false });
      }
      if (this.loginForm.value.user === 'new') {
        this.loginForm.setValue({
          username: '', password: 'Standard1', user: 'new'
        }, { emitEvent: false });
      }
    }
  }

  onModalClose() {
    this.modalForm.setValue({
      isSignInSignUpError: false,
      SignInSignUpErrorMessage: ''
    }, { emitEvent: false });

  }

  onSubmit() {
    console.warn(this.loginForm.value);
    const email = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    console.log('in Login C ' + email + ' ' + password);
    const that = this;
    this.authService.signIn(email, password).then((message: string) => {
      console.log('that.SignInSignUpErrorMessage = ', message);
      if (message.length > 0) {
        this.modalForm.setValue({
          isSignInSignUpError: true,
          SignInSignUpErrorMessage: message
        }, { emitEvent: false });
      }

    });

    // isSignInSignUpError
  }
}
