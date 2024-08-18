import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddHoursStudentComponent } from './add-hours-student.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { ComponentsModule } from 'src/app/components/components.module';

export const Route: Routes = [
  {
      path: '',
      component: AddHoursStudentComponent
  }
];

@NgModule({
declarations: [
  AddHoursStudentComponent,
],
imports: [
  RouterModule.forChild(Route),
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  NgbModule,
  ClipboardModule,
  ComponentsModule
]
})
export class AddHoursStudentModule { }
