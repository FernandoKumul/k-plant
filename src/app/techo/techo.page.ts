import { FirebaseService } from './../shared/firebase.service';
import { Component, OnInit, ViewChild} from '@angular/core';
import { RangeCustomEvent } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
@Component({
  selector: 'app-techo',
  templateUrl: './techo.page.html',
  styleUrls: ['./techo.page.scss'],
})

export class TechoPage implements OnInit{
  @ViewChild(IonModal) modal: any;
  lastEmittedValue :any
  temp: any
  valor: any;
  
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
      this.firebaseService.writeDatos('/Techo/Temperatura', this.valor)
    }
  }
  onIonChange(ev: Event) {
    this.lastEmittedValue = (ev as RangeCustomEvent).detail.value;
    this.firebaseService.writeDatos('/Techo/Apertura', this.lastEmittedValue)
  }
  constructor(public firebaseService: FirebaseService) {
  }

  ngOnInit() {
    this.firebaseService.mostrarDatoTR('/Techo/Temperatura');
    this.firebaseService.mostrarDatoTR('/Sensores/Humedad');
    this.firebaseService.mostrarDatoTR('/Techo/Apertura');
  }
}

