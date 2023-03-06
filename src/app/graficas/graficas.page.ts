import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

//descargar chart.js con npm i chart.js --save
import { Chart } from 'chart.js/auto';
import { type } from 'os';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.page.html',
  styleUrls: ['./graficas.page.scss'],
})
export class GraficasPage implements AfterViewInit {
  @ViewChild('doughnutCanvas') private doughnutCanvas!: ElementRef;
  @ViewChild('lineCanvas') private lineCanvas!: ElementRef;
  doughnutChart: any;
  lineChart: any;

  constructor() { }

  ngAfterViewInit(){
    this.doughnutChartMethod();
  }

  doughnutChartMethod(){
    this.doughnurtChart = new Chart(this.doughnutCanvas.nativeElement, {
      type:'doughnut',
      data: {
        labels: []
        data: [50, 29, 15, 10, 7],
        backgroundColor:[

        ]
      }


    }

  }



  ngOnInit() {
  }


}
 