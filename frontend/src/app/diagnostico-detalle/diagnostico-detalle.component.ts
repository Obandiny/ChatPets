import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiagnosticoService } from '../services/diagnostico.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-diagnostico-detalle',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './diagnostico-detalle.component.html',
    styleUrls: ['./diagnostico-detalle.component.css']
})
export class DiagnosticoDetalleComponent implements OnInit {

    diagnostico: any;

    constructor(
        private diagnosticoService: DiagnosticoService,
        private router: ActivatedRoute
    ) {}

    ngOnInit(): void {
        const id = Number(this.router.snapshot.paramMap.get('id'));
        this.diagnosticoService.getDiagnosticoById(id)
            .subscribe(data => this.diagnostico = data);
    }

}