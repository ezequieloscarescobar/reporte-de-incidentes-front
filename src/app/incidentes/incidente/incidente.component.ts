import { ApiService } from './../../api/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  templateUrl: './incidente.component.html',
  styleUrls: ['./incidente.component.css']
})
export class IncidenteComponent implements OnInit {
  formulario: FormGroup;
  private cliente: any = null;
  serviciosContratados = [];
  tiposDeProblema      = [];
  posiblesProblemas    = [];
  tecnicos             = [];

  constructor(
    private builder: FormBuilder,
    private api: ApiService,
    private mensajeService: NzMessageService
    ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.recuperarTiposDeProblema();
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

}
