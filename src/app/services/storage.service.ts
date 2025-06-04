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

  async guardarImagenAdministrador(archivo :any, nombreArchivo: string)
  {
    console.log(archivo);
    const {data, error } = await this.db.supabase.storage.from('clinica').upload('administradores/' + nombreArchivo,archivo)
  }

  // listar imagenes de bucket
  async listarImagenesPacientes(): Promise<string[]> {
    const { data, error } = await this.db.supabase.storage
      .from('clinica')
      .list('pacientes', { limit: 100 });

    if (error) {
      console.error('Error al listar imágenes:', error.message);
      return [];
    }

    // Convertir nombres de archivos a URLs públicas o firmadas
    const urls = data.map((file) =>
      this.db.supabase.storage.from('clinica').getPublicUrl(`pacientes/${file.name}`).data.publicUrl
    );
    return urls;
  }

  // buscarImagenEmail(nombrePaciente: string, dni: number) : string
  // {
  //   const nombreUrl = "https://xrexkrbpejzmwszuhags.supabase.co/storage/v1/object/public/clinica/pacientes/" + nombrePaciente + "_" + dni;
  //   let resultado = false;
  //   const urls = this.listarImagenesPacientes().then((url)=>{
  //     for(let i = 0; i < url.length; i ++)
  //     {
  //       if(url[i] == nombreUrl)
  //       {
  //         console.log("url: " + nombreUrl);
  //         console.log("urls[i]:" + url[i]);
  //         resultado = true;
  //         break;
  //       }
  //     }
  //   });

  //   console.log("estado resultado:" + resultado);

  //   if(resultado)
  //   {
  //     console.log("encontrado!!!");
  //     return nombreUrl;
  //   }
  //   else
  //   {
  //     return "";
  //   }
  // }
}
