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
  loginForm = new FormGroup({
    username: new FormControl('Alex', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('alexAlex1', [Validators.required, Validators.minLength(8)]),
    user: new FormControl('Alex'),
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
          username: 'Alex', password: 'alexalex1', user: 'Alex'
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

  onSubmit() {
    console.warn(this.loginForm.value);
    const email = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    console.log('in Login C ' + email + ' ' + password);
    this.authService.signInOrSignUp(email, password);
  }
}
