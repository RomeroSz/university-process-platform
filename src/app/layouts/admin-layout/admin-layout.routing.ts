import { Routes } from '@angular/router';

export const AdminLayoutRoutes: Routes = [
    {
        path: 'home',
        loadChildren: () => import('../../pages/dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'perfil-usuario',
        loadChildren: () => import('../../pages/user-profile/user-profile.module').then(m => m.UserProfileModule)
    },
    {
        path: 'tables',
        loadChildren: () => import('../../pages/tables/tables.module').then(m => m.TablesModule)
    },
    {
        path: 'registro-estudiantes',
        loadChildren: () => import('../../pages/student/student.module').then(m => m.StudentModule)
    },
    {
        path: 'registro-horas',
        loadChildren: () => import('../../pages/add-hours/add-hours.module').then(m => m.AddHoursModule)
    },
    {
        path: 'control-estudiantes',
        loadChildren: () => import('../../pages/student-control/student-control.module').then(m => m.StudentControlModule)
    },
    {
        path: 'control-horas',
        loadChildren: () => import('../../pages/hours-control/hours-control.module').then(m => m.HoursControlModule)
    },
    {
        path: 'actas-aprobacion',
        loadChildren: () => import('../../pages/actas-aprob/actas-aprob.module').then(m => m.ActasAprobacionModule)
    }
];

