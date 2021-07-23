import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {VehicleService} from '../vehicle.service';
import {VehicleCode} from '../shared/interface';

@Component({
  selector: 'app-vehicle-registry',
  templateUrl: './vehicle-registry.component.html',
  styleUrls: ['./vehicle-registry.component.scss']
})
export class VehicleRegistryComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['Транспортний засіб', 'Організація', 'Департамент', 'Контрагент', 'Код', 'Причіп', 'Водії'];
  dataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private vehicleService: VehicleService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    // get data
    this.vehicleService.getVehicles()
      .subscribe(data => {
        console.log(data);
        this.dataSource = new MatTableDataSource<VehicleCode>(data);
        this.dataSource.paginator = this.paginator;
      });

  }

}
