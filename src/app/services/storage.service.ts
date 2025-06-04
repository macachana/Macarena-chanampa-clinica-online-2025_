import { inject, Injectable } from '@angular/core';

import { DatabaseService } from './database.service';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  db = inject(DatabaseService);
  constructor() { }

  async guardarImagenPaciente(archivo :any, nombreArchivo: string)
  {
    console.log(archivo);
    const {data, error } = await this.db.supabase.storage.from('clinica').upload('pacientes/' + nombreArchivo,archivo)
  }

  async guardarImagenEspecialista(archivo :any, nombreArchivo: string)
  {
    console.log(archivo);
    const {data, error } = await this.db.supabase.storage.from('clinica').upload('especialistas/' + nombreArchivo,archivo)
  }
}
