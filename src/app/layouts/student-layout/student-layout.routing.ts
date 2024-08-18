import { Routes } from '@angular/router';

export const StudentLayoutRoutes: Routes = [
    {
        path: 'registro-horas',
        loadChildren: () => import('../../pages/add-hours-student/add-hours-student.module').then(m => m.AddHoursStudentModule)
    }
];

