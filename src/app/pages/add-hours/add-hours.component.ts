import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { SpinnerService } from 'src/app/services/spinner.service';
import { StudentsService } from 'src/app/services/students.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-hours',
  templateUrl: './add-hours.component.html',
  styleUrls: ['./add-hours.component.scss']
})
export class AddHoursComponent implements OnInit {
  studentForm: FormGroup;
  studentCedulaForm: FormGroup;
  editStudentForm: FormGroup;
  submitted = false;
  editStudent = false;
  editStudentObject = {};
  student = [];
  studentSelected = null;
  carreras = [];
  menciones = [];
  brigadas = [];
  submittedCedula = false
  submittedHours = false

  constructor(private formBuilder: FormBuilder, private notifier: NotifierService, private router: Router, private userService: UserService, private studentService: StudentsService, private spinner: SpinnerService) { }

  ngOnInit(): void {
    this.studentCedulaForm = this.formBuilder.group({
      cedula: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
    this.studentForm = this.formBuilder.group({
      cedula: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      cantidad_horas: [null, Validators.required],
    });
    this.editStudentForm = this.formBuilder.group({
      primer_nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      segundo_nombre: [null, [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]],
      primer_apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      segundo_apellido: [null, [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^(0412|0414|0424|0416|0426)\d{7}$/)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      id_carrera: [null, Validators.required],
      id_mencion: [null, Validators.required],
      id_brigada: [null, Validators.required],
    });
  }

  onStudentChange(student: any): void {
    this.studentForm.get('cantidad_horas').reset();
    const selectedStudent: any = this.student.find(stu => stu.cedula === student);
    if (selectedStudent) {
      this.studentSelected = selectedStudent;
    }
  }

  fetchStudentByCedula(cedulaForm): void {
    this.submittedCedula = true;
    this.studentForm.reset();
    this.spinner.showSpinner();
    this.editStudentForm.reset();
    this.editStudent = false;
    this.editStudentObject = {};
    this.userService.getStudentByCedula(cedulaForm.cedula).subscribe(
      (studentCedula: any) => {
        this.student = [];
        if (studentCedula) {
          this.student = studentCedula;
          this.submittedCedula = false;
          this.spinner.hideSpinner();
        } else {
          console.error('No se encontró el estudiante con la cédula ingresada');
          this.submittedCedula = false;
          this.spinner.hideSpinner();
        }
      },
      (error: any) => {
        console.error('Error al buscar el estudiante con la cédula ingresada:', error);
        this.submittedCedula = false;
        this.spinner.hideSpinner();
      }
    );
  }

  goToStudentControl() {
    this.router.navigate(['/admin/control-estudiantes']);
  }

  editStudentFunction(studentSelected) {
    this.editStudent = !this.editStudent;
    this.editStudentObject = studentSelected;
    this.fetchBrigadas();
    this.fetchCarreras();
    this.fetchMenciones();

    this.editStudentForm.patchValue({
      primer_nombre: studentSelected.primer_nombre,
      segundo_nombre: studentSelected.segundo_nombre,
      primer_apellido: studentSelected.primer_apellido,
      segundo_apellido: studentSelected.segundo_apellido,
      telefono: studentSelected.telefono,
      direccion: studentSelected.direccion,
      id_carrera: studentSelected.id_carrera,
      id_mencion: studentSelected.id_mencion,
      id_brigada: studentSelected.id_brigada,
    });
  }

  UpdateStudentHoursPending(studentHoursFormValues): void {
    this.spinner.showSpinner();
    const cantidadHoras = studentHoursFormValues.cantidad_horas;
    if (cantidadHoras < 1 || cantidadHoras > 20) {
      this.notifier.notify('error', `Horas de estudio permitidas entre 1 y 20`);
      this.spinner.hideSpinner();
    }
    else {
      this.userService.createEntregaStudent(studentHoursFormValues).subscribe(
        (studentCedula: any) => {
          this.student.push(studentCedula);
          if (studentCedula) {
            this.studentForm.reset();
            this.studentCedulaForm.reset();
            this.student = [];
            this.studentSelected = null;
            this.submittedHours = false;
            this.spinner.hideSpinner();
          }
        },
        (error: any) => {
          console.error('Error fetching studentCedula:', error);
          this.spinner.hideSpinner();
        }
      );
    }
  }

  updateStudentService(editStudentFormValues): void {
    this.spinner.showSpinner();
    const bodyReq = { ...editStudentFormValues, id_usuario: this.studentSelected.id_usuario, cedula: this.studentSelected.cedula }
    this.userService.updateStudentService(bodyReq).subscribe(
      (studentCedula: any) => {
        // this.student.push(studentCedula);
        if (studentCedula) {
          this.submitted = false;
          this.editStudent = false;
          this.studentForm.reset();
          this.studentCedulaForm.reset();
          this.editStudentForm.reset();
          this.student = [];
          this.editStudentObject = {};
          this.studentSelected = null;
          this.spinner.hideSpinner();
          this.ngOnInit();
        }
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
      this.UpdateStudentHoursPending(this.studentForm.value)
    }
  }

  onSubmitEditStudent() {
    this.submitted = true;
    if (this.editStudentForm.valid) {
      this.updateStudentService(this.editStudentForm.value)
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
        this.spinner.hideSpinner();
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
}