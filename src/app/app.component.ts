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
  responseText1 = '';
  responseText2 = '';
  responseText3 = '';
  findMatchRequest;

  ngOnInit() {
    const candidate = new Candidate('a01', 'Ula', 'm', 'sports');
    this.findMatchRequest = new FindMatchRequest(candidate);

    const that = this;
    // POST
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://edv8edmxxj.execute-api.us-east-2.amazonaws.com/development/find-your-match');
    xhr.onreadystatechange = function (event: any) {
      // console.log('XMLHttpRequest event.target = ', event.target.responseText);
      that.responseText1 = event.target.responseText;
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(this.findMatchRequest));

    // DELETE
    const xhr2 = new XMLHttpRequest();
    xhr2.open('DELETE', 'https://edv8edmxxj.execute-api.us-east-2.amazonaws.com/development/find-your-match');
    xhr2.onreadystatechange = function (event: any) {
      // console.log('XMLHttpRequest event.target = ', event.target.responseText);
      that.responseText2 = event.target.responseText;
    };
    xhr2.setRequestHeader('Content-Type', 'application/json');
    xhr2.send();

    // GET
    const xhr3 = new XMLHttpRequest();
    xhr3.open('GET', 'https://edv8edmxxj.execute-api.us-east-2.amazonaws.com/development/find-your-match/single');
    xhr3.onreadystatechange = function (event: any) {
      // console.log('XMLHttpRequest event.target = ', event.target.responseText);
      that.responseText3 = event.target.response;
    };
    xhr3.setRequestHeader('Content-Type', 'application/json');
    xhr3.send();

  }
}
