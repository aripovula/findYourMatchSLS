import { CognitoService } from './services/cognito.service';
import { Candidate } from './models/candidate.model';
import { FindMatchRequest } from './models/find-match-request.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Find Your Match (serverless )';
  responseText1 = '';
  responseText2 = '';
  responseText3 = '';
  findMatchRequest;

  constructor(
    private authService: CognitoService,
    private router: Router,
  ) { }

  ngOnInit() {

    // this.router.navigate(['/login']);

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
