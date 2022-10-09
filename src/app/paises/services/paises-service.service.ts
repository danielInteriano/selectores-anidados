import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaisesServiceService {
  _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  get regiones(): string[] {
    return { ...this._regiones };
  }

  constructor() {}
}
