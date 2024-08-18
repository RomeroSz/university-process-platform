import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-student-control',
  templateUrl: './student-control.component.html',
  styleUrls: ['./student-control.component.scss']
})
export class StudentControlComponent implements OnInit {
  studentCedulaForm: FormGroup;
  student: any[] = [];
  studentSelected: any;
  submitted = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private spinner: SpinnerService) { }

  fetchStudents(): void {
    this.spinner.showSpinner();
    this.userService.getAllStudents().subscribe(
      (users: any) => {
        this.student = users;
        this.spinner.hideSpinner();
      },
      (error: any) => {
        console.error('Error fetching users:', error);
        this.spinner.hideSpinner();
      }
    );
  }

  fetchStudentByCedula(cedulaForm): void {
    if (!cedulaForm.cedula) {
      this.spinner.showSpinner();
      this.fetchStudents();
    } else {
      this.userService.getStudentByCedula(cedulaForm.cedula).subscribe(
        (studentCedula: any) => {
          this.student = []
          this.student = studentCedula;
          this.spinner.hideSpinner();
        },
        (error: any) => {
          console.error('Error fetching studentCedula:', error);
          this.spinner.hideSpinner();
        }
      );
    }
  }

  startStudentServiceProcess(): void {
    this.spinner.showSpinner();
    const studentCedula = this.studentSelected.cedula;
    const studentField = "id_estatus";
    const studentValue = 2;
    this.userService.updateServiceStudentField(studentCedula, studentField, studentValue).subscribe(
      (resp: any) => {
        if (resp) {
          this.ngOnInit();
          this.spinner.hideSpinner();
        }
      },
      (error: any) => {
        console.error('Error fetching studentCedula:', error);
        this.spinner.hideSpinner();
      }
    );
  }

  takeStudent(entregaStudentObj): void {
    this.studentSelected = entregaStudentObj;
  }

  ngOnInit(): void {
    this.fetchStudents()
    this.studentCedulaForm = this.formBuilder.group({
      cedula: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }
}

