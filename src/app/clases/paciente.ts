import { Usuario } from "./usuario";

export class Paciente{
    id?: number;
    email: string = "";
    nombre: string = "";
    apellido: string = "";
    edad: number = 0;
    dni: number = 0;
    foto: string = "";
    obraSocial : string = "";
    foto02: string = "";

    constructor(nombre: string, apellido: string, edad: number, email: string, dni: number,foto: string, foto02: string, obraSocial: string)
    {
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.email = email;
        this.dni = dni;
        this.foto = foto;
        this.foto02 = foto02;
        this.obraSocial = obraSocial;
    }
}
