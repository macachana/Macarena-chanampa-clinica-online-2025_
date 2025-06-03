export class Usuario {
    id?: number;
    email: string = "";
    nombre: string = "";
    apellido: string = "";
    edad: number = 0;
    foto: string = "";
    
    constructor(nombre:string,apellido:string,edad:number,email:string,foto:string){
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.email = email;
        this.foto = foto;
    }
}
