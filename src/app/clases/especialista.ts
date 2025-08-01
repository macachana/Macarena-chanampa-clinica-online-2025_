import { Usuario } from "./usuario";

export class Especialista{
    id?: number;
    email: string = "";
    nombre: string = "";
    apellido: string = "";
    edad: number = 0;
    dni: number = 0;
    foto: string = "";
    especialidad: string = "";
    segundaEspecialidad: string | null = null;
    estado : string = "";

    constructor(nombre:string,apellido:string,edad:number,email:string,dni: number,foto:string, especialidad: string, segundaEspecialidad: string | null = null,estado: string)
    {
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.email = email;
        this.dni = dni;
        this.foto = foto;
        this.especialidad = especialidad;
        this.segundaEspecialidad = segundaEspecialidad;
        this.estado = estado;
    }
}
