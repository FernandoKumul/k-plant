import { Injectable } from '@angular/core';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, get, child } from "firebase/database";
// import { environment } from 'src/environments/environment';
import { environment } from 'src/environments/environment.prod';

const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  TempTR = 0;
  Humedad = 0;
  Aper = 0;
  TempTch = 0;
  Modo = false;
  constructor() {}
    //Para subir datos
    writeDatos(ruta:string, dato:any){
      set(ref(database, ruta), dato)
    }

    viewOneDateTR(){
get(child(ref(database), '/Registro')).then((snapshot) => {
  if (snapshot.exists()) {
    return (snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
    }
    //funcion para mostrar los datos
    mostrarDatoTR(ruta:string){
      const starCountRef = ref(database, ruta);
      onValue(starCountRef, (snapshot) => {
        const dato = snapshot.val();
        console.log(dato);
        if(ruta == '/Sensores/Temperatura'){
          this.TempTR = dato;
        }

        if(ruta == '/Sensores/Humedad'){
          this.Humedad = dato;
        }
        if(ruta == '/Techo/Apertura'){
          this.Aper = dato;
        }
        if(ruta == '/Techo/Temperatura'){
          this.TempTch = dato;
        }
        if(ruta == '/Techo/Manual/Estado'){
          this.Modo = dato;
        }
  
      });
    }
}
