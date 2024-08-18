import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router'; // Agregamos la importación del Router y ActivatedRoute
import { Observable, of, map } from 'rxjs';
import { LoginService } from 'src/app/services/login-service.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  passwordVisible = false;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router, private spinner: SpinnerService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    this.spinner.showSpinner();
    this.submitted = true;
    if (this.loginForm.valid) {
      const formData = this.loginForm.value; // Obtiene los valores del formulario
      this.loginService.login(formData).subscribe(
        (response) => {
          this.submitted = false;
          this.spinner.hideSpinner();
          // Maneja la respuesta exitosa (por ejemplo, redirige al usuario)
        },
        (error) => {
          this.submitted = false;
          this.spinner.hideSpinner();
          // Maneja el error (muestra un mensaje de error al usuario)
          console.error('Error de inicio de sesión:', error);
        }
      );
    }
    else {
      this.submitted = false;
      this.spinner.hideSpinner();
    }
  }

  ngOnInit() {
    this.checkAccessToken().subscribe(
      isValid => {
        if (isValid) {
          const user = JSON.parse(localStorage.getItem('user'));
          if (this.checkIfAuthGuardPassed()) {
            this.navigateToHome(user, true);
          }
        }
      }
    );
  }

  private checkAccessToken(): Observable<boolean> {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return of(false);
    }
    return this.loginService.checkAccessToken(accessToken).pipe(
      map(isValid => !!isValid)
    );
  }

  private navigateToHome(user: any, fromLocalStorage: boolean) {
    const navigationExtras: NavigationExtras = {
      state: { user }
    };
    if (fromLocalStorage) {
      navigationExtras.replaceUrl = true;
    }
    this.router.navigate(['/admin/home'], navigationExtras);
  }

  private checkIfAuthGuardPassed(): boolean {
    const isAuthenticated = localStorage.getItem('accessToken') !== null;
    return isAuthenticated && this.router.url.includes('/login');
  }
}




