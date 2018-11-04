import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Find Your Match (serverless )';
  responseText = '';
  candidates = {
    candidate: {
      name: 'ULA',
      gender: 'm',
      interests: 'ABC'
    }
  };


  ngOnInit() {
    console.log('1', this.candidates);
    console.log('2', {
      candidate: {
        name: 'Ula',
        gender: 'm',
        interests: ' sports'
      }
    });

    const that = this;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://edv8edmxxj.execute-api.us-east-2.amazonaws.com/development/find-your-match');
    xhr.onreadystatechange = function (event: any) {
      // console.log('XMLHttpRequest event.target = ', event.target.responseText);
      that.responseText = event.target.responseText;
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(that.candidates));

  }
}
