import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { UserService } from 'src/app/services/user.service'

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild(AdminLayoutRoutes),
        CommonModule,],
    providers: [UserService]
})

export class AdminLayoutModule {}
