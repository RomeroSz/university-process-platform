import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/admin/home', title: 'Home', icon: 'ni-tv-2 text-light', class: '' },
  { path: '/admin/perfil-usuario', title: 'Administración', icon: 'ni-circle-08 text-light', class: '' },
  { path: '/admin/registro-estudiantes', title: 'Registro de Estudiante', icon: 'ni-badge text-light', class: '' },
  { path: '/admin/control-estudiantes', title: 'Control de Estudiantes', icon: 'ni-folder-17 text-light', class: '' },
  { path: '/admin/registro-horas', title: 'Registro de Horas', icon: 'ni-watch-time text-light', class: '' },
  { path: '/admin/control-horas', title: 'Control de Horas de Estudiantes', icon: 'ni-book-bookmark text-light', class: '' },
  { path: '/admin/actas-aprobacion', title: 'Actas de Aprobación', icon: 'ni-collection text-light', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  closeSession() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
}
