import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DataPoint } from '../Interfaces/CovidData';
import { NgForOf } from '@angular/common';
import * as Plotly from 'plotly.js/dist/plotly.js';
import { isDate } from 'util';

@Component({
  selector: 'app-basic-plot',
  templateUrl: './basic-plot.component.html',
  styleUrls: ['./basic-plot.component.scss']
})
export class BasicPlotComponent implements OnChanges {

  @Input() dataPoints: [DataPoint[]];
  @Input() pie;
  colors = ['#7ac143', '#00bce4', '#7d3f98', '#30c39e', '#ffc168', '#8e43e7', '#ff4f81', '#ecb731'];
  color = '';
  log = false;
  line = false;
  labels = true;
  automargin = false;
  selectorOptions = {
    buttons: [{
        step: 'all'
    }],
};
  constructor() { }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  ngOnChanges(): void {    
    this.color = this.colors[this.randomIntFromInterval(0, 7)];
    this.draw();
  }

  draw() {
    var data = [];
    this.dataPoints.forEach(datapoints => {
      var trace1 = {
        type: 'bar',
        x: [],
        y: [],
        stackgroup: null,
        values: [],
        labels: [],
        marker: {
          color: this.color
        },
        automargin: true,
        text: {
          cliponaxis: false
        }
      };
      if(this.line) {
        trace1.type = null;
        trace1.stackgroup = 'one';
      }
      if (this.pie === false) {
        datapoints.forEach(point => {      
          trace1.x.push(point.caption);
          trace1.y.push(point.value);
        });
        data.push(trace1);
      }
      else {
        trace1.type = 'pie';
        datapoints.forEach(point => {      
          trace1.labels.push(point.caption);
          trace1.values.push(point.value);
        });
        data.push(trace1);
      }
    });
    
    var layout = { 
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      plot_textcolor: 'rgba(255,255,255,255)',
      font: {size: 14, color: '#fff'},     
      yaxis: {
        type: 'log',
        autorange: true,
        automargin: this.automargin
      },
      xaxis: {
          rangeselector: this.selectorOptions,
          rangeslider: {},
          showticklabels: this.labels,
          automargin: this.automargin
      }
    };
    if(!this.log) {
      layout.yaxis = {type: null, autorange: true, automargin: true};
    }   
    /*var date = new Date(this.dataPoints[0][0].caption);
    if (date instanceof Date && !isNaN(date.valueOf())) {
      layout.xaxis.showticklabels = true;
    }*/
    var config = {responsive: true, scrollZoom: true}    
    Plotly.newPlot('mainPlot', data, layout, config );
  }

}
