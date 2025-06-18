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
  idUsuarioIng : number = 0;
  tipoUsuario : string = "";
  emailUsuarioAct : string = "";
  // fotoPerfilUsuario : string = "";
  
  mostrarCuestionario : boolean = false;
  idTurno : number = 0;
  estadoNuevoCuestionario : string = "";
  mostrarSpinner : boolean = false;
  mostrarSegundoSpinner : boolean = false;
  mostrarHistorial : boolean = false;
  idPaciente : number | undefined = 0;

  constructor() {
    this.supabase = createClient("https://xrexkrbpejzmwszuhags.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZXhrcmJwZWp6bXdzenVoYWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjQ1NzUsImV4cCI6MjA2MDQwMDU3NX0.rX9uMza6cojqtEKNMtrCoTSSyID9LVGc0x6gjTkOtLI");
  }

  //////////////////////////// USUARIOS ////////////////////////////

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

  //////////////////////////// ESPECIALISTAS ////////////////////////////

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

  //////////////////////////// PACIENTES ////////////////////////////

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

  //////////////////////////// ADMINISTRADORES ////////////////////////////
  
  async listarAdministrador() {
    const { data, error } = await this.supabase.from("administradores").select("*");
    const usuarios = data as Administrador[];
    return usuarios;
  }
  
  async crearAdministrador(administrador: Administrador) {
    const { data, error } = await this.supabase.from("administradores").insert(administrador);
  }

  //////////////////////////// TURNOS ////////////////////////////

  async listarTurnos()
  {
    const { data, error } = await this.supabase.from("turnos").select("id,created_at,especialista(id,nombre,email),estado,paciente(id,nombre,apellido,edad,email,dni,obraSocial),especialidad,ContieneComentario,fecha,horario,duracion_minutos,historial_subido");
    let turnos : any[] = [];
    if(data)
    {
      turnos = data;
    }

    return turnos;
  }

  async cambiarEstadoTurno(estadoNuevo: string,idTurno: number)
  {
    const { data, error } = await this.supabase.from("turnos").update({estado: estadoNuevo}).eq("id",idTurno);

    if(error)
    {
      console.error("error al actualizar el estado del paciente");
    }
    else
    {
      console.log("datos actualizados");
    }

    return data;
  }

  async cambiarContieneComentario(idTurno: number)
  {
    const { data, error } = await this.supabase.from("turnos").update({"ContieneComentario":true}).eq("id",idTurno);

    if(error)
    {
      console.error("no se pudo actualizar el estado Contiene Comentario");
    }
    else
    {
      console.log("estado Contiene Comentario actualizado");
    }

    return data;
  }

  async agregarTurno(idEspecialista: number, idPaciente: number, especialidad: string, fecha: string,horario: string,duracion_minutos: number)
  {
    const { data, error } = await this.supabase.from("turnos").insert({
      "especialista": idEspecialista,
      "especialidad": especialidad,
      "paciente": idPaciente,
      "estado": 'solicitado',
      "ContieneComentario": false,
      "fecha": fecha,
      "horario":horario,
      "duracion_minutos":duracion_minutos,
      "historial_subido":false
    });
  }

  async cambiarEstadoHistorial(idTurno: number)
  {
    const { data, error } = await this.supabase.from("turnos").update({"historial_subido":true}).eq("id",idTurno);

    if(error)
    {
      console.error("no se pudo actualizar el estado Contiene Comentario");
    }
    else
    {
      console.log("estado Contiene Comentario actualizado");
    }

    return data;
  }

  //////////////////////////// COMENTARIOS/RESEÑAS ////////////////////////////

  async listarComentarios()
  {
    const { data, error } = await this.supabase.from("cuestionarios").select("id,usuario(id,nombre,email,tipo),turno(id),mensaje");
    let comentarios: any[] = [];
    if(data)
    {
      comentarios = data;
    }
    return comentarios;
  }

  async agregarComentario(idUsuario : number,idTurno : number, mensaje: string)
  {
    const { data, error } = await this.supabase.from("cuestionarios").insert({
      "usuario":idUsuario,
      "turno":idTurno,
      "mensaje":mensaje
    });
  }

  //////////////////////////// HORARIOS ////////////////////////////

  async listarHorarios()
  {
    const { data, error } = await this.supabase.from("horarios-especialistas").select("especialista(id,nombre),dia,especialidad,duracion");
    let horarios: any[] = [];
    if(data)
    {
      horarios = data;
    }
    return horarios;    
  }

  async agregarHorario(idEspecialista: number, dia: string, especialidad: string, duracion: number)
  {
    const { data, error } = await this.supabase.from("horarios-especialistas").insert({
      "especialista":idEspecialista,
      "dia":dia,
      "estado":"ocupado",
      "especialidad":especialidad,
      "duracion":duracion
    });
    
    if(error)
    {
      console.error("Horario no agregado.");
    }
    else
    {
      console.log("Horario agregado.");
    }
  }

  async actualizarHorario(idEspecialista: number, dia: string, duracion: number)
  {
    const { data, error } = await this.supabase.from("horarios-especialistas").update({"duracion":duracion}).eq("especialista",idEspecialista).eq("dia",dia);
    if(error)
    {
      console.error("No se pudo eliminar el horario " + error);
    }
    else
    {
      console.log("Horario actualizado");
    }
  }

  //////////////////////////// HISTORIAL CLINICO ////////////////////////////

  async listarHistorial()
  {
    const { data, error } = await this.supabase.from("historial_clinico").select("altura,peso,temperatura,presion,datoDinamico,paciente(id,nombre,email),turno(id,especialista(nombre,apellido),especialidad,fecha,horario)");

    let historial: any[] = [];
    if(data)
    {
      historial = data;
    }
    return historial;
  }
  
  async agregarHistorial(altura : number, peso : number, temperatura : number, presion : number, idPaciente : number | undefined, datoDinamico : {}, idTurno: number | undefined)
  {
    const { data, error } = await this.supabase.from("historial_clinico").insert({
      "altura":altura,
      "peso":peso,
      "temperatura":temperatura,
      "presion":presion,
      "paciente":idPaciente,
      "datoDinamico":datoDinamico,
      "turno": idTurno
    });
  }
}
