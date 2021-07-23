import {AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {VehicleService} from '../vehicle.service';
import {VehicleCode, VehicleFlat} from '../shared/interface';
import {MatSort} from "@angular/material/sort";
import {Subject} from "rxjs";

@Component({
  selector: 'app-vehicle-registry',
  templateUrl: './vehicle-registry.component.html',
  styleUrls: ['./vehicle-registry.component.scss']
})
export class VehicleRegistryComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  displayedColumns: string[] = ['vehicle', 'org', 'department', 'contragent', 'code1c', 'aggregate', 'drivers'];
  dataSource: MatTableDataSource<VehicleFlat>;
  // dataSource_filtered: MatTableDataSource<VehicleFlat>;
  flatVehicleData: VehicleFlat[] = [];
  availableOrganizations: string[] = [];

  destroyed$: Subject<boolean> = new Subject<boolean>();

  filterOptions = {
    org: ''
  };

  foods: any[] = [
    {value: 'steak-0', viewValue: 'Захаров'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];
  selectedFood = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private vehicleService: VehicleService) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.vehicleService.getVehicles()
      .subscribe(data => {
        data.map(item => {
          item.vehicleFlat = {
            vehicle: item.Vehicle.name,
            org: item.Vehicle.Organization.name,
            department: item.Vehicle.Department?.name,
            contragent: item.Vehicle.Contragent?.name,
            code1c: item.code1c,
            aggregate: item.Aggregate?.name,
            drivers: item.Drivers.map(d => d.name).join(' ')
          };
          this.flatVehicleData.push(item.vehicleFlat);
          if (!this.availableOrganizations.includes(item.vehicleFlat.org)) {
            this.availableOrganizations.push(item.vehicleFlat.org);
          }
        });
        this.availableOrganizations.sort();
        this.dataSource = new MatTableDataSource<VehicleFlat>(this.flatVehicleData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  applyFilter(event?: Event): void {
    // input filter
    if (event) {
      const filterValue = (event.target as HTMLInputElement).value;
      console.log(`filterValue: ${filterValue}`);
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } else {
      // complex filter
      const filterValue = Object.values(this.filterOptions).join(' ');
      this.dataSource.filter = filterValue;
      this.dataSource.filterPredicate = (data: VehicleFlat, filter: string): boolean => {
        for (const [key, value] of Object.entries(this.filterOptions)) {
          if (data[key] && data[key] === value) {
            return true;
          }
        }
        return false;
      };
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
