import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import {
  AddedSource,
  DataPoint
} from '../Interfaces/CovidData';
import { Filter } from '../Interfaces/General';

@Component({
  selector: 'app-added-source',
  templateUrl: './added-source.component.html',
  styleUrls: ['./added-source.component.scss']
})
export class AddedSourceComponent implements OnChanges {

  @Input() source: AddedSource;
  @Input() uniqueId: string;
  filteredSource: AddedSource;
  headers: string[] = [];
  selectedValue: string;
  selectedCaption: string;
  dateField: string;
  allFilter: Filter[] = [];
  filterCaptionOptions: string[] = [];
  filterOptions: string[] = [];
  @Output() newSource = new EventEmitter();
  @Output() newTitle = new EventEmitter();
  constructor(private elRef: ElementRef) {}

  ngOnChanges(): void {
    this.selectedValue = null;
    this.selectedCaption = null;
    this.filteredSource = this.source;

    setTimeout(() => {
      var rows = JSON.parse(JSON.stringify(this.source.value));
      var selector = document.getElementById("data-slct" + this.uniqueId) as HTMLSelectElement;
      var length = selector.options.length;
      for (var i = length - 1; i >= 0; i--) {
        selector.options[i] = null;
      }
      var selector1 = document.getElementById("cap-slct" + this.uniqueId) as HTMLSelectElement;
      var length1 = selector1.options.length;
      for (var i = length1 - 1; i >= 0; i--) {
        selector1.options[i] = null;
      }
      for (var j in rows[0]) {
        if (!isNaN(rows[0][j])) {
          var newoption = document.createElement("option");
          newoption.text = j;
          selector.add(newoption);
        }
        if (isNaN(rows[0][j])) {
          var newoption = document.createElement("option");
          newoption.text = j;
          selector1.add(newoption);
          this.filterCaptionOptions.push(j);
        }
      }
      selector.value = null;
      selector1.value = null;
    }, 100);
  }

  onChangeVal(newObj) {
    this.selectedValue = newObj;
    this.emitSource();
  }

  onChangeCap(newObj) {
    this.selectedCaption = newObj;
    this.emitSource();
  }

  addFilter() {
    const filter: Filter = { filterId: 'filter' + this.uniqueId + this.allFilter.length, filter: null, caption: null };
    this.allFilter.push(filter);
  }

  filterValues(filter: Filter) {
    let index = this.allFilter.findIndex(x => x.filterId == filter.filterId);
    if (index !== -1) {
      this.allFilter[index] = filter;
    } else {
      this.allFilter.push(filter);
      index = this.allFilter.length - 1;
    }

    if (this.allFilter[index].filter === '> Reset') {
      this.allFilter[index].filter = null;;    
    }
    if (this.allFilter[index].filter === '> Delete') {      
      this.allFilter.splice(index, 1);      
    }
    if (this.allFilter && this.allFilter.length > 0) {
      let values = this.source.value as object[];
      this.allFilter.filter(x => x.filter && x.filter.length > 0).forEach(filt => {
        values = values.filter(x => x[filt.caption] == filt.filter);
      });       
      this.filteredSource = {
        source: this.source.source,
        value: values
      }; 
    } else {
      this.filteredSource = this.source;
    }
    this.emitSource();
  }

  emitSource() {
    if (this.selectedValue && this.selectedCaption) {
      let newSources: DataPoint[] = [];
      var rows = JSON.parse(JSON.stringify(this.filteredSource.value));
      for (var i = 0; i < rows.length; i++) {
        newSources.push({
          caption: rows[i][this.selectedCaption],
          value: rows[i][this.selectedValue]
        });
      }
      newSources.sort((a, b) => {
        if (a.caption > b.caption) {
          return 1;
        } else if (a.caption < b.caption) {
          return -1;
        } else {
          return 0;
        }
      });
      var filter = document.getElementById("filter-slct" + this.uniqueId) as HTMLSelectElement;
      var data = document.getElementById("data-slct" + this.uniqueId) as HTMLSelectElement;
      var caption = document.getElementById("cap-slct" + this.uniqueId) as HTMLSelectElement;
      this.newSource.emit(newSources);
      let title = 'Showing ' + data.value + ' per ' + caption.value
      if (filter.value) {
        title += ' filtered by ' + filter.value;
      }
      this.newTitle.emit(title);
    }
  }
}
