import { Routes } from '@angular/router';
import { TableroGeneral } from './pages/tablero-general/tablero-general';
import { Presupuesto } from './pages/presupuesto/presupuesto';
import { ProyectoWidget } from './pages/proyecto-widget/proyecto-widget';

/**
 * Rutas publicadas por mfe-reports via federacion ('./Module').
 * El shell las monta bajo /reports.
 */
export const remoteRoutes: Routes = [
  { path: '', component: TableroGeneral, title: 'Tablero general' },
  { path: 'presupuesto', component: Presupuesto, title: 'Presupuesto' },
  { path: 'proyecto-widget', component: ProyectoWidget, title: 'Widget federado' },
];
