import { ApiService } from './../../api/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  templateUrl: './incidente.component.html',
  styleUrls: ['./incidente.component.css']
})
export class IncidenteComponent implements OnInit {
  incidente            = null;
  incidenteObservable  = null;
  formulario: FormGroup;
  private cliente: any = null;
  serviciosContratados = [];
  tiposDeProblema      = [];
  posiblesProblemas    = [];
  tecnicos             = [];

  constructor(
    private builder: FormBuilder,
    private api: ApiService,
    private mensajeService: NzMessageService,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    const idIncidente = this.activatedRoute.snapshot.params.id;
    this.inicializarFormulario();
    this.recuperarTiposDeProblema();
    if(idIncidente != undefined && idIncidente != null){
      this.recuperarIncidente(idIncidente);
      this.deshabilitarFormulario();
      this.incidenteObservable = new BehaviorSubject(this.incidente);
      this.incidenteObservable.next(this.incidente);
    }
  }

  private inicializarFormulario() {
    this.formulario = this.builder.group({
      razon_social:              [null, Validators.required],
      cuit:                      [null, Validators.required],
      servicio:                  [null, Validators.required],
      tipo_problema:             [null, Validators.required],
      problema:                  [null, Validators.required],
      descripcion_del_problema:  [null, Validators.required],
      tecnico:                   [null, Validators.required],
    });
  }

  private deshabilitarFormulario() {
    for (const i in this.formulario.controls) {
      this.formulario.controls[i].disable();
    }
  }

  private recuperarIncidente(idIncidente: number|string) {
    this.api.buscarIndicente(idIncidente).subscribe((i: any) => {
      this.incidente = i;
      this.incidenteObservable.next(this.incidente);
      this.mostrarIncidente();
      this.recuperarPosibleProblema(this.incidente.posible_problema_id);
      this.recuperarTecnico(this.incidente.tecnico_id);
    });
  }

  private recuperarPosibleProblema(id: number|string, mostrar = true) {
    this.api.buscarPosibleProblema(id).subscribe((pp: any) => {
      this.incidente.posible_problema = pp;
      if(mostrar){
        this.formulario.controls['tipo_problema'].setValue(pp.tipo_id);
        this.formulario.controls['problema'].setValue(pp.id);
        this.buscarPosiblesProblemas();
        this.buscarPosiblesTecnicos();
      }
    });
  }

  private recuperarTecnico(id: number|string, mostrar = true) {
    this.api.buscarTecnico(id).subscribe((t: any) => {
      this.incidente.tecnico = t;
      if(mostrar){
        this.formulario.controls['tecnico'].setValue(t.id);
      }
    });
  }

  private mostrarIncidente() {
    this.formulario.controls['razon_social'].setValue(this.incidente.razon_social);
    this.formulario.controls['cuit'].setValue(this.incidente.cuit);
    this.formulario.controls['servicio'].setValue(this.incidente.servicio_id);
    this.formulario.controls['descripcion_del_problema'].setValue(this.incidente.descripcion_del_problema);
    this.buscarServiciosDelCliente();
  }

  buscarServiciosDelCliente() {
    if(this.formulario.controls['razon_social'].invalid || this.formulario.controls['cuit'].invalid){
      return;
    }
    this.api.clienteSegun(this.formulario.controls['razon_social'].value, this.formulario.controls['cuit'].value).subscribe((c: any) => {
      this.cliente = c[0];
      this.api.serviciosContratados(this.cliente.id).subscribe((s: any) => {
        this.serviciosContratados = s;
      });
    });
  }

  private recuperarTiposDeProblema() {
    this.api.tiposDeProblema().subscribe((tp: any) => {
      this.tiposDeProblema = tp;
    });
  }

  buscarPosiblesProblemas() {
    if(this.formulario.controls['tipo_problema'].invalid){
      return;
    }
    this.api.problemasPosibles(this.formulario.controls['tipo_problema'].value).subscribe((pp: any) => {
      this.posiblesProblemas = pp;
    });
  }

  buscarPosiblesTecnicos() {
    if(this.formulario.controls['tipo_problema'].invalid){
      return;
    }
    this.api.tecnicosQueResuelvan(this.formulario.controls['tipo_problema'].value).subscribe((t: any) => {
      this.tecnicos = t;
    });
  }

  guardar() {
    if(this.formulario.invalid){
      for (const i in this.formulario.controls) {
        this.formulario.controls[i].markAsDirty();
        this.formulario.controls[i].updateValueAndValidity();
      }
      return;
    }

    const incidente = {
      servicio_contratado_id: this.formulario.controls['servicio'].value,
      tecnico_id: this.formulario.controls['tecnico'].value,
      posible_problema_id: this.formulario.controls['problema'].value,
      descripcion_del_problema: this.formulario.controls['descripcion_del_problema'].value,
    };

    this.api.guardarIncidente(incidente).subscribe((r: any) => {
      if(r > 0){
        this.mensajeService.success('Los cambios han sido guardados con éxito', {nzDuration: 5000});
      }
      else this.mensajeService.error('Error al intentar guardar los cambios', {nzDuration: 5000});
    });
  }

  cambiarEstado(nuevoCambio: any) {
    this.incidente.estado_id = nuevoCambio.estado_id;
    this.incidente.consideraciones = nuevoCambio.consideraciones;
    this.incidenteObservable.next(this.incidente);
  }

}
