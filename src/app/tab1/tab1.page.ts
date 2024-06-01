import { Component } from '@angular/core';
import { CapacitorEngineService } from '../services/capacitor-engine.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private engineService: CapacitorEngineService) {

  }

}
