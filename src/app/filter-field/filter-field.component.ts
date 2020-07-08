import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { AddedSource } from '../Interfaces/CovidData';
import { Filter } from '../Interfaces/General';

@Component({
  selector: 'app-filter-field',
  templateUrl: './filter-field.component.html',
  styleUrls: ['./filter-field.component.scss']
})
export class FilterFieldComponent implements OnChanges {

  constructor() { }
  @Input() filterCaptionOptions: string[];
  @Input() uniqueId: string;
  @Input() source: AddedSource;
  @Output() filter = new EventEmitter();
  selectedCaptionFilter: string;
  selectedFilter: string;

  ngOnChanges(): void {
    if (this.filterCaptionOptions) {      
    setTimeout(() => {
        var selector = document.getElementById("cap-slct" + this.uniqueId) as HTMLSelectElement;
        var length = selector.options.length;
        for (var i = length - 1; i >= 0; i--) {
          selector.options[i] = null;
        }
        this.filterCaptionOptions.forEach(option => {
          var newoption = document.createElement("option");
          newoption.text = option;
          selector.add(newoption);
        });
        selector.value = null;
      }, 100);
    }
  }
  

  onChangeCaptionFilter(newObj) {
    this.selectedCaptionFilter = newObj;
    if (this.selectedCaptionFilter) {
      var rows = JSON.parse(JSON.stringify(this.source.value));
      var selector = document.getElementById("filter-slct" + this.uniqueId) as HTMLSelectElement;
      var length = selector.options.length;
      for (var i = length - 1; i >= 0; i--) {
        selector.options[i] = null;
      }
      let options = [];
      for (var i = 0; i < rows.length; i++) {
        if (rows[i][this.selectedCaptionFilter]) {
          options.push(rows[i][this.selectedCaptionFilter]);
        }
      }
      var optReset = document.createElement("option");
      optReset.text = '> Reset';
      selector.add(optReset);
      var optDelete = document.createElement("option");
      optDelete.text = '> Delete';
      selector.add(optDelete);
      Array.from(new Set(options)).sort().forEach(option => {
        var newoption = document.createElement("option");
        newoption.text = option;
        selector.add(newoption);
      });
      selector.value = null;
    }
  }

  onChangeFilter(newFilter) {
    this.selectedFilter = newFilter;
    const filter: Filter = { filter: this.selectedFilter, caption: this.selectedCaptionFilter, filterId: this.uniqueId}
    if (this.selectedFilter === '> Reset') {
      this.selectedFilter = null;;    
    }
    this.filter.emit(filter);
  }

}
