import {AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {VehicleService} from '../vehicle.service';
import {VehicleCode} from '../shared/interface';
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-vehicle-registry',
  templateUrl: './vehicle-registry.component.html',
  styleUrls: ['./vehicle-registry.component.scss']
})
export class VehicleRegistryComponent implements OnInit, AfterViewInit, OnChanges {
  displayedColumns: string[] = ['Транспортний засіб', 'Організація', 'Департамент', 'Контрагент', 'Код', 'Причіп', 'Водії'];
  dataSource: MatTableDataSource<VehicleCode>;
  dataSource_filtered: MatTableDataSource<VehicleCode>;

  filteredValues = {
    vehicleName: '',
    organizationName: '',
    departmentName: '',
    contragentName: ''
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private vehicleService: VehicleService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.vehicleService.getVehicles()
      .subscribe(data => {
        this.dataSource = new MatTableDataSource<VehicleCode>(data);
        // this.dataSource_filtered = this.dataSource;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {

  }



  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(`filterValue: ${filterValue}`);
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      // this.dataSource.paginator.firstPage();
    }
  }

}
