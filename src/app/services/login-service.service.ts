import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.APIURL;

  constructor(private http: HttpClient, private router: Router) { }

  login(formData: any): Observable<{ user: any, tokens: any }> {
    const user = { "id": 1, "role_id": 2, "email": "admin@admin", "role.id": 2, "role.name": "admin" };
    const accessToken = true;
    const refreshToken = true;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', JSON.stringify(accessToken));
    localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
    // this.router.navigate(['/admin/home']);
    if (user.role_id === 1) {
      this.router.navigate(['/student/registro-horas']);
    } else if (user.role_id === 2) {
      this.router.navigate(['/admin/home']);
    }
    return of({
      user: { "id": 1, "role_id": 2, "email": "admin@admin", "role.id": 2, "role.name": "admin" },
      tokens: { access: true, refresh: true }
    });
    // const url = `${this.apiUrl}auth/login`;
    // return this.http.post<{ user: any, tokens: any }>(url, formData, { responseType: 'json' })
    //   .pipe(
    //     map((resp: { user: any, tokens: any }) => {
    //       const user = resp.user;
    //       const accessToken = resp.tokens.access.token;
    //       const refreshToken = resp.tokens.refresh.token;
    //       localStorage.setItem('user', JSON.stringify(user));
    //       localStorage.setItem('accessToken', accessToken);
    //       localStorage.setItem('refreshToken', refreshToken);
    //       // this.router.navigate(['/admin/home']);
    //       if (user.role_id === 1) {
    //         this.router.navigate(['/student/registro-horas']);
    //       } else if (user.role_id === 2) {
    //         this.router.navigate(['/admin/home']);
    //       }
    //       return {
    //         user,
    //         tokens: { access: accessToken, refresh: refreshToken }
    //       };
    //     }),
    //     catchError(error => {
    //       console.error('Error creating user:', error);
    //       console.error('Error:', error?.error?.message || error?.message);
    //       if (error.status === 0) {
    //       } else {
    //       }
    //       return throwError(error);
    //     })
    //   );
  }

  checkAccessToken(accessToken: string): Observable<boolean> {
    if (!accessToken) {
      this.router.navigate(['/login']);
    }
    const url = `${this.apiUrl}check-access-token`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.get<{ valid: boolean }>(url, { headers })
      .pipe(
        map(resp => {
          const user = JSON.parse(localStorage.getItem('user') as string);
          return resp.valid && user.role_id === 2;
        }),
        catchError(error => {
          if (error.status === 500 && error.error.message === 'jwt expired') {
            this.router.navigate(['/login']);
            return of(false);
          }
          console.error('Error checking access token:', error);
          console.error('Error:', error?.error?.message || error?.message);
          return throwError(error);
        })
      );
  }
  checkAccessTokenStudent(accessToken: string): Observable<boolean> {
    if (!accessToken) {
      this.router.navigate(['/login']);
    }
    const url = `${this.apiUrl}check-access-token`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.get<{ valid: boolean }>(url, { headers })
      .pipe(
        map(resp => {
          const user = JSON.parse(localStorage.getItem('user') as string);
          return resp.valid && user.role_id === 1;
        }),
        catchError(error => {
          if (error.status === 500 && error.error.message === 'jwt expired') {
            this.router.navigate(['/login']);
            return of(false);
          }
          console.error('Error checking access token:', error);
          console.error('Error:', error?.error?.message || error?.message);
          return throwError(error);
        })
      );
  }
  checkAccessTokenAdmin(accessToken: string): Observable<boolean> {
    if (!accessToken) {
      this.router.navigate(['/login']);
      return of(false)
    }
    return of(true)
    // const url = `${this.apiUrl}check-access-token`;
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${accessToken}`
    // });
    // return this.http.get<{ valid: boolean }>(url, { headers })
    //   .pipe(
    //     map(resp => {
    //       const user = JSON.parse(localStorage.getItem('user') as string);
    //       return resp.valid && user.role_id === 2;
    //     }),
    //     catchError(error => {
    //       if (error.status === 500 && error.error.message === 'jwt expired') {
    //         this.router.navigate(['/login']);
    //         return of(false);
    //       }
    //       console.error('Error checking access token:', error);
    //       console.error('Error:', error?.error?.message || error?.message);
    //       return throwError(error);
    //     })
    //   );
  }

  private handleError(error: any): Observable<never> {
    // Implementa el manejo de errores aquí
    // (por ejemplo, muestra un mensaje de error al usuario)
    console.error('Error:', error);
    return throwError('Error de inicio de sesión');
  }
}
