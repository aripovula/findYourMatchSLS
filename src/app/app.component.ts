import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CognitoService } from './services/cognito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    private authService: CognitoService,
    private router: Router,
  ) { }

  ngOnInit() {

    this.authService.isSessionValid();
    console.log('sent to this.isSessionValid();');

    this.authService.subscribeToStatus();
    this.isLoggedIn = this.authService.isLoggedIn;
    console.log(this.isLoggedIn);

    this.authService.isLoggedInSubject.subscribe(
      (authenticated) => {
        this.isLoggedIn = authenticated;
        console.log('authenticated in appc = ', authenticated);

        if (authenticated) {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/login']);
        }
      }
    );
  }

  onCheckClicked() {
    const isLoggedIn = this.authService.isSessionValid();
    console.log('isLoggedIn 22 = ', isLoggedIn);
    const userData = this.authService.getUserData();
    console.log('isLoggedIn 33 = ', userData);
  }

  onSourceClicked() {
    console.log('in onSourceClicked');
    window.open('https://github.com/aripovula/findYourMatchSLS', '_blank');
  }

  onLogoutClicked() {
    this.authService.logOut();
  }

}
