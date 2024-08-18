import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { SpinnerService } from 'src/app/services/spinner.service';
import { StudentsService } from 'src/app/services/students.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-hours-student',
  templateUrl: './add-hours-student.component.html',
  styleUrls: ['./add-hours-student.component.scss']
})
export class AddHoursStudentComponent implements OnInit {

  studentForm: FormGroup;
  submittedHours = false;
  student = [];
  studentSelected = null;

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private studentService: StudentsService, private spinner: SpinnerService, private notifier: NotifierService) { }

  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      cedula: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      cantidad_horas: [null, Validators.required],
    });
    this.fetchStudentHoursSystem();
  }

  fetchStudentHoursSystem() {
    this.spinner.showSpinner();
    const user = JSON.parse(localStorage.getItem('user') as string);
    this.userService.getStudentByUserID(user.id).subscribe(
      (studentResp: any) => {
        this.userService.getStudentByCedula(studentResp.student.cedula).subscribe(
          (studentCedula: any) => {
            this.student = []
            this.student = studentCedula;
            this.studentSelected = studentCedula[0];
            this.studentForm.patchValue({
              cedula: studentCedula[0].cedula,
            });
            this.spinner.hideSpinner();
          },
          (error: any) => {
            console.error('Error fetching studentCedula:', error);
            this.spinner.hideSpinner();
          }
        );
      },
      (error: any) => {
        console.error('Error fetching studentCedula:', error);
        this.spinner.hideSpinner();
      }
    );
  }

  onSubmit() {
    this.submittedHours = true;
    if (this.studentForm.valid) {
      this.createEntregaStudent(this.studentForm.value)
    }
  }

  createEntregaStudent(studentHoursFormValues): void {
    this.spinner.showSpinner();
    const cantidadHoras = studentHoursFormValues.cantidad_horas;
    if (cantidadHoras < 1 || cantidadHoras > 20) {
      this.notifier.notify('error', `Horas de estudio permitidas entre 1 y 20`);
      this.submittedHours = false;
      this.spinner.hideSpinner();
    }
    else{
      this.userService.createEntregaStudent(studentHoursFormValues).subscribe(
        (studentCedula: any) => {
          this.student.push(studentCedula);
          if (studentCedula) {
            this.studentForm.reset();
            this.submittedHours = false;
            this.fetchStudentHoursSystem()
            this.spinner.hideSpinner();
          }
        },
        (error: any) => {
          console.error('Error fetching studentCedula:', error);
          this.studentForm.reset();
          this.submittedHours = false;
          this.fetchStudentHoursSystem()
          this.spinner.hideSpinner();
        }
      );
    }
  }

  goToStudentControl() {
    this.router.navigate(['/admin/control-estudiantes']);
  }
}