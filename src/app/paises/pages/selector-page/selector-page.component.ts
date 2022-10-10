import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisCode } from '../../interfaces/paises.interface';
import { PaisesServiceService } from '../../services/paises-service.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [],
})
export class SelectorPageComponent implements OnInit {
  formulario: FormGroup = this.fb.group({
    continente: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  });

  regiones: string[] = [];
  paisesPorContienente: PaisCode[] = [];

  constructor(
    private fb: FormBuilder,
    private paisesService: PaisesServiceService
  ) {}

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //obtener el continente seleccionado
    this.formulario.get('continente')?.valueChanges.subscribe((continente) => {
      console.log(continente);

      //obtener los paises de un continente seleccionado
      this.paisesService
        .obtenerPaisesPorRegion(continente)
        .subscribe((paises) => {
          this.paisesPorContienente = paises;
          console.log(this.paisesPorContienente);
        });
    });
  }

  //función para mostrar mensajes error
  validarCampo(control: string) {
    return (
      this.formulario.controls['control']?.errors &&
      this.formulario.controls['control']?.touched
    );
  }

  //función para guardar datos del formulario
  guardar() {
    console.log(this.formulario.value);
  }
}
