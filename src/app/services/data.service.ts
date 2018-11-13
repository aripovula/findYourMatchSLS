import { CognitoService } from './cognito.service';
import { Candidate } from './../models/candidate.model';
import { FindMatchRequest } from './../models/find-match-request.model';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  findMatchRequest: FindMatchRequest;

  constructor(private http: Http, private authService: CognitoService) { }

  // Code of all Lambda functions in AWS Lambda are also provided in AWS-BACK-UP folder in this repository

  post(candidate: Candidate) {
    // const candidate = new Candidate('a04', 'Ula B', 'male', 'sports, arts, acting');
    this.findMatchRequest = new FindMatchRequest(candidate);

    const that = this;
    // POST
    // const xhr = new XMLHttpRequest();

    this.authService.getCurrentUser().getSession((err, session) => {
      console.log('ID token ', session.getIdToken().getJwtToken());
      console.log('ACCESS token ', session.getAccessToken().getJwtToken());

      that.http.post('https://edv8edmxxj.execute-api.us-east-2.amazonaws.com/development/find-your-match'
        + '?accessToken=' + session.getAccessToken().getJwtToken(),
        that.findMatchRequest, {
          headers: new Headers({ 'Authorization': session.getIdToken().getJwtToken()
        })
        })
        .subscribe(
          (result: any) => {
            // that.responseText1 = JSON.parse(result.json);
            console.log('result = ', result);
          },
          (error) => {
          }
        );
    });

    // xhr.open('POST', 'https://edv8edmxxj.execute-api.us-east-2.amazonaws.com/development/find-your-match');
    // let times2 = 0;
    // xhr.onreadystatechange = function (event: any) {
    //   if (event.target.response) {
    //     try {
    //       times2++;
    //       that.responseText3 = JSON.parse(event.target.response);
    //       console.log('XMLHttpRequest event.target = ', times2, that.responseText3);
    //     } catch (e) {
    //       console.log('Error in parse attemp # ' + times2);
    //     }
    //   }
    // };
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.send(JSON.stringify(this.findMatchRequest));
  }

  delete(id: string) {
    // DELETE
    const that = this;

    this.authService.getCurrentUser().getSession((err, session) => {
      console.log('JWT token ', session.getIdToken().getJwtToken());

      that.http.delete(
        'https://edv8edmxxj.execute-api.us-east-2.amazonaws.com/development/find-your-match'
        + '?accessToken=' + session.getAccessToken().getJwtToken()
        + '&candidateID=' + id,
        {
          headers: new Headers({ 'Authorization': session.getIdToken().getJwtToken() })
        })
        .subscribe(
          (result: any) => {
            // that.responseText2 = JSON.parse(result.json);
            console.log('result = ', result);
          },
          (error) => {
          }
        );
    });


    // const xhr2 = new XMLHttpRequest();
    // xhr2.open('DELETE', 'https://edv8edmxxj.execute-api.us-east-2.amazonaws.com/development/find-your-match');
    // xhr2.onreadystatechange = function (event: any) {
    //   // console.log('XMLHttpRequest event.target = ', event.target.responseText);
    //   that.responseText2 = event.target.responseText;
    // };
    // xhr2.setRequestHeader('Content-Type', 'application/json');
    // xhr2.send();

  }

  get(type: string, id: string) {
    // GET
    console.log('type', type);
    const that = this;
    return new Promise((resolve, reject) => {
      this.authService.getCurrentUser().getSession((err, session) => {
        console.log('JWT token ', session.getIdToken().getJwtToken());
        that.http.get('https://edv8edmxxj.execute-api.us-east-2.amazonaws.com/development/find-your-match/'
          + type
          + '?accessToken=' + session.getAccessToken().getJwtToken()
          + '&candidateID=' + id,
          {
            headers: new Headers({ 'Authorization': session.getIdToken().getJwtToken() })
          })
          .subscribe(
            (result: any) => {
              const data = JSON.parse(result._body);
              console.log('result = ', data);
              resolve(data);
            },
            (error) => {
              reject(error);
            }
          );
      });
    });

    // const xhr3 = new XMLHttpRequest();
    // xhr3.open('GET', 'https://edv8edmxxj.execute-api.us-east-2.amazonaws.com/development/find-your-match/' + type);
    // let times = 0;
    // xhr3.onreadystatechange = function (event: any) {
    //   if (event.target.response) {
    //     try {
    //       times++;
    //       that.responseText3 = JSON.parse(event.target.response);
    //       console.log('XMLHttpRequest event.target = ', times, that.responseText3);
    //     } catch (e) {
    //       console.log('Error in parse attemp # ' + times);
    //     }
    //   }
    // };
    // xhr3.setRequestHeader('Content-Type', 'application/json');
    // xhr3.send();
  }

}
