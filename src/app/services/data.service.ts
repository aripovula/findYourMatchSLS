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
  stageURL =
  // 'https://edv8edmxxj.execute-api.us-east-2.amazonaws.com/development';
  'https://62zvlk9vrc.execute-api.us-east-1.amazonaws.com/development';
  extn1 = '/find-your-match';
  extn2 = '/start-relations/audio';
  extn3 = '/start-relations/imagerekog';

  constructor(private http: Http, private authService: CognitoService) { }

  // Code of all Lambda functions in AWS Lambda are also provided in AWS-BACK-UP folder in this repository

  post(candidate: Candidate) {
    this.findMatchRequest = new FindMatchRequest(candidate);
    console.log('this.findMatchRequest = ', this.findMatchRequest);

    const that = this;
    // POST
    return new Promise((resolve, reject) => {
      this.authService.getCurrentUser().getSession((err, session) => {
        console.log('ID token ', session.getIdToken().getJwtToken());
        console.log('ACCESS token ', session.getAccessToken().getJwtToken());

        that.http.post(
          this.stageURL + this.extn1
          + '?accessToken=' + session.getAccessToken().getJwtToken(),
          that.findMatchRequest, {
            headers: new Headers({
              'Authorization': session.getIdToken().getJwtToken()
            })
          })
          .subscribe(
            (result: any) => {
              // that.responseText1 = JSON.parse(result.json);
              console.log('result = ', result);
              resolve();
            },
            (error) => {
              reject();
            }
          );
      });
    });
  }

  delete(id: string) {
    // DELETE
    const that = this;
    return new Promise((resolve, reject) => {
      this.authService.getCurrentUser().getSession((err, session) => {
        console.log('JWT token ', session.getIdToken().getJwtToken());

        that.http.delete(
          this.stageURL + this.extn1
          + '?accessToken=' + session.getAccessToken().getJwtToken()
          + '&candidateID=' + id,
          {
            headers: new Headers({ 'Authorization': session.getIdToken().getJwtToken() })
          })
          .subscribe(
            (result: any) => {
              // that.responseText2 = JSON.parse(result.json);
              console.log('result = ', result);
              resolve();
            },
            (error) => {
              reject();
            }
          );
      });
    });
  }

  get(type: string, id: string) {
    // GET
    console.log('type', type);
    const that = this;
    return new Promise((resolve, reject) => {
      this.authService.getCurrentUser().getSession((err, session) => {
        console.log('JWT token ', session.getIdToken().getJwtToken());
        that.http.get(
          this.stageURL + this.extn1 + '/'
          + type
          + '?'
          + 'accessToken=' + session.getAccessToken().getJwtToken() + '&'
          + 'candidateID=' + id,
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
  }

  getAudio(type: string, id: string) {
    // GET
    console.log('type', type);
    const that = this;
    return new Promise((resolve, reject) => {
      this.authService.getCurrentUser().getSession((err, session) => {
        console.log('JWT token ', session.getIdToken().getJwtToken());
        that.http.get(
          this.stageURL + this.extn2 + '/'
          + type
          + '?'
          + 'accessToken=' + session.getAccessToken().getJwtToken() + '&'
          + 'candidateID=' + id + '&'
          + 'requestorID=' + id,
          {
            headers: new Headers(
              // { 'Authorization': session.getIdToken().getJwtToken() }
            )
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
  }

  getInfoOnURLImage(type: string, id: string, imageUrl: string) {
    // GET
    console.log('type', type);
    console.log('encodeURIComponent(imageUrl) = ', encodeURIComponent(imageUrl));
    const that = this;
    return new Promise((resolve, reject) => {
      this.authService.getCurrentUser().getSession((err, session) => {
        console.log('JWT token ', session.getIdToken().getJwtToken());
        that.http.get(
          this.stageURL + this.extn3
          // + '/'
          // + type
          + '?'
          + 'accessToken=' + session.getAccessToken().getJwtToken() + '&'
          + 'candidateID=' + id + '&'
          + 'requestorID=' + id + '&'
          + 'type=' + type + '&'
          + 'imageUrl=' + encodeURIComponent(imageUrl),
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
  }

  postImage(image: any) {

    const that = this;
    const imageObj = { image: JSON.stringify(image) };
    // POST
    return new Promise((resolve, reject) => {
      this.authService.getCurrentUser().getSession((err, session) => {
        // console.log('ID token ', session.getIdToken().getJwtToken());
        // console.log('ACCESS token ', session.getAccessToken().getJwtToken());

        console.log('sending post');
        that.http.post(
          this.stageURL + this.extn3
          + '?accessToken='
          + session.getAccessToken().getJwtToken(),
          imageObj,
          {
            headers: new Headers({
              'Authorization': session.getIdToken().getJwtToken()
            })
          })
          .subscribe(
            (result: any) => {
              // that.responseText1 = JSON.parse(result.json);
              console.log('result = ', result);
              resolve();
            },
            (error) => {
              reject();
            }
          );
      });
    });
  }
}
