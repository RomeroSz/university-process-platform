import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap, catchError, throwError, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from './login-service.service';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  private apiUrl = environment.APIURL;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  getAllBrigadas(): Observable<any[]> {
    const accessToken = localStorage.getItem('accessToken');
    return this.loginService.checkAccessToken(accessToken).pipe(
      switchMap((isValid) => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${accessToken}`
        });
        const httpOptions = {
          headers: headers,
          responseType: 'json' as 'json'
        };
        const url = `${this.apiUrl}staticData/brigada`;
        return this.http.get(url, httpOptions)
          .pipe(
            map((resp: any) => resp.brigada),
            tap((brigada: any[]) => {
               
            }),
            catchError(error => {
              console.error('Error fetching brigada:', error);
              return this.handleError(error);
            })
          );
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        return of(null);
      })
    );
  }
  
  getAllCarreras(): Observable<any[]> {
    const accessToken = localStorage.getItem('accessToken');
    return this.loginService.checkAccessToken(accessToken).pipe(
      switchMap((isValid) => {

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${accessToken}`
        });
        const httpOptions = {
          headers: headers,
          responseType: 'json' as 'json'
        };
        const url = `${this.apiUrl}staticData/carrera`;
        return this.http.get(url, httpOptions)
          .pipe(
            map((resp: any) => resp.carrera),
            tap((carrera: any[]) => {
               
            }),
            catchError(error => {
              console.error('Error fetching carrera:', error);
              return this.handleError(error);
            })
          );
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        return of(null);
      })
    );
  }

  getAllMenciones(): Observable<any[]> {
    const accessToken = localStorage.getItem('accessToken');
    return this.loginService.checkAccessToken(accessToken).pipe(
      switchMap((isValid) => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${accessToken}`
        });
        const httpOptions = {
          headers: headers,
          responseType: 'json' as 'json'
        };
        const url = `${this.apiUrl}staticData/mencion`;
        return this.http.get(url, httpOptions)
          .pipe(
            map((resp: any) => resp.mencion),
            tap((mencion: any[]) => {
               
            }),
            catchError(error => {
              console.error('Error fetching mencion:', error);
              return this.handleError(error);
            })
          );
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        return of(null);
      })
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error:', error);
    return throwError('Error de inicio de sesión');
  }
}
