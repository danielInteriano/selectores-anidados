import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { infoPais, PaisCode } from '../../interfaces/paises.interface';
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

  //para llenar los select del formulario
  regiones: string[] = [];
  paises: PaisCode[] = [];
  fronteras: PaisCode[] = [];
  codigo: string = '';

  //para mostrar en la Card
  infoPais: infoPais = {
    region: '',
    name: '',
    capital: '',
    population: 0,
    area: 0,
    flag: '',
  };

  //Bandera para mensaje de cargando
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private paisesService: PaisesServiceService
  ) {}

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //obtener el continente seleccionado y luego los paises de ese continente
    this.formulario
      .get('continente')
      ?.valueChanges.pipe(
        tap(() => {
          this.formulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap((region) => this.paisesService.obtenerPaisesPorRegion(region))
      )
      .subscribe((paises) => {
        this.paises = paises;
        this.cargando = false;
      });

    //obtener el país seleccionado y luego los paises fronterizos
    this.formulario
      .get('pais')
      ?.valueChanges.pipe(
        tap(() => {
          this.formulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap((codigo) => this.paisesService.obtenerPaisPorCodigo(codigo)),
        switchMap((pais) =>
          this.paisesService.obtenerPaisesFronterizosPorCodigos(pais?.borders!)
        )
      )
      .subscribe((paises) => {
        this.fronteras = paises;
        this.cargando = false;
        this.codigo = this.formulario.controls['pais'].value;

        //obtener informacion para mostrar en el Card
        this.paisesService
          .obtenerInfoPais(this.codigo)
          .subscribe((informacion) => {
            this.infoPais = informacion;
            console.log(this.infoPais);
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
