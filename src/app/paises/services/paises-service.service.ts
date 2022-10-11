import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { infoPais, Pais, PaisCode } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root',
})
export class PaisesServiceService {
  _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  baseUrl: string = 'https://restcountries.com/v2/';

  get regiones(): string[] {
    return [...this._regiones];
  }

  

  constructor(private http: HttpClient) {}

  //servicio para traer todos los paises de una región con su alpha3Code
  obtenerPaisesPorRegion(region: string): Observable<PaisCode[]> {
    return this.http.get<PaisCode[]>(
      `${this.baseUrl}region/${region}?fields=alpha3Code,name`
    );
  }

  //servicio para traer los paises fronterizos: toda la información de un pais
  obtenerPaisPorCodigo(codigo: string): Observable<Pais | null> {
    if (!codigo) {
      return of(null);
    }
    return this.http.get<Pais>(`${this.baseUrl}alpha/${codigo}`);
  }

  //servicio para traer los paises fronterizos: código y nombre
  obtenerPaisFrontera(codigo: string): Observable<PaisCode> {
    return this.http.get<PaisCode>(
      `${this.baseUrl}alpha/${codigo}?fields=alpha3Code,name`
    );
  }

  //servicio obtener paises por cógidos almacenando todas las peticiones
  obtenerPaisesFronterizosPorCodigos(
    fronteras: string[]
  ): Observable<PaisCode[]> {
    if (!fronteras) {
      return of([]);
    }
    const peticiones: Observable<PaisCode>[] = [];
    fronteras.forEach((codigo) => {
      const peticion = this.obtenerPaisFrontera(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }

  //servicio para obtener la información de un país para mostrar en el Card
  obtenerInfoPais(codigo: string): Observable<infoPais> {
    return this.http.get<infoPais>(
      `${this.baseUrl}alpha/${codigo}?fields=region,name,capital,population,area,flag`
    );
  }
}
