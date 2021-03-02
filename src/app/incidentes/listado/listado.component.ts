import { ApiService } from './../../api/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  incidentes = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.recuperarIncidentes();
  }

  private recuperarIncidentes() {
    this.api.listarIncidentes().subscribe((i: any) => {
      this.incidentes = i;
    });
  }

}
