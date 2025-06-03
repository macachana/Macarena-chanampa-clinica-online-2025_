import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
// import { Usuario } from '../clases/usuario';

import { Especialista } from '../clases/especialista';
import { Paciente } from '../clases/paciente';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  supabase;
  nombreUsuarioActual : string= "";
  apellidoUsuarioActual : string = "";
  idUsuarioIng : number = 0;

  constructor() {
    this.supabase = createClient("https://xrexkrbpejzmwszuhags.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZXhrcmJwZWp6bXdzenVoYWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjQ1NzUsImV4cCI6MjA2MDQwMDU3NX0.rX9uMza6cojqtEKNMtrCoTSSyID9LVGc0x6gjTkOtLI");
  }

  async listarEspecialistas() {
    const { data, error } = await this.supabase.from("especialistas").select("*");
    const usuarios = data as Especialista[];
    return usuarios;
  }
  
  async crearEspecialista(especialista: Especialista) {
    const { data, error } = await this.supabase.from("especialistas").insert(especialista);
  }

  async subirImagenEspecialista(blob: Blob, nombreArchivo: string): Promise<void> {
    const { data, error } = await this.supabase.storage
      .from('clinica') // nombre del bucket en Supabase
      .upload(`especialistas/${nombreArchivo}`, blob, {
        contentType: 'image/jpeg'
      });

    if (error) {
      console.error('Error al subir la imagen:', error.message);
      Swal.fire({
        position: "top",
        icon: "error",
        title: "error al subir la imagen",
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      console.log('Imagen subida:', data?.path);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////

  async listarPacientes()
  {
    const { data, error } = await this.supabase.from("pacientes").select("*");
    const pacientes = data as Paciente[];
    return pacientes;
  }

  async crearPacientes(paciente: Paciente)
  {
    const { data, error } = await this.supabase.from("pacientes").insert(paciente);
  }

  async subirImagenPaciente(blob: Blob, nombreArchivo: string): Promise<void> {
    const { data, error } = await this.supabase.storage
      .from('clinica') // nombre del bucket en Supabase
      .upload(`pacientes/${nombreArchivo}`, blob, {
        contentType: 'image/jpeg'
      });

    if (error) {
      console.error('Error al subir la imagen:', error.message);
      Swal.fire({
        position: "top",
        icon: "error",
        title: "error al subir la imagen del paciente",
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      console.log('Imagen subida:', data?.path);
    }
  }
}
