import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

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
  userPool = new CognitoUserPool(this.poolData);

  cognitoUser: CognitoUser;
  constructor(private router: Router) { }

  // Code of all Lambda functions in AWS Lambda are also provided in AWS-BACK-UP folder in this repository

  signUp(userName, password) {
    return new Promise((resolve, reject) => {
      let message = '';
      const attributeList: CognitoUserAttribute[] = [];

      const user = {
        userName,
        password
      };

      const dataPreferredUsername = {
        Name: 'preferred_username',
        Value: user.userName
      };

      attributeList.push(new CognitoUserAttribute(dataPreferredUsername));

      this.userPool.signUp(user.userName, user.password, attributeList, null, (err, result) => {
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

  signIn(userName, password) {
    const that = this;
    return new Promise((resolve, reject) => {
      // let message = '';

      const authenticationData = {
        Username: userName,
        Password: password,
      };
      const authenticationDetails = new AuthenticationDetails(authenticationData);
      const userData = {
        Username: userName,
        Pool: this.userPool
      };
      const cognitoUser = new CognitoUser(userData);
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          // const accessToken = result.getAccessToken().getJwtToken();
          console.log('Logged in ');
          that.router.navigate(['/all_users_admin_only']);
        },

        onFailure: function (err) {
          console.log(err.message || JSON.stringify(err));
          that.signUp(userName, password);
        },
      });
    });
  }

  getCurrentUser() {
    return this.userPool.getCurrentUser();
  }

  getUserData() {
    return this.cognitoUser;
  }

  isSessionValid() {
    if (this.cognitoUser == null) {
      this.cognitoUser = this.getCurrentUser();
    }
    if (this.cognitoUser != null) {
      this.cognitoUser.getSession((err, session) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return false;
        } else if (session.isValid()) {
          return true;
        }
        return false;
      });
    }
  }

  isCurrentUserAuthenticated() {
    this.cognitoUser = this.getCurrentUser();
    if (this.cognitoUser == null) {
      return false;
    } else {
      this.cognitoUser.getSession((err, session) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return false;
        } else {
          if (session.isValid()) {
            this.cognitoUser.getUserAttributes(function (err2, attributes) {
              if (err2) {
                // Handle error
              } else {
                console.log('attributes = ' + attributes);
              }
            });
            return true;
          } else {
            return false;
          }
        }
      });
    }
  }

  logOut() {
    this.cognitoUser = this.getCurrentUser();
    this.cognitoUser.getSession((err, result) => {
      if (err) {
        console.log('failed to get the user session', err);
        return;
      }

      this.cognitoUser.globalSignOut({
        onSuccess: function (result2) {
          console.log('Global SignOut - success');
        },

        onFailure: function (err2) {
          console.log('Global SignOut - failure', err2);
        },
      });
      this.router.navigate(['/home']);
    });
  }
}


