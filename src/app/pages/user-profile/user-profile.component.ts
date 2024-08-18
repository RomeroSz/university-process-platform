import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/services/spinner.service';
import { StudentsService } from 'src/app/services/students.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  adminForm: FormGroup;
  submitted = false;
  admins: any[] = [];
  passwordVisible = false;
  passwordVisible2 = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private studentService: StudentsService, private spinner: SpinnerService) { }

  ngOnInit(): void {
    this.adminFormFunction();
    this.fetchAdmins();
  }

  fetchAdmins(): void {
    this.spinner.showSpinner();
    this.userService.getAllAdmins().subscribe(
      (users: any) => {
        this.admins = users;
        this.spinner.hideSpinner();
      },
      (error: any) => {
        console.error('Error fetching users:', error);
        this.spinner.hideSpinner();
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.adminForm.valid) {
      this.createAdmin();
    }
  }

  createAdmin() {
    this.spinner.showSpinner();
    this.userService.createAdminUser(this.adminForm.value)
      .subscribe(
        (resp: any) => {
          if (resp && resp.user && resp.user.createdUser) {
            window.scrollTo(0, 0);
            this.adminForm.reset();
            this.submitted = false;
            this.spinner.hideSpinner();
            this.fetchAdmins();
          }
          else {
            console.error('Error:', resp && resp.message);
            this.spinner.hideSpinner();
          }
        },
        (error: any) => {
          console.error('Error creating student:', error);
          this.spinner.hideSpinner();
        }
      );
  }

  adminFormFunction() {
    this.adminForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[\w\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,16}$/)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[\w\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,16}$/)]],
      primer_nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      primer_apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      cedula: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^(0412|0414|0424|0416|0426)\d{7}$/)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      observaciones: [null]
    }, {
      validator: this.passwordsAreEqual
    });
  }

  passwordsAreEqual(formGroup: FormGroup): { [key: string]: any } | null {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (passwordControl && confirmPasswordControl && passwordControl.value !== confirmPasswordControl.value) {
      return { passwordsNotMatching: true };
    }

    return null;
  }
}