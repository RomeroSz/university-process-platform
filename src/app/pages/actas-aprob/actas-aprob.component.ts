import { Component, OnInit, VERSION } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { style } from '@angular/animations';

export class Resume {
  name: string;
  address: string;
  contactNo: number;
  email: string;
  skills: Skill[] = [];
  constructor() {
    this.skills.push(new Skill());
  }
}
export class Skill {
  value: string;
}

@Component({
  selector: 'app-actas-aprob',
  templateUrl: './actas-aprob.component.html',
  styleUrls: ['./actas-aprob.component.scss']
})
export class ActasAprobacionComponent implements OnInit {
  students: any[] = [];
  name = 'Angular ' + VERSION.major;
  resume = new Resume();

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    this.resume = JSON.parse(sessionStorage.getItem('resume')) || new Resume();

    //skills
    if (!this.resume.skills || this.resume.skills.length === 0) {
      this.resume.skills = [];
      this.resume.skills.push(new Skill());
    }
  }

  // Define los estilos
  private styles = {
    header: {
      alignment: 'center',
      fontSize: 12,
      bold: true,
      uppercase: true,
      margin: [0, 3]
    },
    info: {
      display: 'flex',
      alignment: 'left',
      fontSize: 11,
      margin: [0, 3]
    },
    infoDate: {
      display: 'flex',
      alignment: 'right',
      fontSize: 11,
      margin: [0, 15, 0, 5]
    },
    mainText: {
      display: 'flex',
      justifyContent: 'space-between',
      alignment: 'justify',
      fontSize: 11,
      margin: [0, 10]
    },
    title: {
      alignment: 'center',
      fontSize: 12,
      bold: true,
      margin: [0, 20, 0, 0],
    },
    closing: {
      display: 'flex',
      alignment: 'center',
      fontSize: 11,
      margin: [0, 3]
    },
    columnHeader: {
      margin: [0, 20],
      display: 'flex',
      justifyContent: 'space-between',
    }
  };

  contentInformacion(student) {
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const data = [
      { text: 'TITULO', style: 'header' },
      { text: 'DEP', style: 'header' },
      {
        columns: [
          [
            { text: `Caracas, ${formattedDate}`, style: 'infoDate' },
            [
              { text: 'LIC. NOMBRE', style: 'info' },
              { text: 'CARGO LIC.', style: 'info' },
              { text: 'Presente', style: 'info' },
            ],
          ]
        ],
        style: 'columnHeader',
      },
      { text: 'TITULO CARTA'.toLocaleUpperCase(), style: 'title' },
      {
        text:
          `Por la presente, se certifica que ${student?.primer_apellido || ''} ${student?.segundo_apellido || ''} ${student?.primer_nombre || ''} ${student?.segundo_nombre || ''}, titular de la cédula de identidad número ${student?.cedula || ''}, ha completado satisfactoriamente las horas requeridas por la ley venezolana para el servicio comunitario.`,
        style: 'mainText',
      },
      {
        text:
          `${student?.primer_apellido || ''} ${student?.segundo_apellido || ''} ${student?.primer_nombre || ''} ${student?.segundo_nombre || ''} ha demostrado una actitud ejemplar y ha contribuido significativamente al bienestar de nuestra sociedad.`,
        style: 'mainText',
      },
      { text: 'Atentamente,', style: 'closing', margin: [0, 100, 0, 0] },
      { text: 'LIC. NOMBRE', style: 'closing' },
      { text: 'CARGO LIC.', style: 'closing' },
      { text: 'UNIVERSIDAD', style: 'closing' },
    ];

    return data
  }

  generatePdf(action = 'open', studentSelected) {
    const documentDefinition = this.getDocumentDefinition(studentSelected);
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download':


        this.userService.createCertificadoStudent(studentSelected.id_estudiante).subscribe(
          (resp: any) => {
            if (resp) {
              const studentCedula = studentSelected.cedula;
              const studentField = "id_estatus";
              const studentValue = 5;
              this.userService.updateServiceStudentField(studentCedula, studentField, studentValue).subscribe(
                (resp: any) => {
                  if (resp) {
                    pdfMake.createPdf(documentDefinition).download();
                    this.ngOnInit();
                  }
                },
                (error: any) => {
                  console.error('Error fetching studentCedula:', error);
                }
              );
            }
          },
          (error: any) => {
            console.error('Error creando el certificado:', error);
          }
        );
        break;
      default: pdfMake.createPdf(documentDefinition).open(); break;
    }
  }

  addSkill() {
    this.resume.skills.push(new Skill());
  }

  resetForm() {
    this.resume = new Resume();
  }

  getDocumentDefinition(student) {
    sessionStorage.setItem('resume', JSON.stringify(this.resume));
    return {
      pageSize: 'LETTER',
      pageMargins: [75, 70, 75, 75],
      content: this.contentInformacion(student),
      styles: this.styles,
    };
  }

  fetchStudents(): void {
    this.userService.getStudentByStatus(4).subscribe(
      (users: any) => {
        this.students = users;
      },
      (error: any) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  ngOnInit(): void {
    this.fetchStudents()
  }
}
