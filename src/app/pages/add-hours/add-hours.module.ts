import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddHoursComponent } from './add-hours.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { ComponentsModule } from 'src/app/components/components.module';

export const Route: Routes = [
  {
      path: '',
      component: AddHoursComponent
  }
];

@NgModule({
declarations: [
  AddHoursComponent,
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
export class AddHoursModule { }
