import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError, map, switchMap, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from './login-service.service';
import { NotifierService } from 'angular-notifier';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.APIURL;

  constructor(private http: HttpClient, private loginService: LoginService, private notifier: NotifierService, private spinner: SpinnerService) {}

  createStudentUser(userData: any): Observable<any> {
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
        const url = `${this.apiUrl}users`;
        userData.roleId = 1;
        return new Observable(observer => {
          this.http.post<any>(url, userData, httpOptions)
            .subscribe(
              (resp: any) => {
                observer.next(resp);
                observer.complete();
                this.notifier.notify('success', `Se ha creado el usuario correctamente`);
                this.spinner.hideSpinner();
              },
              (error: any) => {
                console.error('Error creating user:', error);
                console.error('Error:', error?.error?.message || error?.message);
                // this.notifier.notify('error', `No se ha podido crear el usuario`);
                this.spinner.hideSpinner();
                if (error.status === 0) {
                } else {
                }
                observer.error(error);
              },
              () => {
                this.spinner.hideSpinner();
              }
            );
        });
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        this.spinner.hideSpinner();
        return of(null);
      })
    );
  }

  createEntregaStudent(userData: any): Observable<any> {
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
        const url = `${this.apiUrl}serviciocomunitario/createentrega`;
        return new Observable(observer => {
          this.http.post<any>(url, userData, httpOptions)
            .subscribe(
              (resp: any) => {
                observer.next(resp);
                observer.complete();
                this.notifier.notify('success', `Se ha creado la entrega correctamente`);
                this.spinner.hideSpinner();
              },
              (error: any) => {
                console.error('Error creating user:', error);
                console.error('Error:', error?.error?.message || error?.message);
                const errorMessage = error.error.message || 'Error creación de horas del usuario';
              // this.notifier.notify('error', errorMessage);
                if (error.status === 0) {
                } else {
                }
                observer.error(error);
                this.spinner.hideSpinner();
              },
              () => {
                this.spinner.hideSpinner();
              }
            );
        });
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        return of(null);
      })
    );
  }

  createCertificadoStudent(id_estudiante: any): Observable<any> {
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
        const url = `${this.apiUrl}serviciocomunitario/createcertificado`;
        return new Observable(observer => {
          this.http.post<any>(url, {id_estudiante}, httpOptions)
            .subscribe(
              (resp: any) => {
                observer.next(resp);
                observer.complete();
                this.notifier.notify('success', `Estudiante ha finalizado el servicio correctamente`);
                this.notifier.notify('info', `Certificado del estudiante creado correctamente`);
                this.spinner.hideSpinner();
              },
              (error: any) => {
                console.error('Error creating user:', error);
                console.error('Error:', error?.error?.message || error?.message);
                const errorMessage = error.error.message || 'Error creación de horas del usuario';
              // this.notifier.notify('error', errorMessage);
                if (error.status === 0) {
                } else {
                }
                observer.error(error);
                this.spinner.hideSpinner();
              },
              () => {
                this.spinner.hideSpinner();
              }
            );
        });
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        return of(null);
      })
    );
  }

  createAdminUser(userData: any): Observable<any[]> {
    const accessToken = localStorage.getItem('accessToken');
    return this.loginService.checkAccessToken(accessToken).pipe(
      switchMap((isValid) => {
        if (!isValid) {
          return of(null);
        }
        else {
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${accessToken}`
          });
          const httpOptions = {
            headers: headers,
            responseType: 'json' as 'json'
          };
          const url = `${this.apiUrl}users`;
          userData.roleId = 2;
          return this.http.post<any>(url, userData, httpOptions).pipe(
            map((resp: any) => resp),
            tap((resp: any[]) => {
              this.notifier.notify('success', `Se ha creado el usuario administrativo correctamente`);
              this.spinner.hideSpinner();
               
            }),
            catchError(error => {
              console.error('Error fetching students:', error);
              const errorMessage = error.error.message || 'Error creación de usuario';
              // this.notifier.notify('error', errorMessage);
              this.spinner.hideSpinner();
              return this.handleError(error);
            })
          );
        }
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        this.spinner.hideSpinner();
        return of(null);
      })
    );
  }

  getAllUsers(): Observable<any[]> {
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
        const url = `${this.apiUrl}users`;
        return this.http.get(url, httpOptions)
          .pipe(
            map((resp: any) => resp.users),
            tap((users: any[]) => {
              this.notifier.notify('info', `Datos de usuarios cargados`);
              this.spinner.hideSpinner();
               
            }),
            catchError(error => {
              console.error('Error fetching students:', error);
              // this.notifier.notify('error', `Error buscando usuarios`);
              this.spinner.hideSpinner();
              return this.handleError(error);
            })
          );
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        this.spinner.hideSpinner();
        return of(null);
      })
    );
  }

  getAllStudents(): Observable<any[]> {
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
        const url = `${this.apiUrl}students`;
        return this.http.get(url, httpOptions)
          .pipe(
            map((resp: any) => resp.students),
            tap((students: any[]) => {
              this.notifier.notify('info', `Datos de usuarios cargados`);
              this.spinner.hideSpinner();
               
            }),
            catchError(error => {
              console.error('Error fetching students:', error);
              // this.notifier.notify('error', `Error buscando data de los estudiantes`);
              this.spinner.hideSpinner();
              return this.handleError(error);
            })
          );
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        this.spinner.hideSpinner();
        return of(null);
      })
    );
  }

  getAllAdmins(): Observable<any[]> {
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
        const url = `${this.apiUrl}admins`;
        return this.http.get(url, httpOptions)
          .pipe(
            map((resp: any) => resp.admins),
            tap((admins: any[]) => {
              this.notifier.notify('info', `Datos de usuarios cargados`);
              this.spinner.hideSpinner();
               
            }),
            catchError(error => {
              console.error('Error fetching admins:', error);
              // this.notifier.notify('error', `Error buscando data de los estudiantes`);
              this.spinner.hideSpinner();
              return this.handleError(error);
            })
          );
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        this.spinner.hideSpinner();
        return of(null);
      })
    );
  }

  hoursDeliveredApprovedStudent(id_entrega, cedula): Observable<any[]> {
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
        const url = `${this.apiUrl}serviciocomunitario/entregaapprove/${id_entrega}`;
        const body = { cedula };
        return this.http.put(url, body, httpOptions)
          .pipe(
            map((resp: any) => resp),
            tap((updateStudent: any[]) => {
              this.notifier.notify('success', `Se han aprobado la entrega correctamente`);
              this.spinner.hideSpinner();
               
            }),
            catchError(error => {
              console.error('Error fetching estudianteCedula:', error);
              console.error('Verifica que el metodo put sea el correcto');
              // this.notifier.notify('error', `Error aprobación de entrega`);
              this.spinner.hideSpinner();
              return this.handleError(error);
            })
          );
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        this.spinner.hideSpinner();
        return of(null);
      })
    );
  }

  getAllEntregasStudents(): Observable<any[]> {
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
        const url = `${this.apiUrl}serviciocomunitario/studentsentrega`;
        return this.http.get(url, httpOptions).pipe(
          map((resp: any) => resp.studentEntrega),
          tap((studentEntrega: any[]) => {
            this.notifier.notify('info', `Entregas de los estudiantes cargadas`);
            this.spinner.hideSpinner();
             
          }),
          catchError(error => {
            console.error('Error fetching studentEntrega:', error);
            // this.notifier.notify('error', `Error buscando data de las entregas de los estudiantes`);
            this.spinner.hideSpinner();
            return this.handleError(error);
          })
        );
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        this.spinner.hideSpinner();
        return of(null);
      })
    );
  }

  getEntregasStudentByCedula(cedula): Observable<any[]> {
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
        const url = `${this.apiUrl}serviciocomunitario/studentsentrega/${cedula}`;
        return this.http.get(url, httpOptions).pipe(
          map((resp: any) => resp.studentEntrega),
          tap((studentEntrega: any[]) => {
            this.notifier.notify('info', `Entregas de los estudiantes cargadas`);
            this.spinner.hideSpinner();
             
          }),
          catchError(error => {
            console.error('Error fetching studentEntrega:', error);
            // this.notifier.notify('error', `Error buscando data de las entregas de los estudiantes`);
            this.spinner.hideSpinner();
            return this.handleError(error);
          })
        );
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        this.spinner.hideSpinner();
        return of(null);
      })
    );
  }

  getStudentByCedula(estudianteCedula): Observable<any[]> {
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
        const url = `${this.apiUrl}students/${estudianteCedula}`;
        return this.http.get(url, httpOptions)
          .pipe(
            map((resp: any) => resp.estudianteCedula),
            tap((estudianteCedula: any[]) => {
              this.notifier.notify('info', `Datos de usuarios cargados`);
              this.spinner.hideSpinner();
               
            }),
            catchError(error => {
              console.error('Error fetching estudianteCedula:', error);
              // this.notifier.notify('error', `Error buscando data del estudiante`);
              this.spinner.hideSpinner();
              return this.handleError(error);
            })
          );
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        this.spinner.hideSpinner();
        return of(null);
      })
    );
  }

  getStudentByStatus(id_status): Observable<any[]> {
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
        const url = `${this.apiUrl}students/students/${id_status}`;
        return this.http.get(url, httpOptions)
          .pipe(
            map((resp: any) => resp.studentsEstatusCount),
            tap((studentsEstatusCount: any[]) => {
              this.notifier.notify('info', `Datos de usuarios cargados`);
              this.spinner.hideSpinner();
               
            }),
            catchError(error => {
              console.error('Error fetching estudianteByEstatus', error);
              // this.notifier.notify('error', `Error buscando data del estudiante`);
              this.spinner.hideSpinner();
              return this.handleError(error);
            })
          );
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        this.spinner.hideSpinner();
        return of(null);
      })
    );
  }

  getStudentByUserID(userId): Observable<any[]> {
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
        const url = `${this.apiUrl}users/${userId}`;

        return this.http.get(url, httpOptions)
          .pipe(
            map((resp: any) => resp.user),
            tap((user: any[]) => {
              this.notifier.notify('info', `Datos de usuarios cargados`);
              this.spinner.hideSpinner();
               
            }),
            catchError(error => {
              console.error('Error fetching student:', error);
              // this.notifier.notify('error', `Error buscando data del estudiante`);
              this.spinner.hideSpinner();
              return this.handleError(error);
            })
          );
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        this.spinner.hideSpinner();
        return of(null);
      })
    );
  }

  updateStudentHoursPending(studentHoursFormValues): Observable<any[]> {
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
        const { cedula, cantidad_horas } = studentHoursFormValues
        const url = `${this.apiUrl}serviciocomunitario/${cedula}`;
        return this.http.put(url, { cantidad_horas }, httpOptions)
          .pipe(
            map((resp: any) => resp),
            tap((updateStudent: any[]) => {
              this.notifier.notify('success', `Horas actualizadas con éxito`);
              this.spinner.hideSpinner();
               
            }),
            catchError(error => {
              console.error('Error fetching:', error);
              // this.notifier.notify('error', `Error actualizando data del estudiante`);
              this.spinner.hideSpinner();
              return this.handleError(error);
            })
          );
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        this.spinner.hideSpinner();
        return of(null);
      })
    );

  }

  updateStudentService(editStudentFormValues): Observable<any[]> {
    const { id_brigada, ...rest } = editStudentFormValues;
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
        const url = `${this.apiUrl}students/editstudent`;
        const body = { ...rest, id_brigada: parseInt(id_brigada) };
        return this.http.put(url, body, httpOptions)
          .pipe(
            map((resp: any) => resp),
            tap((updateStudent: any[]) => {
              this.notifier.notify('success', `Estudiante actualizado con éxito`);
              this.spinner.hideSpinner();
               
            }),
            catchError(error => {
              console.error('Error fetching estudianteCedula:', error);
              // this.notifier.notify('error', `Error actualizando data del estudiante`);
              this.spinner.hideSpinner();
              return this.handleError(error);
            })
          );
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        this.spinner.hideSpinner();
        return of(null);
      })
    );
  }

  updateStudentField(cedula, field, value): Observable<any[]> {
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
        const url = `${this.apiUrl}students/updatestudentfield/${cedula}`;
        return this.http.put(url, { field, value }, httpOptions)
          .pipe(
            map((resp: any) => resp),
            tap((updateStudent: any[]) => {
              this.notifier.notify('success', `Estudiante actualizado con éxito`);
              this.spinner.hideSpinner();
               
            }),
            catchError(error => {
              console.error('Error fetching estudianteCedula:', error);
              // this.notifier.notify('error', `Error actualizando data del estudiante`);
              this.spinner.hideSpinner();
              return this.handleError(error);
            })
          );
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        this.spinner.hideSpinner();
        return of(null);
      })
    );
  }

  updateServiceStudentField(cedula, field, value): Observable<any[]> {
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
        const url = `${this.apiUrl}students/updateservicestudentfield/${cedula}`;
        return this.http.put(url, { field, value }, httpOptions)
          .pipe(
            map((resp: any) => resp),
            tap((updateStudent: any[]) => {
              this.notifier.notify('success', `Estudiante actualizado con éxito`);
              this.spinner.hideSpinner();
               
            }),
            catchError(error => {
              console.error('Error fetching estudianteCedula:', error);
              // this.notifier.notify('error', `Error actualizando data del estudiante`);
              this.spinner.hideSpinner();
              return this.handleError(error);
            })
          );
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        this.spinner.hideSpinner();
        return of(null);
      })
    );
  }

  getStudentsCount(): Observable<any[]> {
    const accessToken = localStorage.getItem('accessToken');
    return this.loginService.checkAccessToken(accessToken).pipe(
      switchMap((isValid) => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${accessToken}`
        });
        const url = `${this.apiUrl}students/studentsCount`;
        const httpOptions = {
          headers: headers,
          responseType: 'json' as 'json'
        };
        return this.http.get(url, httpOptions)
          .pipe(
            map((resp: any) => resp.studentsCount),
            tap((studentsCount: any[]) => {
              this.spinner.hideSpinner();
               
            }),
            catchError(error => {
              console.error('Error fetching studentsCount count:', error);
              // this.notifier.notify('error', `Error buscando conteo del estudiante`);
              this.spinner.hideSpinner();
              return this.handleError(error);
            })
          );
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        this.spinner.hideSpinner();
        return of(null);
      })
    );
  }

  getstudentsApprovedCount(estatus): Observable<any[]> {
    const accessToken = localStorage.getItem('accessToken');
    return this.loginService.checkAccessToken(accessToken).pipe(
      switchMap((isValid) => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${accessToken}`
        });
        const url = `${this.apiUrl}students/studentsCount/${estatus}`;
        const httpOptions = {
          headers: headers,
          responseType: 'json' as 'json'
        };
        return this.http.get(url, httpOptions)
          .pipe(
            map((resp: any) => resp.studentsEstatusCount),
            tap((resp: any) => {
              this.spinner.hideSpinner();
               
            }),
            catchError(error => {
              console.error('Error fetching studentsApprovedCount count:', error);
              // this.notifier.notify('error', `Error buscando conteo del estudiante`);
              this.spinner.hideSpinner();
              return this.handleError(error);
            })
          );
      }),
      catchError(error => {
        console.error('Error checking access token:', error);
        // this.notifier.notify('error', `Error en la sesión de usuario`);
        this.spinner.hideSpinner();
        return of(null);
      })
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error:', error);
    return throwError('Error de inicio de sesión');
  }
}