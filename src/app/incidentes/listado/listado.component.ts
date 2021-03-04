import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from './../../api/api.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  incidentes          = [];
  estados             = [];
  estadoSeleccionado  = null;
  consideraciones     = null;

  constructor(
    private api: ApiService,
    private mensajeService: NzMessageService,
    private modal: NgbModal
    ) { }

  ngOnInit(): void {
    this.recuperarIncidentes();
    this.recuperarEstadosDeIncidentes();
  }

  private recuperarIncidentes() {
    this.api.listarIncidentes().subscribe((i: any) => {
      this.incidentes = i;
    });
  }

  private recuperarEstadosDeIncidentes() {
    this.api.buscarEstadosDeIncidentes().subscribe((ei: any) => {
      this.estados = ei;
    });
  }

  cambiarDeEstado(contenidoModal: any, incidente: any) {
    this.modal.open(contenidoModal, {centered: true}).result.then(
      (result: any) => {
        const parametros = {
          estado_id: this.estadoSeleccionado,
          consideraciones: this.consideraciones
        };
        this.api.guardarCambioDeEstadoIncidente(incidente.id, parametros).subscribe((r: any) => {
          this.mensajeService.success('Los cambios han sido guardados con éxito', {nzDuration: 5000});
          this.consideraciones    = null;
          this.estadoSeleccionado = null;
        });
      },
      (reason: any) => {}
    );
  }

}
