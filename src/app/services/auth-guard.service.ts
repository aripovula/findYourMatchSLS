import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CognitoService } from './cognito.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: CognitoService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>
    | Promise<boolean>
    | boolean {
    const isLoggedIn = this.authService.isLoggedIn;
    return isLoggedIn;
  }
}
