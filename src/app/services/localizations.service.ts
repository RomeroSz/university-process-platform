import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalizationsService {

  private mainroute = 'ubication';
  private apiUrl = `${environment.APIURL}${this.mainroute}/`;

  constructor(private http: HttpClient) { }

  getCountrys(): Observable<any[]> {
    const accessToken = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const httpOptions = {
      headers: headers,
      responseType: 'json' as 'json'
    };
    const url = `${this.apiUrl}pais`;
    return this.http.get(url, httpOptions)
      .pipe(
        map((resp: any) => resp.pais), // Accede a la propiedad 'pais'
        tap((pais: any[]) => {
           
        }),
        catchError(error => {
          console.error('Error fetching pais:', error);
          return this.handleError(error);
        })
      );
  }
  getStates(): Observable<any[]> {
    const accessToken = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const httpOptions = {
      headers: headers,
      responseType: 'json' as 'json'
    };
    const url = `${this.apiUrl}estado`;
    return this.http.get(url, httpOptions)
      .pipe(
        map((resp: any) => resp.estado), // Accede a la propiedad 'estado'
        tap((estado: any[]) => {
           
        }),
        catchError(error => {
          console.error('Error fetching estado:', error);
          return this.handleError(error);
        })
      );
  }
  getMuns(): Observable<any[]> {
    const accessToken = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const httpOptions = {
      headers: headers,
      responseType: 'json' as 'json'
    };
    const url = `${this.apiUrl}municipio`;
    return this.http.get(url, httpOptions)
      .pipe(
        map((resp: any) => resp.municipio), // Accede a la propiedad 'municipio'
        tap((municipio: any[]) => {
           
        }),
        catchError(error => {
          console.error('Error fetching municipio:', error);
          return this.handleError(error);
        })
      );
  }
  getParrs(): Observable<any[]> {
    const accessToken = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const httpOptions = {
      headers: headers,
      responseType: 'json' as 'json'
    };
    const url = `${this.apiUrl}parroquia`;
    return this.http.get(url, httpOptions)
      .pipe(
        map((resp: any) => resp.parroquia), // Accede a la propiedad 'parroquia'
        tap((parroquia: any[]) => {
           
        }),
        catchError(error => {
          console.error('Error fetching parroquia:', error);
          return this.handleError(error);
        })
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error:', error);
    return throwError('Error en la llamada a la API');
  }
}
