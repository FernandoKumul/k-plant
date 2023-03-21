import { FirebaseService } from './../shared/firebase.service';
import { Component, OnInit, ViewChild} from '@angular/core';
import { AfterViewInit, ElementRef } from '@angular/core';
import { RangeCustomEvent } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Chart } from 'chart.js/auto';
import * as moment from 'moment';
@Component({
  selector: 'app-techo',
  templateUrl: './techo.page.html',
  styleUrls: ['./techo.page.scss'],
})

export class TechoPage implements OnInit,AfterViewInit{
  @ViewChild(IonModal) modal: any;
  lastEmittedValue :any
  temp: any
  valor: any
  estado = true
  rango: any
  editar = true
  @ViewChild('lineCanvas') private lineCanvas!: ElementRef;
  @ViewChild('Canvaxd') private Canvaxd!: ElementRef;
  lineChart: any;
  lineChart2: any;
  datos:any = [];
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
      this.lineChartMethod2(promedios); 
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
            label: 'Promedio de temperatura de los últimos 7 días',
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
  
  

  cambioM() {
    console.log("Estado: "+ this.firebaseService.Modo);
    this.firebaseService.writeDatos('/Techo/Manual/Estado', this.estado)
    if (this.estado == true){
      this.rango = false
    } else{
      this.rango = true
    }
    if (this.estado == false){
      this.editar = false
    }else{
      this.editar = true
    }
  }

  cancel() {
    return this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modal.dismiss(this.temp, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.valor = `${ev.detail.data}`;
      this.firebaseService.TempTch = this.valor
      this.firebaseService.writeDatos('/Techo/Temperatura', Number(this.valor))
    }
  }
  onIonChange(ev: Event) {
    this.lastEmittedValue = (ev as RangeCustomEvent).detail.value;
    this.firebaseService.writeDatos('/Techo/Apertura', this.lastEmittedValue)
  }
  constructor(public firebaseService: FirebaseService) {
    this.datosGrafica()
  }

  ngOnInit() {
    this.firebaseService.mostrarDatoTR('/Techo/Temperatura');
    this.firebaseService.mostrarDatoTR('/Sensores/Humedad');
    this.firebaseService.mostrarDatoTR('/Techo/Apertura');
    this.firebaseService.mostrarDatoTR('/Techo/Manual/Estado');
  } 
}
