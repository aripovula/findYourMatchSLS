import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

// import { Subject } from 'rxjs/internal/Subject';
// import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  poolData =
  { UserPoolId: 'us-east-1_6wmO1o7KH', ClientId: '7jhakhv82f1t8c8svgg417n4go' };
  // { UserPoolId: 'us-east-2_XUFaLomWO', ClientId: '531ogvs2lm67fnifmvmd3mjnv4' };
  userPool = new CognitoUserPool(this.poolData);
  isLoggedInSubject = new BehaviorSubject<boolean>(false);
  LoggedInUsername = new BehaviorSubject<string>('');
  ErrorMessage = new BehaviorSubject<string>('');
  isLoggedIn = false;
  isNotFirstTime = false;
  cognitoUser: CognitoUser;

  constructor(private router: Router) { }

  // Code of all Lambda functions in AWS Lambda are also provided in AWS-BACK-UP folder in this repository

  subscribeToStatus() {
    console.log('in subscribeToStatus');
    this.isLoggedInSubject.subscribe(
      (status) => {
        console.log('status = ', status);
        this.isLoggedIn = status;
      }
    );
  }

  signUp(userName, password) {
    const that = this;
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

    that.userPool.signUp(user.userName, user.password, attributeList, null, (err, result) => {
      if (err) {
        message = err.message || JSON.stringify(err);
        that.ErrorMessage.next(message);
      } else {
        if (!that.isNotFirstTime) {
          that.isNotFirstTime = true;
          that.signIn(userName, password);
        } else {
          that.ErrorMessage.next('Sign you failed !');
        }
      }
    });
    return;
  }

  signIn(userName, password) {
    const that = this;
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
          console.log('Logged in result ', result);
          that.isLoggedInSubject.next(true);
          that.isNotFirstTime = false;
          that.cognitoUser = cognitoUser;
          console.log('cognitoUser = ', cognitoUser);
          that.LoggedInUsername.next(cognitoUser.getUsername());
        },

        onFailure: function (err) {
          console.log(err.message || JSON.stringify(err));
          that.signUp(userName, password);
        },
      });

  }

  getCurrentUser() {
    console.log('getCurrentUser11-', this.userPool.getCurrentUser());
    return this.userPool.getCurrentUser();
  }

  getUserData() {
    return this.cognitoUser;
  }

  isSessionValid() {
    console.log('in isSessionValid');

    const that = this;
    let isValid = false;
      this.cognitoUser = this.getCurrentUser();
      console.log('this.cognitoUser = ', this.cognitoUser);

      if (this.cognitoUser == null) {
        isValid = false;
        that.isLoggedInSubject.next(isValid);
        return isValid;
      }

    if (this.cognitoUser != null) {
      this.cognitoUser.getSession((err, session) => {
        if (err) {
          that.ErrorMessage.next(err.message || JSON.stringify(err));
          isValid = false;
          that.isLoggedInSubject.next(isValid);
          return isValid;
        } else if (session.isValid()) {
          isValid = true;
          that.isLoggedInSubject.next(isValid);
          that.LoggedInUsername.next(that.cognitoUser.getUsername());
          return isValid;
        }
      });
    }
    console.log('isValid last - ' + isValid);

    return isValid;
  }

  logOut() {
    const that = this;
    this.cognitoUser = this.getCurrentUser();
    this.cognitoUser.getSession((err, result) => {
      if (err) {
        that.ErrorMessage.next(err.message || JSON.stringify(err));
        return;
      }

      that.cognitoUser.globalSignOut({
        onSuccess: function (result2) {
          that.isLoggedInSubject.next(false);
          console.log('Global SignOut - success');
        },

        onFailure: function (err2) {
          that.ErrorMessage.next(err2.message || JSON.stringify(err));
          console.log('Global SignOut - failure', err2);
        },
      });
      this.router.navigate(['/home']);
    });
  }

}


