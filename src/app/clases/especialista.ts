import { Usuario } from "./usuario";

export class Especialista extends Usuario{
    dni : number = 0;
    especialidad: string = "";

    constructor(nombre:string,apellido:string,edad:number,email:string,foto:string,dni: number, especialidad: string)
    {
        super(nombre,apellido,edad,email,foto);
        this.dni = dni;
        this.especialidad = especialidad;
    }
}
