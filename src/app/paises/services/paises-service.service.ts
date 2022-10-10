import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaisCode } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root',
})
export class PaisesServiceService {
  _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  baseUrl: string = 'https://restcountries.com/v2/region/';

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) {}

  //función para traer todos los paises de una región con su alpha3Code
  obtenerPaisesPorRegion(region: string): Observable<PaisCode[]> {
    return this.http.get<PaisCode[]>(
      `${this.baseUrl}${region}?fields=alpha3Code,name`
    );
  }
}
