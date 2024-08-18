import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentControlComponent } from './student-control.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { ComponentsModule } from 'src/app/components/components.module';

export const Route: Routes = [
  {
      path: '',
      component: StudentControlComponent
  }
];

@NgModule({
declarations: [
  StudentControlComponent,
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
export class StudentControlModule { }
