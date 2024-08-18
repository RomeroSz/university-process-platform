import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { UserService } from 'src/app/services/user.service';
import { LoginService } from '../services/login-service.service';

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService, private loginService: LoginService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.checkLoggedUser().pipe(
      switchMap(isLogged => {
        if (!isLogged) {
          return this.navigateToLogin();
        }
        return this.checkAccessToken();
      }),
      catchError(() => of(false))
    );
  }

  private checkLoggedUser(): Observable<boolean> {
    const user = localStorage.getItem('user');
    return of(!!user);
  }

  private checkAccessToken(): Observable<boolean> {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return of(false);
    }
    return this.loginService.checkAccessTokenStudent(accessToken).pipe(
      map(isValid => !!isValid)
    );
  }

  private navigateToLogin(): Observable<UrlTree> {
    const url = this.router.createUrlTree(['/login']);
    return of(url);
  }
}
