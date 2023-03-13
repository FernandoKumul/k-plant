import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FirebaseService } from '../shared/firebase.service'
//npm i chart.js --save
import { Chart } from 'chart.js/auto';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ChartDataset } from 'chart.js';


@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})

export class HistorialPage implements AfterViewInit {
  // Importing ViewChild. We need @ViewChild decorator to get a reference to the local variable 
  // that we have added to the canvas element in the HTML template.
  @ViewChild('lineCanvas') private lineCanvas!: ElementRef;
  @ViewChild('Canvaxd') private Canvaxd!: ElementRef;
  lineChart: any;
  lineChart2: any;
  datos:any = [];

  constructor(public firebaseService: FirebaseService) {
    this.datosGrafica()
  }
  // When we try to call our chart to initialize methods in ngOnInit() it shows an error nativeElement of undefined. 
  // So, we need to call all chart methods in ngAfterViewInit() where @ViewChild and @ViewChildren will be resolved.
  ngAfterViewInit() {
  }
  
  datosGrafica() {
    this.firebaseService.getDatos().then((Registro: any) => { // Obtenemos los datos desde Firebase
      const resultado1 = JSON.parse(JSON.stringify(Registro))
      const laFecha = moment();
      
      const fechaHoy = laFecha.format('DD/MM/YYYY');
      resultado1.Historial.forEach((element:any, index:any) => {//Obtiene todos los registros diarios
        if(element.Fecha == fechaHoy){ //Solo se ejecuta para el dia hoy
          for(let i = 0; i<element.HorasRegistro; i++){
            this.datos[(element[i].Hora)-6] = element[i].Hora //Las horas de hoy se asignan al array
          }
          return
        }
      });

      const resultado = JSON.parse(JSON.stringify(Registro));
      const promedios: {[fecha: string]: number} = {}; 
      const temperaturasHoraPorHora: number[][] = []; 
      const horas: string[] = []; 
  
      resultado.Historial.forEach((obj: any) => { 
        const fecha = obj.Fecha; 
        const horasRegistro = obj.HorasRegistro; // Obtenemos la cantidad de horas registradas en el objeto
        const temperaturas: number[] = []; 
        for (let i = 0; i < horasRegistro; i++) { // Iteramos sobre cada hora registrada en el objeto
          const propiedad = i.toString(); // Convertimos el número de hora a string
          if (obj[propiedad] && typeof obj[propiedad] !== "string" && obj[propiedad].Temperatura) {
            // Si existe un registro para esa hora y la temperatura es un número
            const temperatura = obj[propiedad].Temperatura;
            temperaturas.push(temperatura); // Agregamos la temperatura al array de temperaturas
          } else {
            temperaturas.push(-1); // Si no hay registro, agregamos un valor por defecto (-1) al array de temperaturas
          }
          horas.push(propiedad + ':00'); // Generamos una hora en formato HH:00 para cada registro y la agregamos al array de horas
        }
        temperaturasHoraPorHora.push(temperaturas); // Agregamos el array de temperaturas de cada hora al array principal
        let sumaTemperaturas = 0;
        let cantTemperaturas = 0;
        for (let i = 0; i < horasRegistro; i++) { 
          if (temperaturas[i] !== null) { // Si hay registro de temperatura para esa hora
            sumaTemperaturas += temperaturas[i]; // Sumamos la temperatura al total
            cantTemperaturas++; // Aumentamos el contador de temperaturas
          }
        }
        if (cantTemperaturas > 0) { 
          const promedio = sumaTemperaturas / cantTemperaturas; // Calculamos el promedio de temperatura
          promedios[fecha] = +promedio.toFixed(0); // Convertimos el promedio a número y redondeamos sin decimales, luego lo agregamos al objeto de promedios
        }
      });
      console.log(promedios); 
      console.log(temperaturasHoraPorHora); 
      console.log(resultado);
      this.lineChartMethod(this.datos); 
      this.lineChartMethod2(promedios); 
    });
  }

  lineChartMethod(datos: number[][]) {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
        datasets: [
          {
            label: 'Temperatura por hora',
            fill: true,
            backgroundColor: 'rgba(76, 111, 191,0.4)',
            borderColor: 'rgba(76, 111, 191,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 1,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 10,
            data: datos,
            spanGaps: false,
            tension: 0.4,
          }
        ]
      }
    });
  }

  lineChartMethod2(promedios: {[fecha: string]: number}) { // Agregamos el objeto con los promedios como argumento
    const hoy = moment();
    const etiquetasUltimos7dias = [...Array(7)].map((_, i) => {
      const fecha = hoy.clone().subtract(6 - i, 'days');
      return fecha.format('DD/MM/YYYY');
    }).reverse(); 
  
    // Calcula el promedio de temperatura de los últimos 7 días
    const temperatura7dias = etiquetasUltimos7dias.map(fecha => {
      return promedios[fecha] || 0; // Si no hay un promedio para la fecha, asumimos que es cero
    });
  
    this.lineChart2 = new Chart(this.Canvaxd.nativeElement, {
      type: 'line',
      data: {
        labels: etiquetasUltimos7dias,
        datasets: [
          {
            label: 'Promedio en los últimos 7 días',
            fill: true,
            backgroundColor: 'rgba(212, 140, 1 ,0.4)',
            borderColor: 'rgba(212, 140, 1 )',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            pointBorderColor: 'rgba(168, 114, 9)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 1,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 10,
            data: temperatura7dias,
            spanGaps: false,
            tension: 0.4,
          },
        ]
      }
    });
  }
  
  
}