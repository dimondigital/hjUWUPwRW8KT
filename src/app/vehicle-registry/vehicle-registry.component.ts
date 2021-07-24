import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {VehicleService} from '../vehicle.service';
import {VehicleFlat} from '../shared/interface';
import {MatSort} from "@angular/material/sort";
import {Subject} from "rxjs";
import {faSearch} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-vehicle-registry',
  templateUrl: './vehicle-registry.component.html',
  styleUrls: ['./vehicle-registry.component.scss']
})
export class VehicleRegistryComponent implements OnInit, AfterViewInit, OnDestroy {
  faSearch = faSearch;
  displayedColumns: string[] = ['vehicle', 'org', 'department', 'contragent', 'code1c', 'aggregate', 'drivers'];
  dataSource: MatTableDataSource<VehicleFlat>;
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
  filterString = '';
  searchInput = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private vehicleService: VehicleService) {
  }

  ngOnInit(): void {
  }

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
          // init availables Organizations, Departments & Contragents
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
        this.availableDepartments.sort();
        this.availableContragents.sort();
        this.dataSource = new MatTableDataSource<VehicleFlat>(this.flatVehicleData);
        this.dataSource.filterPredicate = (vehicle: VehicleFlat): boolean => {
          // search filter
          let searchFilter: boolean;
          if (this.searchInput && this.searchInput !== '' && this.searchInput !== undefined) {
            for (const [key, value] of Object.entries(vehicle)) {
              if (value && value.includes(this.searchInput)) {
                searchFilter = true;
              }
            }
          } else {
            searchFilter = true;
          }
          // complex filter
          for (const [key, value] of Object.entries(this.filterOptions)) {
            if (value !== undefined && vehicle[key] !== '' && vehicle[key] !== value) {
              return false;
            }
          }
          return true && searchFilter;
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(event?: Event): void {
    if (event) {
      this.searchInput = (event.target as HTMLInputElement).value.trim();
    }
    this.filterString = Object.values(this.filterOptions).join(' ').concat(` ${this.searchInput}`).trim();
    this.dataSource.filter = this.filterString;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
