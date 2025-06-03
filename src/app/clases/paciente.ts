import { Usuario } from "./usuario";

export class Paciente extends Usuario{
    dni : number = 0;
    obraSocial : string = "";
    foto02: string = "";

    constructor(nombre: string, apellido: string, edad: number, email: string, foto: string, foto02: string, dni: number, obraSocial: string)
    {
        super(nombre,apellido,edad,email,foto);
        this.foto02 = foto02;
        this.dni = dni;
        this.obraSocial = obraSocial;
    }
}
