import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  resetLayers = new Subject();

  clearMap = new Subject();

  showMarker = new Subject();

  constructor() { }
}
