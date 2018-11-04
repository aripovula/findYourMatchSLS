import { Candidate } from './models/candidate.model';
import { FindMatchRequest } from './models/find-match-request.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Find Your Match (serverless )';
  responseText = '';
  findMatchRequest;

  ngOnInit() {
    const candidate = new Candidate('a01', 'Ula', 'm', 'sports');
    this.findMatchRequest = new FindMatchRequest(candidate);

    const that = this;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://edv8edmxxj.execute-api.us-east-2.amazonaws.com/development/find-your-match');
    xhr.onreadystatechange = function (event: any) {
      // console.log('XMLHttpRequest event.target = ', event.target.responseText);
      that.responseText = event.target.responseText;
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(this.findMatchRequest));

  }
}
