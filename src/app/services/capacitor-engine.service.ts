import { Injectable } from '@angular/core';
import { CapacitorEngine } from 'cbl-ionic';
import  'cblite';
import { EngineLocator } from 'cblite';

@Injectable({
  providedIn: 'root'
})

export class CapacitorEngineService {
  engine: CapacitorEngine = new CapacitorEngine();
  engineLocator: EngineLocator = EngineLocator.getInstance;

  constructor() { }
}
