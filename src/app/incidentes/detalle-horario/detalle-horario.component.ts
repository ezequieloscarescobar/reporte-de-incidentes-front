import { ApiService } from './../../api/api.service';
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detalle-horario',
  templateUrl: './detalle-horario.component.html',
  styleUrls: ['./detalle-horario.component.css'],
})
export class DetalleHorarioComponent implements OnInit {
  @Input() incidenteObservable: Observable<any>   = null;
  incidente: any                                  = null;
  private estadosIncidente                        = [];
  estadoIncidente: any                            = null;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.incidenteObservable.subscribe(ir => {
      this.incidente = ir;
      this.recuperarEstado();
    });
  }

  private recuperarEstado() {
    if(this.incidente == null){
      return;
    }
    if(this.estadosIncidente.length <= 0 ) {
      this.api.buscarEstadosDeIncidentes().subscribe((ei: any) => {
        this.estadosIncidente = ei;
        this.buscarEstadoConcreto();
      });
    }
    else this.buscarEstadoConcreto();
  }

  private buscarEstadoConcreto() {
    this.estadoIncidente = this.estadosIncidente.find(e => e.id == this.incidente.estado_id);
  }

}
