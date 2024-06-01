import { Injectable } from '@angular/core';
import { CapacitorEngine, EngineLocator } from 'cbl-ionic';

@Injectable({
  providedIn: 'root'
})

export class CapacitorEngineService {
  engine: CapacitorEngine;

  constructor() {
    this.engine = new CapacitorEngine();
  }
}
