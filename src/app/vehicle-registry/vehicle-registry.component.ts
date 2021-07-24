import {AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {VehicleService} from '../vehicle.service';
import {VehicleCode, VehicleFlat} from '../shared/interface';
import {MatSort} from "@angular/material/sort";
import {Subject} from "rxjs";
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-vehicle-registry',
  templateUrl: './vehicle-registry.component.html',
  styleUrls: ['./vehicle-registry.component.scss']
})
export class VehicleRegistryComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  faSearch = faSearch;
  displayedColumns: string[] = ['vehicle', 'org', 'department', 'contragent', 'code1c', 'aggregate', 'drivers'];
  dataSource: MatTableDataSource<VehicleFlat>;
  // dataSource_filtered: MatTableDataSource<VehicleFlat>;
  flatVehicleData: VehicleFlat[] = [];
  availableOrganizations: string[] = [];
  availableDepartments: string[] = [];
  availableContragents: string[] = [];

  destroyed$: Subject<boolean> = new Subject<boolean>();

  filterOptions = {
    org: undefined,
    department: undefined,
    contragent: undefined
  };

  searchInput = '';

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
          if (item.vehicleFlat.org && !this.availableOrganizations.includes(item.vehicleFlat.org)) {
            this.availableOrganizations.push(item.vehicleFlat.org);
          }
          if (item.vehicleFlat.department && !this.availableDepartments.includes(item.vehicleFlat.department)) {
            this.availableDepartments.push(item.vehicleFlat.department);
          }
          if (item.vehicleFlat.contragent && !this.availableContragents.includes(item.vehicleFlat.contragent)) {
            this.availableContragents.push(item.vehicleFlat.contragent);
          }
        });
        this.availableOrganizations.sort();
        this.dataSource = new MatTableDataSource<VehicleFlat>(this.flatVehicleData);
        this.dataSource.filterPredicate = (datas: VehicleFlat, filter: string): boolean => {
          for (const [key, value] of Object.entries(this.filterOptions)) {
              if (value !== undefined && datas[key] !== '' && datas[key] !== value) {
                return false;
             }
          }
          return true;
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  applyFilter(event?: Event): void {
    // let filterValues = '';
    // input filter
    if (event) {
      // this.searchInput = (event.target as HTMLInputElement).value.trim().toLowerCase();
      // // filterValues = filterValues.concat((event.target as HTMLInputElement).value.trim().toLowerCase());
      // console.log(`filterValue: ${this.searchInput}`);
      // this.dataSource.filter = this.searchInput;
      // if (this.dataSource.paginator) {
      //   this.dataSource.paginator.firstPage();
      // }
    }
      // complex filter
    const filterValues = Object.values(this.filterOptions).join(' ').trim();
    console.log(`_${this.filterOptions}_`);
    this.dataSource.filter = filterValues;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
