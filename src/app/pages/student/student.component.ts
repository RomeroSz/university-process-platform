import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/services/spinner.service';
import { StudentsService } from 'src/app/services/students.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  studentForm: FormGroup;
  submitted = false;
  passwordVisible = false;
  passwordVisible2 = false;
  carreras = [];
  menciones = [];
  brigadas = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private studentService: StudentsService, private spinner: SpinnerService) { }

  ngOnInit(): void {
    this.fetchBrigadas();
    this.fetchCarreras();
    this.fetchMenciones();
    this.studentFormFunction();
  }
  onSubmit() {
    this.submitted = true;
    if (this.studentForm.valid) {
      this.createStudent();
    }
  }
  fetchBrigadas(): void {
    this.spinner.showSpinner();
    this.studentService.getAllBrigadas().subscribe(
      (brigadas: any) => {
        this.brigadas = brigadas;
        this.spinner.hideSpinner();
      },
      (error: any) => {
        console.error('Error fetching brigadas:', error);
      }
    );
  }
  fetchCarreras(): void {
    this.spinner.showSpinner();
    this.studentService.getAllCarreras().subscribe(
      (carreras: any) => {
        this.carreras = carreras;
        this.spinner.hideSpinner();
      },
      (error: any) => {
        console.error('Error fetching brigadas:', error);
        this.spinner.hideSpinner();
      }
    );
  }
  fetchMenciones(): void {
    this.spinner.showSpinner();
    this.studentService.getAllMenciones().subscribe(
      (menciones: any) => {
        this.menciones = menciones;
        this.spinner.hideSpinner();
      },
      (error: any) => {
        console.error('Error fetching menciones:', error);
        this.spinner.hideSpinner();
      }
    );
  }

  goToStudentControl() {
    this.router.navigate(['/admin/control-estudiantes']);
  }
  createStudent() {
    this.spinner.showSpinner();
    this.userService.createStudentUser(this.studentForm.value)
      .subscribe(
        (resp: any) => {
          if (resp && resp.user.createdUser) {
            window.scrollTo(0, 0);
            this.studentForm.reset();
            this.submitted = false;
            this.spinner.hideSpinner(); 
          }
          else {
            console.error('Error:', resp.message);
            this.spinner.hideSpinner();
          }
        },
        (error: any) => {
          console.error('Error creating student:', error);
          this.spinner.hideSpinner();
        }
      );
  }

  studentFormFunction() {
    this.studentForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[\w\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,16}$/)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[\w\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,16}$/)]],
      primer_nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      segundo_nombre: [null, [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]],
      primer_apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      segundo_apellido: [null, [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]],
      cedula: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^(0412|0414|0424|0416|0426)\d{7}$/)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      id_carrera: [null, Validators.required],
      id_mencion: [null, Validators.required],
      id_brigada: [null, Validators.required],
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

