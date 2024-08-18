import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-hours-control',
  templateUrl: './hours-control.component.html',
  styleUrls: ['./hours-control.component.scss']
})
export class HoursControlComponent implements OnInit {
  studentCedulaForm: FormGroup;
  studentSelected: any;
  students: any[] = [];
  submitted = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.fetchStudents()
    this.studentCedulaForm = this.formBuilder.group({
      cedula: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }

  fetchStudents(): void {
    this.userService.getAllEntregasStudents().subscribe(
      (entregasStudents: any) => {
        this.students = entregasStudents;
      },
      (error: any) => {
        console.error('Error fetching entregasStudents:', error);
      }
    );
  }

  hoursDeliveredApproved() {
    this.userService.hoursDeliveredApprovedStudent(this.studentSelected.id_entrega, this.studentSelected['servicio.estudiante.cedula']).subscribe(
      (entregasStudents: any) => {
        this.fetchStudents()
        this.studentSelected = null
      },
      (error: any) => {
        console.error('Error fetching entregasStudents:', error);
      }
    );
  }

  takeStudent(entregaStudentObj): void {
    this.studentSelected = entregaStudentObj;
  }

  fetchStudentEntregasByCedula(cedulaForm): void {
    if (!cedulaForm.cedula) {
      this.fetchStudents();
    } else {
      this.userService.getEntregasStudentByCedula(cedulaForm.cedula).subscribe(
        (studentCedula: any) => {
          this.students = []
          this.students = studentCedula;
        },
        (error: any) => {
          console.error('Error fetching studentCedula:', error);
        }
      );
    }
  }
}

