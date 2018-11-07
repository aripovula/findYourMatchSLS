import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // getFromAWS() {
  //   const candidate = new Candidate('a04', 'Ula B', 'male', 'sports, arts, acting');
  //   this.findMatchRequest = new FindMatchRequest(candidate);

  //   const that = this;
  //   // POST
  //   const xhr = new XMLHttpRequest();
  //   xhr.open('POST', 'https://edv8edmxxj.execute-api.us-east-2.amazonaws.com/development/find-your-match');
  //   let times2 = 0;
  //   xhr.onreadystatechange = function (event: any) {
  //     if (event.target.response) {
  //       try {
  //         times2++;
  //         that.responseText3 = JSON.parse(event.target.response);
  //         console.log('XMLHttpRequest event.target = ', times2, that.responseText3);
  //       } catch (e) {
  //         console.log('Error in parse attemp # ' + times2);
  //       }
  //     }
  //   };
  //   xhr.setRequestHeader('Content-Type', 'application/json');
  //   xhr.send(JSON.stringify(this.findMatchRequest));

  //   // DELETE
  //   const xhr2 = new XMLHttpRequest();
  //   xhr2.open('DELETE', 'https://edv8edmxxj.execute-api.us-east-2.amazonaws.com/development/find-your-match');
  //   xhr2.onreadystatechange = function (event: any) {
  //     // console.log('XMLHttpRequest event.target = ', event.target.responseText);
  //     that.responseText2 = event.target.responseText;
  //   };
  //   xhr2.setRequestHeader('Content-Type', 'application/json');
  //   xhr2.send();

  //   // GET
  //   const xhr3 = new XMLHttpRequest();
  //   xhr3.open('GET', 'https://edv8edmxxj.execute-api.us-east-2.amazonaws.com/development/find-your-match/single');
  //   let times = 0;
  //   xhr3.onreadystatechange = function (event: any) {
  //     if (event.target.response) {
  //       try {
  //         times++;
  //         that.responseText3 = JSON.parse(event.target.response);
  //         console.log('XMLHttpRequest event.target = ', times, that.responseText3);
  //       } catch (e) {
  //         console.log('Error in parse attemp # ' + times);
  //       }
  //     }
  //   };
  //   xhr3.setRequestHeader('Content-Type', 'application/json');
  //   xhr3.send();
  // }

}
