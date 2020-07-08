import {
  Component,
  OnInit,
  OnChanges
} from '@angular/core';
import {
  DataServiceService
} from './services/data-service.service';
import {
  CovidData,
  Config
} from './Interfaces/CovidData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  data: CovidData;
  config: Config;
  configs: Config[];
  currentTitle = 'Total cases per date';
  currentQueue = 0;
  constructor(public dataservice: DataServiceService) {}

  ngOnInit() {
    this.dataservice.GetConfigs().subscribe(res => {
      this.configs = res;
    });
  }

  GetData(queue: number) {
    switch (queue) {
      case 0:
        this.dataservice.GetCases(this.data.config.iso_code).subscribe(res => {
          this.data.dataPoints = res.dataPoints;
          this.currentTitle = 'Total cases per date';
          this.currentQueue = 0;
        });
        break;
      case 1:
        this.dataservice.GetDeaths(this.data.config.iso_code).subscribe(res => {
          this.data.dataPoints = res.dataPoints;
          this.currentTitle = 'Total deaths per date';
          this.currentQueue = 1;
        });
        break;
      case 2:
        this.dataservice.GetNewCases(this.data.config.iso_code).subscribe(res => {
          this.data.dataPoints = res.dataPoints;
          this.currentTitle = 'New cases reported per date';
          this.currentQueue = 2;
        });
        break;
      case 3:
        this.dataservice.GetNewDeaths(this.data.config.iso_code).subscribe(res => {
          this.data.dataPoints = res.dataPoints;
          this.currentTitle = 'New deaths reported per date';
          this.currentQueue = 3;
        });
        break;
      case 4:
        this.dataservice.GetNewTests(this.data.config.iso_code).subscribe(res => {
          this.data.dataPoints = res.dataPoints;
          this.currentTitle = 'New tests reported per date (smoothed to resemble the date of reporting)';
          this.currentQueue = 4;
        });
        break;

      default:
        break;
    }
  }
}
