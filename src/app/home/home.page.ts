// import { environment } from './../../environments/environment';
import { environment } from 'src/environments/environment.prod';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { FirebaseService } from '../shared/firebase.service'

const API_KEY = environment.API_KEY;
const API_URL = environment.API_URL;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  todayDate = new Date()
  cityName :any
  weatherTemp :any
  weatherDetails :any
  weatherIcon :any
  weatherStatus :any
  constructor(public HttpClient:HttpClient, public firebaseService: FirebaseService) {
    this.loadData();
  }
    ngOnInit(){
    this.firebaseService.tempTRR();
    this.firebaseService.mostrarDatoTR('/Sensores/Humedad');
    this.firebaseService.mostrarDatoTR('/Techo/Apertura');

  }


  loadData(){
    this.HttpClient.get(`${API_URL}/weather?q=${"Cancun"}&appid=${API_KEY}`).subscribe(results =>{
      const resultString = JSON.stringify(results)
      const x = JSON.parse(resultString)
      console.log(x);
      this.cityName = x['name']
      this.weatherTemp = x['main']
      this.weatherDetails = x['weather'][0]
      this.weatherIcon = `https://openweathermap.org/img/wn/${this.weatherDetails.icon}@4x.png`
      this.weatherStatus = this.weatherDetails['description']
      console.log(this.weatherIcon)
    })
  }


}

