import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {VehicleCode} from './shared/interface';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient) { }

  getVehicles(): Observable<VehicleCode[]> {
    return this.http.get<VehicleCode[]>('assets/data.json');
  }
}
