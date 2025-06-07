import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
// import { Usuario } from '../clases/usuario';

import { Especialista } from '../clases/especialista';
import { Paciente } from '../clases/paciente';

import Swal from 'sweetalert2';
import { Usuario } from '../clases/usuario';
import { Administrador } from '../clases/administrador';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  supabase;
  nombreUsuarioActual : string= "";
  apellidoUsuarioActual : string = "";
  idUsuarioIng : number = 0;
  tipoUsuario : string = "";
  fotoPerfilUsuario : string = "";

  constructor() {
    this.supabase = createClient("https://xrexkrbpejzmwszuhags.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZXhrcmJwZWp6bXdzenVoYWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjQ1NzUsImV4cCI6MjA2MDQwMDU3NX0.rX9uMza6cojqtEKNMtrCoTSSyID9LVGc0x6gjTkOtLI");
  }

  async listarUsuarios()
  {
    const { data, error } = await this.supabase.from("usuarios_clinica").select("*"); 
    const usuarios = data as Usuario[];
    return usuarios;
  }

  async crearUsuario(usuario: Usuario)
  {
    const { data, error } = await this.supabase.from("usuarios_clinica").insert(usuario);
  }

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
    const especialistas = data as Especialista[];
    return especialistas;
  }
  
  async crearEspecialista(especialista: Especialista) {
    const { data, error } = await this.supabase.from("especialistas").insert(especialista);
  }

  async modificarEstado(estadoNuevo: string, email: string)
  {
    const { data, error } = await this.supabase.from("especialistas").update({ estado: estadoNuevo }).eq('email', email).select('*');

    if(error)
    {
      console.error("error al actualizar los datos");
    }
    else
    {
      console.log("datos actualizados",data);
    }

    return data;
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

  ///////////////////////////////////////////////////////////////////////////////////////////////
  
  async listarAdministrador() {
    const { data, error } = await this.supabase.from("administradores").select("*");
    const usuarios = data as Administrador[];
    return usuarios;
  }
  
  async crearAdministrador(administrador: Administrador) {
    const { data, error } = await this.supabase.from("administradores").insert(administrador);
  }
}
