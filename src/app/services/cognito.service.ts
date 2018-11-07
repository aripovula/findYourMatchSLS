import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';

// import { Subject } from 'rxjs/internal/Subject';
// import { Observable } from 'rxjs/internal/Observable';
// import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  poolData = {
    UserPoolId: 'us-east-2_XUFaLomWO',
    ClientId: '531ogvs2lm67fnifmvmd3mjnv4'
  };
  cognitoUser: CognitoUser;
  constructor(private router: Router) { }

  signInOrSignUp(userName, password) {
    return new Promise((resolve, reject) => {
      let message = '';
      const attributeList: CognitoUserAttribute[] = [];
      const userPool = new CognitoUserPool(this.poolData);
      const user = {
        userName,
        password
      };

      const dataPreferredUsername = {
        Name: 'preferred_username',
        Value: user.userName
      };

      attributeList.push(new CognitoUserAttribute(dataPreferredUsername));

      userPool.signUp(user.userName, user.password, attributeList, null, (err, result) => {
        if (err) {
          message = err.message || JSON.stringify(err);
          // alert(message);
          resolve(message);
        } else {
          this.cognitoUser = result.user;
          console.log('user name is ' + this.cognitoUser.getUsername());
          resolve(message);
        }
      });
      return;
    });
  }

}


