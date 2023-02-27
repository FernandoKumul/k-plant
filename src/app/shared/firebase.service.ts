import { Injectable } from '@angular/core';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
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
  constructor() {}
    //funcion para mostrar los datos
    mostrarDatoTR(ruta:string){
      const starCountRef = ref(database, ruta);
      onValue(starCountRef, (snapshot) => {
        const dato = snapshot.val();
        console.log(dato);
        if(ruta == '/Temperatura'){
          this.TempTR = dato;
        }

        if(ruta == '/Humedad'){
          this.Humedad = dato;
        }
        if(ruta == '/Automatico/Apertura'){
          this.Aper = dato;
        }
  
      });
    }
}
