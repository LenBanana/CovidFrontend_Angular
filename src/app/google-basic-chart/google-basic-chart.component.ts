import {
  Component,
  DoCheck,
  Input,
  IterableDiffer,
  IterableDiffers,
  KeyValueDiffer,
  KeyValueDiffers,
  OnChanges,
  OnInit
} from '@angular/core';
import {
  DataPoint, DataPointFilter
} from '../Interfaces/CovidData';
import {
  ChartData
} from '../Interfaces/General';

@Component({
  selector: 'app-google-basic-chart',
  templateUrl: './google-basic-chart.component.html',
  styleUrls: ['./google-basic-chart.component.scss']
})
export class GoogleBasicChartComponent implements OnInit, OnChanges, DoCheck {

  @Input() chartData: ChartData[];
  @Input() chartType = "AreaChart";
  @Input() UniqueId = 0;
  iterableDiffer: IterableDiffer < ChartData > ;
  googleChartData: any[][];
  googleChartColumns: any[];
  colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'];
  chartOptions = {
    hAxis: {
      textStyle: {
        format: 'short',
        color: '#FFF'
      }
    },
    DateFormat: {
      formatType: "short"
    },
    vAxis: {
      textStyle: {
        color: '#FFF'
      }
    },
    backgroundColor: 'transparent',
    is3D: true,
    chartArea: {
      backgroundColor: 'transparent'
    },
    legend: {
      "textStyle": {
        color: '#FFF'
      }
    }
  };

  constructor(private iterableDiffers: IterableDiffers) {
    this.iterableDiffer = iterableDiffers.find([]).create(null);
  }

  ngOnInit(): void {}

  ngDoCheck() {
    if (!this.chartData) {
      return;
    }
    let changes = this.iterableDiffer.diff(this.chartData);
    if (changes) {
      this.Draw();
    }
  }

  ngOnChanges() {
    this.Draw();
  }

  Draw() {
    var chartdata: any[][] = [];
    var columns = [];
    columns.push("Caption");
    var i = 0;
    this.chartData.forEach(chart => {
      if (chart.points.some(x => x.value != null)) {
        columns.push(chart.name);
        i++;
        chart.points.filter(x => x.selected).forEach(dataPoint => {
          var caption = dataPoint.caption as any;
          var dateParse = Date.parse(caption);
          var isDate = !isNaN(dateParse);
          if (isDate) {
            caption = new Date(dateParse);
          }
          var capIdx = chartdata.findIndex(x => x[0] == caption || (isDate && x[0].v.getTime() == caption.getTime()));
          if (capIdx > -1) {
            chartdata[capIdx][i] = dataPoint.value;
          } else {
            if (isDate) {
              chartdata.push([{v: caption, f: (caption as Date).toLocaleDateString()}]);
            } else {
              chartdata.push([caption]);
            }
            capIdx = chartdata.length - 1;
            chartdata[capIdx][i] = dataPoint.value;
          }
        });
      }
    });
    var dataLength = this.chartData.filter(x => x.points.some(y => y.value != null)).length + 1;
    chartdata.forEach(x => {
      while (x.length < dataLength) {
        x.push(null);
      }
    });
    var jsonData = JSON.parse(JSON.stringify(chartdata));
    this.googleChartData = jsonData;
    this.googleChartColumns = columns;
  }

}
