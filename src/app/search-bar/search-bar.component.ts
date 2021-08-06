import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { DataServiceService } from '../services/data-service.service';
import { Config } from '../Interfaces/CovidData';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnChanges {

  constructor(public dataservice: DataServiceService) { }
  @Output() data = new EventEmitter();
  @Output() config = new EventEmitter();
  @Input() configs: Config[];
  selectedDeviceObj: Config;
  loading = false;
  ngOnChanges(): void {
    this.configs = this.configs.slice(0, this.configs.length-2).sort((a,b) => (a.location > b.location) ? 1 : ((b.location > a.location) ? -1 : 0));
  }
  
  onChangeObj(newObj) {
    this.selectedDeviceObj = newObj;
    this.loading = true;
    if (this.selectedDeviceObj.iso_code != "OWID_WRL") {
      this.dataservice.GetCases(this.selectedDeviceObj.iso_code).subscribe(res => {
        this.data.emit(res);
      }, error => {
        this.data.emit(null);
      });
      this.dataservice.GetConfig(this.selectedDeviceObj.iso_code, this.selectedDeviceObj.location).subscribe(res => {
        this.config.emit(res);
        this.loading = false;
      }, error => {
        this.config.emit(null);
        this.loading = false;
      });
    } else {
      this.dataservice.GetWorldPercentages().subscribe(res => {
        this.data.emit(res);
        this.config.emit(null);
        this.loading = false;
      }, error => this.loading = false);
    }
  }

}
