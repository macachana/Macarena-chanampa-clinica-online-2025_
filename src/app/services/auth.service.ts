import { inject, Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Router } from '@angular/router';
import { AuthError, User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  sb = inject(DatabaseService); 
  router = inject(Router);
  usuarioActual: User | null = null;
  nombreUsuarioActual : string = "";
  correoUsuarioActual : string = "";
  array = []; 
  
  constructor() {  
    this.sb.supabase.auth.onAuthStateChange((event, session) => {
      console.log(event,session);
      
      this.usuarioActual = session?.user ?? null;
    });
  }

  async restoreSession() {
    const { data, error } = await this.sb.supabase.auth.getSession();
    if (data?.session) {
      // Ya hay sesión activa
      console.log("Sesión restaurada:", data.session.user);
      this.usuarioActual = data.session.user;
    }
  }

  // Crear una Cuenta
  async crearCuenta(correo:string, contraseña:string,nombre:string, apellido:string, dni:number, tipo:string){
    const {data, error} = await this.sb.supabase.auth.signUp({
    email: correo,
    password: contraseña,
    options: {data: {nombre,apellido,dni,tipo}}
    });
  }
  
  // Iniciar Sesion 
  async iniciarSesion(correo:string, contraseña:string) {
    const {data, error} = await this.sb.supabase.auth.signInWithPassword({
      email: correo,
      password: contraseña
    });
    return {data, error};
  }

  // Cerrar Sesion 
  async cerrarSesion(){
    const {error} = await this.sb.supabase.auth.signOut();
    if(!error)
    {
      console.log("¡¡¡cierre de sesion exitosa!!!");
      this.router.navigate(['/']);
    }
    else
    {
      console.error("Error al cerrar sesion: " + error.message);
    }
  }
}
