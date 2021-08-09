import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { AddedSource } from '../Interfaces/CovidData';
import { Filter, FilterDefine, FilterType } from '../Interfaces/General';

@Component({
  selector: 'app-filter-field',
  templateUrl: './filter-field.component.html',
  styleUrls: ['./filter-field.component.scss']
})
export class FilterFieldComponent implements OnInit, OnChanges {

  constructor() { }
  @Input() filterCaptionOptions: string[];
  @Input() currentFilter: Filter;
  @Input() first: boolean;
  @Input() last: boolean;
  @Input() source: AddedSource;
  @Output() filter = new EventEmitter();
  @Output() move = new EventEmitter();
  selectedCaptionFilter: string;
  selectedFilter: string;
  customFilter: number;
  filterDefine: FilterDefine = FilterDefine.Equal;
  filterType: FilterType = FilterType.Filter;
  FilterType = FilterType;
  CustomValue = false;

  ngOnInit(): void {
    if (this.filterType== FilterType.Filter) {
      this.filterDefine = FilterDefine.Sum;
    }
    if (this.filterCaptionOptions) {      
    setTimeout(() => {
        var captionSelector = document.getElementById("cap-slct-" + this.currentFilter.filterId) as HTMLSelectElement;
        var filterSelector = document.getElementById("filter-slct-" + this.currentFilter.filterId) as HTMLSelectElement;
        var length = captionSelector.options.length;
        for (var i = length - 1; i >= 0; i--) {
          captionSelector.options[i] = null;
          if (this.filterType != FilterType.Filter&&this.filterType != FilterType.FilterRange) {            
            filterSelector.options[i] = null;
          }
        }
        this.filterCaptionOptions.forEach(option => {
          var newoption = document.createElement("option");
          newoption.text = option;
          captionSelector.add(newoption);
          if (this.filterType != FilterType.Filter&&this.filterType != FilterType.FilterRange) {            
            var newFilteroption = document.createElement("option");
            newFilteroption.text = option;
            filterSelector.add(newFilteroption);
          }
        });
        captionSelector.value = null;
        filterSelector.value = null;
      }, 100);
    }
  }  

  ngOnChanges(): void {    
    this.filterType = this.currentFilter.getType();
    this.selectedCaptionFilter = this.currentFilter.caption;
    this.selectedFilter = this.currentFilter.filter;
  }

  onChangeCaptionFilter(newObj) {
    this.selectedCaptionFilter = newObj;
    this.EmitFilter(false);
    if (this.filterType!= FilterType.Filter&&this.filterType!=FilterType.FilterRange) {      
      return;
    }
    if (this.selectedCaptionFilter) {
      var rows = JSON.parse(JSON.stringify(this.source.value));
      var selector = document.getElementById("filter-slct-" + this.currentFilter.filterId) as HTMLSelectElement;
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
    newFilter = newFilter.toString();
    if (!newFilter) {
      return;
    }
    if (newFilter === '> Reset') {
      this.selectedFilter = null;
      return;
    }
    if (newFilter=== 'Custom') {
      this.CustomValue = !this.CustomValue
      this.selectedFilter = null;
      return;
    }
    this.selectedFilter = newFilter;
    this.EmitFilter(false);
  }

  setFilterDefine(define) {
    this.currentFilter.define = FilterDefine[define.target.value as string];
    this.EmitFilter(false);
  }

  EmitFilter(force: boolean) {
    const filter: Filter = this.currentFilter;
    filter.filter = this.selectedFilter;
    filter.caption = this.selectedCaptionFilter;
    if (!force && this.selectedFilter && this.selectedCaptionFilter && this.filterDefine > -1) {
      this.filter.emit(filter);
    } else if (force) {
      this.filter.emit(filter);
    }
  }

  Reset() {
    this.selectedFilter = '> Reset';
    this.EmitFilter(true);
    this.selectedFilter = null;
  }

  Delete() {
    this.selectedFilter = '> Delete';
    this.EmitFilter(true);
  }

  Move(Up: boolean) {
    this.move.emit({up: Up, id: this.currentFilter.filterId})
  }

}
