import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VehicleRegistryComponent} from './vehicle-registry/vehicle-registry.component';

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent
  },
  {
    path: 'vehicle-registry',
    component: VehicleRegistryComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
