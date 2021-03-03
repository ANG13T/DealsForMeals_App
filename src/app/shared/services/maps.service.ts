import { Injectable } from '@angular/core';
import * as geofirex from 'geofirex';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  geo = geofirex.init(firebase);
  points: Observable<any>;
  
  constructor() { }
}
