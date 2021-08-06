import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AddedSource } from '../Interfaces/CovidData';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent implements OnChanges {
  
  @Input() source: AddedSource;
  @Input() uniqueId: string;
  currentHtml = "";
  currentStart = 0;
  recordCount = 0;
  constructor() { }

  ngOnChanges(): void {     
    this.currentStart = 0;
      this.BuildTable();
  }

  BuildTable() {    
    const records = this.source.value as object[];
    this.recordCount = Math.ceil(records.length / 100);
    const data = records.slice(this.currentStart, this.currentStart + 100);
    var rows = JSON.parse(JSON.stringify(data)); 
    var html = '<table class="table table-dark table-striped">';
    html += '<thead><tr>';
    for (var j in rows[0]) {
      html += '<th style="position: sticky; top: -1px;" class="bg-dark">' + j;        
      html += '</th>';
    }
    html += '</tr></thead><tbody>';
    for (var i = 0; i < rows.length; i++) {
      html += '<tr>';
      for (var j in rows[i]) {
        html += '<td>' + rows[i][j] + '</td>';
      }
      html += '</tr>';
    }
    html += '<tbody></table>';
    this.currentHtml = html;
  }

}
