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
import {
  ChartData
} from './Interfaces/General';
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
  LogScale = false;
  config: Config;
  configs: Config[];
  currentTitle = '';
  chartType = "AreaChart";
  UniqueId = 0;
  selectedValues = [true, false, false, false, false]
  CollectedData = []

  constructor(public dataservice: DataServiceService) {}

  ngOnInit() {
    google.charts.load('current', {
      packages: ['corechart']
    });
    this.dataservice.GetConfigs().subscribe(res => {
      this.configs = res;
    });
  }

  ChangeConfig($event) {
    this.data = $event;
    this.dataPoints = [];
    this.filteredDataPoints = [];
    this.selectedValues = [true, false, false, false, false];
    this.GetData(0);
  }

  GetData(queue: number) {
    //if (this.selectedValues.filter(x => x == true).length == 1 && this.selectedValues[queue] == true && this.dataPoints.length > 0) {
    //  return;
    //}
    var dataName = "";
    var func = "GetCases";
    switch (queue) {
      case 0:
        dataName = "Total Cases";
        break;
      case 1:
        dataName = "Total Deaths";
        func = "GetDeaths";
        break;
      case 2:
        dataName = "New Cases";
        func = "GetNewCases";
        break;
      case 3:
        dataName = "New Deaths";
        func = "GetNewDeaths";
        break;
      case 4:
        dataName = "New Tests";
        func = "GetNewTests";
        break;
    }
    
    var idx = this.dataPoints ? this.dataPoints.findIndex(x => x.name == dataName) : -1;
    if (idx !== -1) {
      this.dataPoints.splice(idx, 1);
      this.filteredDataPoints.splice(idx, 1);
      this.selectedValues[queue] = false;
      this.sortData();
    } else {
      var idx = this.CollectedData.findIndex(x => x.iso == this.data.config.iso_code && x.data.name == dataName);
      if (idx > -1) {
        var obj = this.CollectedData[idx];
        this.dataPoints.push(obj.data);
        this.filteredDataPoints.push(obj.data);
        this.selectedValues[queue] = true;
        this.sortData();
      } else {
        this.dataservice[func](this.data.config.iso_code).subscribe(res => {
          var obj = {
            name: dataName,
            points: res.dataPoints
          };
          this.dataPoints.push(obj);
          this.filteredDataPoints.push(obj);
          this.selectedValues[queue] = true;
          this.CollectedData.push({
            iso: this.data.config.iso_code,
            data: obj
          });
          this.sortData();
        });
      }
    }
  }

  sortData() {
    if (this.dataPoints.length > 1) {
      this.dataPoints.sort((a, b) => (a.points[0]?.caption > b.points[0]?.caption) ? 1 : ((b.points[0]?.caption > a.points[0]?.caption) ? -1 : 0));
      this.filteredDataPoints.sort((a, b) => (a.points[0]?.caption > b.points[0]?.caption) ? 1 : ((b.points[0]?.caption > a.points[0]?.caption) ? -1 : 0));
    }
  }

  filterData() {
    this.UniqueId++;
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
      this.sortData();
    }
  }

  externalSource(newData: ChartData) {
    var cleanedData = newData.points.filter(x => x.value != null);
    if (cleanedData != null && cleanedData.length > 0) {
      var nameCount = this.dataPoints.filter(x => x.name == newData.name).length;
      this.dataPoints.push({
        name: nameCount > 0 ? newData.name + "-" + nameCount : newData.name,
        points: cleanedData
      });
      this.filteredDataPoints.push({
        name: nameCount > 0 ? newData.name + "-" + nameCount : newData.name,
        points: cleanedData
      });
      this.sortData();
    }
  }

  ReloadConfig(config ? ) {
    if (config) {
      this.config.addedSources.push(config);
      return;
    }
    this.dataservice.GetConfig(this.config.iso_code, this.config.location).subscribe(res => {
      this.config = res;
    }, error => console.log(error));
  }
}
