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
      const registroHoy = resultado1.Historial[(resultado1.Historial.length - 1)]
      const laFecha = moment();
      
      const fechaHoy = laFecha.format('DD/MM/YYYY');
      if(registroHoy.Fecha == fechaHoy){
        for(let i = 0; i<registroHoy.HorasRegistro; i++){
          this.datos[(registroHoy[i].Hora)-6] = registroHoy[i].Temperatura;
        }
      };

      const resultado = JSON.parse(JSON.stringify(Registro));
      const promedios: {[fecha: string]: number} = {};
      resultado.Historial.forEach((obj: any) => {
        const fecha = obj.Fecha;
        const horasRegistro = obj.HorasRegistro;
        let sumaTemperaturas = 0;
        let cantTemperaturas = 0;
        for (let i = 0; i < horasRegistro; i++) {
          const propiedad = i.toString();
          if (obj[propiedad] && typeof obj[propiedad] !== "string" && obj[propiedad].Temperatura) {
            sumaTemperaturas += obj[propiedad].Temperatura;
            cantTemperaturas++;
          }
        }
        if (cantTemperaturas > 0) {
          const promedio = sumaTemperaturas / cantTemperaturas;
          promedios[fecha] = +promedio.toFixed(0); // Convertimos el promedio a número y redondeamos sin decimales
        }
      });
      console.log(promedios); 
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

  lineChartMethod2(promedios: { [fecha: string]: number }) {
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
            label: 'Temperatura',
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
        ],
      },
    });
  }
  
  
}