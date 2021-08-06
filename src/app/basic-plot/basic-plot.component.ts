import {
  Component,
  OnInit,
  Input,
  OnChanges
} from '@angular/core';
import {
  DataPoint
} from '../Interfaces/CovidData';
import * as Plotly from 'plotly.js/dist/plotly.js';
import {
  groupBy,
  basicTrace
} from '../Helper/general-helper';
import {
  changeHue,
  colors
} from '../Helper/color-helper';

@Component({
  selector: 'app-basic-plot',
  templateUrl: './basic-plot.component.html',
  styleUrls: ['./basic-plot.component.scss']
})
export class BasicPlotComponent implements OnChanges, OnInit {

  @Input() dataPoints: [DataPoint[]];
  log = false;
  line = false;
  pie = false;
  labels = true;
  loading = false;
  error = false;
  automargin = false;
  showLegend = false;
  showAverage = false;
  showAverage7 = false;
  avgString = '';
  avg7String = '';
  changeColorPerCaption = false;
  selectorOptions = {
    buttons: [{
      step: 'all'
    }],
  };
  layout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    plot_textcolor: 'rgba(255,255,255,255)',
    barmode: 'stack',
    font: {
      size: 14,
      color: '#fff'
    },
    yaxis: {
      type: 'log',
      autorange: true,
      automargin: true
    },
    annotations: [],
    shapes: [],
    xaxis: {
      rangeselector: null,
      rangeslider: {},
      showticklabels: true,
      automargin: false
    }
  };

  constructor() {}

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  ngOnInit() {
    this.init = true;
  }

  ngOnChanges(): void {
    this.drawAll();
  }

  init = true;
  drawAll() {
    this.loading = true;
    this.draw(this.randomIntFromInterval);
    this.loading = false;
  }

  data = [];
  draw(intervalFunc) {
    var average = [];
    this.data = [];
    this.avg7String = '';
    this.avgString = '';
    let color = colors[intervalFunc(0, colors.length - 1)];
    this.dataPoints.forEach(datapoints => {
      const pointsPerCaption = groupBy(datapoints, (x) => x.caption);
      var rows = JSON.parse(JSON.stringify(pointsPerCaption));
      const lineX = [];
      const lineY = [];
      const lineTrace = {
        ...basicTrace
      }
      lineTrace.x = [];
      lineTrace.y = [];
      lineTrace.fill = 'tozeroy';
      lineTrace.textinfo = '';
      lineTrace.showlegend = this.showLegend;
      lineTrace.automargin = this.automargin;
      for (var j in rows) {

        rows[j].forEach(pointPerCaption => {
          var trace = {
            ...basicTrace
          }
          trace.marker.color = '';
          if (!this.changeColorPerCaption) {
            color = changeHue(color, intervalFunc(60, 120));
            trace.marker.color = color;
          }
          trace.type = 'bar';
          trace.x = [];
          trace.y = [];
          trace.name = j;
          trace.showlegend = this.showLegend;
          trace.automargin = this.automargin;

          if (this.line || this.pie) {
            lineX.push(j);
            lineY.push(pointPerCaption.value);
          } else {
            trace.x.push(j);
            trace.y.push(pointPerCaption.value);
            this.data.push(trace);
          }
          average.push(pointPerCaption.value);
        });
      }
      if (this.line) {
        lineTrace.x = lineX;
        lineTrace.y = lineY;
        this.data.push(lineTrace);
      } else if (this.pie) {        
        lineTrace.type = 'pie';
        lineTrace.labels = lineX;
        lineTrace.values = lineY;
        this.data.push(lineTrace);
        if (!this.labels) {
          lineTrace.textinfo = 'none';
        }
      }
    });
    if (!this.log) {
      this.layout.yaxis.type = null;
    } else {
      this.layout.yaxis.type = 'log';
    }
    this.layout.xaxis = {
      rangeselector: this.selectorOptions,
      rangeslider: {},
      showticklabels: this.labels,
      automargin: this.automargin
    }
    this.layout.shapes = [];
    this.layout.annotations = [];
    if (this.showAverage) {
      const avg = (average.reduce((sum, cur) => sum + cur, 0)) / average.length;
      this.avgString = '(' + Math.round(avg).toString() + ')';
      this.layout.shapes.push({
        type: 'line',
        xref: 'paper',
        x0: 0,
        y0: avg,
        x1: 1,
        y1: avg,
        line: {
          color: colors[intervalFunc(0, colors.length - 1)],
          width: 4,
          dash: 'dot'
        }
      });
    }
    if (this.showAverage7) {
      const last7 = average.slice(average.length - 7, average.length);
      const avg7 = (last7.reduce((sum, cur) => sum + cur, 0)) / last7.length;
      this.avg7String = '(' + Math.round(avg7).toString() + ')';
      this.layout.shapes.push({
        type: 'line',
        xref: 'paper',
        x0: 0,
        y0: avg7,
        x1: 1,
        y1: avg7,
        line: {
          color: colors[intervalFunc(0, colors.length - 1)],
          width: 2,
          dash: 'dot'
        }
      });
    }
    setTimeout(() => {
      if (this.init) {
        this.init = false;
        var config = {
          responsive: true,
          scrollZoom: true
        }
        Plotly.newPlot('mainPlot', this.data, this.layout, config);
      } else {
        Plotly.react('mainPlot', this.data, this.layout);
      }
    }, 5);
  }

}
