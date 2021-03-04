import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IncidenteComponent } from './incidente/incidente.component';

import { ListadoComponent } from './listado/listado.component';

const routes: Routes = [
  { path: 'listado', component: ListadoComponent },
  { path: 'nuevo', component: IncidenteComponent},
  { path: ':id', component: IncidenteComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidentesRoutingModule { }
