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
  Config,
  DataPoint
} from './Interfaces/CovidData';
import { ChartData } from './Interfaces/General';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  data: CovidData;
  dataPoints: ChartData[] = [];
  filteredDataPoints: ChartData[] = [];
  config: Config;
  configs: Config[];
  currentTitle = '';
  chartType = "AreaChart";
  UniqueId = 0;
  selectedValues = [true, false, false, false, false]

  constructor(public dataservice: DataServiceService) {}

  ngOnInit() {    
    google.charts.load('current', {
      packages:['corechart']
    });
    this.dataservice.GetConfigs().subscribe(res => {
      this.configs = res;
    });
  }

  ChangeConfig($event) {
    this.data=$event;
    this.dataPoints=[];
    this.filteredDataPoints=[];
    this.selectedValues = [true, false, false, false, false];
    this.GetData(0);
  }

  GetData(queue: number) {
    //if (this.selectedValues.filter(x => x == true).length == 1 && this.selectedValues[queue] == true && this.dataPoints.length > 0) {
    //  return;
    //}
    switch (queue) {
      case 0:
        var idx = this.dataPoints ? this.dataPoints.findIndex(x => x.name == "Total Cases") : -1;
        if (idx !== -1) {
          this.dataPoints.splice(idx, 1);
          this.filteredDataPoints.splice(idx, 1);
          this.selectedValues[queue] = false;
        } else {     
          this.dataservice.GetCases(this.data.config.iso_code).subscribe(res => {
            this.dataPoints.push({name: "Total Cases", points: res.dataPoints});
            this.filteredDataPoints.push({name: "Total Cases", points: res.dataPoints});
            this.selectedValues[queue] = true;
          });
        }
        break;
      case 1:
        var idx = this.dataPoints ? this.dataPoints.findIndex(x => x.name == "Total Deaths") : -1;
        if (idx !== -1) {
          this.dataPoints.splice(idx, 1);
          this.filteredDataPoints.splice(idx, 1);
          this.selectedValues[queue] = false;
        } else {     
          this.dataservice.GetDeaths(this.data.config.iso_code).subscribe(res => {
            this.dataPoints.push({name: "Total Deaths", points: res.dataPoints});
            this.filteredDataPoints.push({name: "Total Deaths", points: res.dataPoints});
            this.selectedValues[queue] = true;
          });
        }
        break;
      case 2:
        var idx = this.dataPoints ? this.dataPoints.findIndex(x => x.name == "New Cases") : -1;
        if (idx !== -1) {
          this.dataPoints.splice(idx, 1);
          this.filteredDataPoints.splice(idx, 1);
          this.selectedValues[queue] = false;
        } else {     
          this.dataservice.GetNewCases(this.data.config.iso_code).subscribe(res => {
            this.dataPoints.push({name: "New Cases", points: res.dataPoints});
            this.filteredDataPoints.push({name: "New Cases", points: res.dataPoints});
            this.selectedValues[queue] = true;
          });
        }
        break;
      case 3:
        var idx = this.dataPoints ? this.dataPoints.findIndex(x => x.name == "New Deaths") : -1;
        if (idx !== -1) {
          this.dataPoints.splice(idx, 1);
          this.filteredDataPoints.splice(idx, 1);
          this.selectedValues[queue] = false;
        } else {     
          this.dataservice.GetNewDeaths(this.data.config.iso_code).subscribe(res => {
            this.dataPoints.push({name: "New Deaths", points: res.dataPoints});
            this.filteredDataPoints.push({name: "New Deaths", points: res.dataPoints});
            this.selectedValues[queue] = true;
          });
        }
        break;
      case 4:
        var idx = this.dataPoints ? this.dataPoints.findIndex(x => x.name == "New Tests") : -1;
        if (idx !== -1) {
          this.dataPoints.splice(idx, 1);
          this.filteredDataPoints.splice(idx, 1);
          this.selectedValues[queue] = false;
        } else {     
          this.dataservice.GetNewTests(this.data.config.iso_code).subscribe(res => {
            this.dataPoints.push({name: "New Tests", points: res.dataPoints});
            this.filteredDataPoints.push({name: "New Tests", points: res.dataPoints});
            this.selectedValues[queue] = true;
          });
        }
        break;

      default:
        break;
    }
  }

  filterData(data: ChartData) {
    var idx = this.filteredDataPoints.findIndex(x => x.name == data.name);
    if (idx > -1) {
      this.UniqueId++;
    }
  }

  chartChange(event) {
    this.chartType = event.target.value;
  }

  RemoveChartData() {
    var selectedChart = $('#ChartDataCaptions').val();
    switch (selectedChart) {
      case "Total Cases":
        this.GetData(0);
        return;
      case "Total Deaths":
        this.GetData(1);
        return;
      case "New Cases":
        this.GetData(2);
        return;
      case "New Deaths":
        this.GetData(3);
        return;
      case "New Tests":
        this.GetData(4);
        return;
    }
    const index = this.dataPoints.findIndex(x => x.name == selectedChart);
    if (index > -1) {
      this.dataPoints.splice(index, 1);
      this.filteredDataPoints.splice(index, 1);
    }
  }

  externalSource(newData: ChartData) {
    var cleanedData = newData.points.filter(x => x.value != null);
    if (cleanedData != null && cleanedData.length > 0) {
      this.dataPoints.push({name: newData.name, points: cleanedData});
      this.filteredDataPoints.push({name: newData.name, points: cleanedData});
    }
  }

  ReloadConfig(config?) {
    if (config) {
      this.config.addedSources.push(config);
      return;
    }
    this.dataservice.GetConfig(this.config.iso_code, this.config.location).subscribe(res => {
      this.config = res;
    }, error => console.log(error));
  }
}
