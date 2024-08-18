import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { StudentLayoutRoutes } from './student-layout.routing';

@NgModule({
  declarations: [
  ],
  imports: [
      RouterModule.forChild(StudentLayoutRoutes),
      CommonModule,],
  providers: [UserService]
})

export class StudentLayoutModule { }