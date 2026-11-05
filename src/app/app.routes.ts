import { Component } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-reports-root',
  standalone: true,
  template: `<h1>Reportes</h1><p>Reportes y tableros de indicadores (fase 6).</p>`,
})
export class PlaceholderComponent {}

export const remoteRoutes: Routes = [
  { path: '', component: PlaceholderComponent },
];
