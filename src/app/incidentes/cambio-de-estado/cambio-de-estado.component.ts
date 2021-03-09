import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from './../../api/api.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-cambio-de-estado',
  templateUrl: './cambio-de-estado.component.html',
  styleUrls: ['./cambio-de-estado.component.css']
})
export class CambioDeEstadoComponent implements OnInit {
  estadoSeleccionado  = null;
  consideraciones     = null;
  estados             = [];
  @Input() incidente  = null;
  @Output() cambioDeEstado = new EventEmitter<Object>();

  constructor(
    private api: ApiService,
    private mensajeService: NzMessageService) { }

  ngOnInit(): void {
    this.recuperarEstados();
  }

  private recuperarEstados() {
    this.api.buscarEstadosDeIncidentes().subscribe((ei: any) => {
      this.estados= ei;
    });
  }

  guardarYnotificarCambioDeEstado() {
    const cambio = {
      estado_id: this.estadoSeleccionado,
      consideraciones: this.consideraciones
    };
    this.guardarCambio(cambio);
    this.cambioDeEstado.emit(cambio);
  }

  private guardarCambio(cambio: any) {
    this.api.guardarCambioDeEstadoIncidente(this.incidente.id, cambio).subscribe((r: any) => {
      this.mensajeService.success('Los cambios han sido guardados con éxito', {nzDuration: 5000});
      this.consideraciones    = null;
      this.estadoSeleccionado = null;
    });
  }

}
