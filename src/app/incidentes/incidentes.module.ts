import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncidentesRoutingModule } from './incidentes-routing.module';
import { IncidentesComponent } from './incidentes.component';
import { IncidenteComponent } from './incidente/incidente.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { ListadoComponent } from './listado/listado.component';


@NgModule({
  declarations: [IncidentesComponent, IncidenteComponent, ListadoComponent],
  imports: [
    CommonModule,
    IncidentesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzMessageModule,
  ]
})
export class IncidentesModule { }
