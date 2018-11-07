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
    private router: Router,
  ) { }

  ngOnInit() {
    this.router.navigate(['/login']);

  }

  onSourceClicked() {
    console.log('in onSourceClicked');
    window.open('https://github.com/aripovula/findYourMatchSLS', '_blank');
  }

}
