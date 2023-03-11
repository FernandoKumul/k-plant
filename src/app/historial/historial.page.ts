import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FirebaseService } from '../shared/firebase.service'
//npm i chart.js --save
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements AfterViewInit {
  // Importing ViewChild. We need @ViewChild decorator to get a reference to the local variable 
  // that we have added to the canvas element in the HTML template.
  @ViewChild('lineCanvas') private lineCanvas!: ElementRef;
  lineChart: any;
  datos = [10, 7];

  constructor(public firebaseService: FirebaseService) {
    this.datosGrafica()
  }
  // When we try to call our chart to initialize methods in ngOnInit() it shows an error nativeElement of undefined. 
  // So, we need to call all chart methods in ngAfterViewInit() where @ViewChild and @ViewChildren will be resolved.
  ngAfterViewInit() {
  }

  
  datosGrafica(){
    this.firebaseService.getDatos().then((Registro) => {

      const resultado = JSON.parse(JSON.stringify(Registro))
      console.log(resultado);
      this.lineChartMethod();
      this.datos[1] = 0;

    })
  }
  
  lineChartMethod() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00','17:00','18:00'],
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
            data: [30, 41, 30, 50, 30, 18, 40, 10, 5, 50, 30, 15,33],
            spanGaps: false,
            tension:0.4,
          }
        ]
      }
    });
  }


}

