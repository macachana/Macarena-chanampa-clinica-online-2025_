import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
// import { Usuario } from '../clases/usuario';

import { Especialista } from '../clases/especialista';
import { Paciente } from '../clases/paciente';

import Swal from 'sweetalert2';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  supabase;
  nombreUsuarioActual : string= "";
  apellidoUsuarioActual : string = "";
  idUsuarioIng : number = 0;
  tipoUsuario : string = "";

  constructor() {
    this.supabase = createClient("https://xrexkrbpejzmwszuhags.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZXhrcmJwZWp6bXdzenVoYWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjQ1NzUsImV4cCI6MjA2MDQwMDU3NX0.rX9uMza6cojqtEKNMtrCoTSSyID9LVGc0x6gjTkOtLI");
  }

  async listarUsuarios()
  {
    const { data, error } = await this.supabase.from("usuarios_clinica").select("*"); 
    const usuarios = data as Especialista[];
    return usuarios;
  }

  async crearUsuario(usuario: Usuario)
  {
    const { data, error } = await this.supabase.from("usuarios_clinica").insert(usuario);
  }

  // async buscarUsuario(email: string) : Promise<Boolean>
  // {
  //   const {data, error} = await this.supabase.from("usuarios_clinica").select("*").eq("email",email);
  //   let estado = false;
  //   if(data != null)
  //   {
  //     estado = true;
  //   }
  //   return estado;
  // }

  async averiguarTipoUsuario()
  {
    const email = "";
    const { data, error} = await this.supabase.from("usuarios_clinica").select("*").eq("email",email);
    
    let usuario : Usuario;

    if(data != null)
    {
      usuario = data[0] as Usuario;
      this.tipoUsuario = usuario.tipo;
    }
  } 

  ///////////////////////////////////////////////////////////////////////////////////////////////

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

  buscarEspecialista(email: string)
  {

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

  buscarPaciente(email: string)
  {

  }
}
