// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { DiagnosticoService } from '../services/diagnostico.service';

// @Component({
//   selector: 'app-diagnostico-detalle',
//   templateUrl: './diagnostico-detalle.component.html',
//   styleUrls: ['./diagnostico-detalle.component.css']
// })
// export class DiagnosticoDetalleComponent implements OnInit {

//   diagnostico: any;

//   constructor(
//     private route: ActivatedRoute,
//     private diagnosticoService: DiagnosticoService
//   ) {}

//   ngOnInit() {
//     const id = this.route.snapshot.paramMap.get('id');
//     this.diagnosticoService.obtenerDetalle(id!)
//       .subscribe(res => this.diagnostico = res);
//   }
// }