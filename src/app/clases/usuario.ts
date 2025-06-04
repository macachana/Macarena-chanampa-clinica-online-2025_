export class Usuario {
    id?: number;
    email: string = "";
    nombre: string = "";
    apellido: string = "";
    edad: number = 0;
    dni: number = 0;
    tipo: string = "";
    
    constructor(nombre:string,apellido:string,edad:number,email:string,dni:number,tipo: string){
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.email = email;
        this.dni = dni;
        this.tipo = tipo;
    }
}
