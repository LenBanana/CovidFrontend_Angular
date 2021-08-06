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
  DataPoint,
  DataPointFilter
} from '../Interfaces/CovidData';
import {
  ChartData,
  Filter,
  FilterDefine,
  FilterType
} from '../Interfaces/General';
import {
  groupBy
} from 'rxjs/internal/operators/groupBy';
import {
  array_move,
  parseDate
} from '../Helper/general-helper';
import {
  isDate
} from 'util';
declare var $: any;

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
    this.filteredSource = JSON.parse(JSON.stringify(this.source));

    setTimeout(() => {
      this.setCaptions();
    }, 100);
  }

  setCaptions() {
    const rows = JSON.parse(JSON.stringify(this.filteredSource.value[0]));
    const sourceRows = JSON.parse(JSON.stringify(this.source.value[0]));
    let filterOptions = [];
    const dataSelector = document.getElementById("data-slct" + this.uniqueId) as HTMLSelectElement;
    const dataValue = dataSelector.value;
    const dataLength = dataSelector.options.length;

    const captionSelector = document.getElementById("cap-slct" + this.uniqueId) as HTMLSelectElement;
    const captionValue = captionSelector.value;
    const captionLength = captionSelector.options.length;

    for (let i = dataLength - 1; i >= 0; i--) {
      dataSelector.options[i] = null;
    }
    for (let i = captionLength - 1; i >= 0; i--) {
      captionSelector.options[i] = null;
    }

    const allOptions = [];
    for (let j in rows) {
      let caption = document.createElement("option");
      caption.text = j;
      captionSelector.add(caption);
      let data = document.createElement("option");
      data.text = j;
      dataSelector.add(data);
      allOptions.push(j);
      let filter = document.createElement("option");
      filter.text = j;
      filterOptions.push(j);
    }

    for (let j in sourceRows) {
      if (!filterOptions.includes(j)) {        
        let filter = document.createElement("option");
        filter.text = j;
        filterOptions.push(j);
      }
    }

    if (filterOptions.length != this.filterCaptionOptions.length) {
      this.filterCaptionOptions = filterOptions;
    }
    if (allOptions.includes(dataValue)) {
      dataSelector.value = dataValue;
    } else {
      dataSelector.value = null;
      this.selectedValue = null;
    }
    if (allOptions.includes(captionValue)) {
      captionSelector.value = captionValue;
    } else {
      captionSelector.value = null;
      this.selectedCaption = null;
    }
  }

  onChangeVal(newObj) {
    this.selectedValue = newObj;
    this.emitSource();
  }

  onChangeCap(newObj) {
    this.selectedCaption = newObj;
    this.emitSource();
  }

  addFilter(define) {
    const randomId = Math.floor(Math.random() * 1000000) + 1;
    const filter: Filter = new Filter();
    filter.filterId = 'filter-' + this.uniqueId + this.allFilter.length + randomId;
    filter.filter = null;
    filter.caption = null;
    switch (define) {
      case 0:
        filter.define = FilterDefine.Equal;
        break;
      case 1:
        filter.define = FilterDefine.Sum;
        break;
      case 2:
        filter.define = FilterDefine.Plus;
        break;
    }
    this.allFilter.push(filter);
  }

  moveFilter(move) {
    const idx = this.allFilter.findIndex(x => x.filterId == move.id);
    if (idx != -1) {
      if (move.up) {
        if (idx > 0) {
          this.allFilter = array_move(this.allFilter, idx, idx - 1);
          this.setAllFilters();
        }
      } else {
        if ((this.allFilter.length - 1) > idx) {
          this.allFilter = array_move(this.allFilter, idx, idx + 1);
          this.setAllFilters();
        }
      }
    }
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
    this.setAllFilters();
  }

  setAllFilters() {
    let values = JSON.parse(JSON.stringify(this.source.value)) as object[];
    if (this.allFilter && this.allFilter.length > 0) {
      let vals = [];
      let count = 0;
      this.allFilter.filter(x => x.filter && x.filter.length > 0).forEach(filt => {
        const type: FilterType = filt.getType();
        if (type == FilterType.Filter) {
          values = values.filter(x => filt.define == FilterDefine.Equal ? x[filt.caption] == filt.filter : x[filt.caption] != filt.filter);
        } else if (type == FilterType.Aggregation) {
          let result = [];
          values.reduce((res, value) => {
            const date: Date = parseDate(value[filt.caption]);
            let keyString = value[filt.caption];
            if (date && date.getMonth) {
              date.setHours(12, 0, 0, 0);
              keyString = date.toISOString();
              if (!res[keyString]) {
                count++;
                res[keyString] = {
                  Id: keyString,
                  qty: 0
                };
                result.push(res[keyString])
              }
            } else {
              if (!res[keyString]) {
                count++;
                res[keyString] = {
                  Id: keyString,
                  qty: 0
                };
                result.push(res[keyString])
              }
            }
            if (value[filt.filter]) {
              const val = Number.parseFloat(value[filt.filter]);
              res[keyString].qty += val ? val : 0;
            }
            return res;
          }, {});
          if (filt.define == FilterDefine.Average) {
            result.forEach(res => {
              res.qty = res.qty / (values.length / count);
            });
          }
          values = result;
        } else if (type == FilterType.Calculation) {

          values.forEach(val => {
            switch (filt.define) {
              case FilterDefine.Plus:
                val[filt.caption + "+" + filt.filter] = Number.parseFloat(val[filt.caption]) + Number.parseFloat(val[filt.filter]);
              break;
              case FilterDefine.Minus:
                val[filt.caption + "-" + filt.filter] = Number.parseFloat(val[filt.caption]) - Number.parseFloat(val[filt.filter]);
              break;
              case FilterDefine.Times:
                val[filt.caption + "*" + filt.filter] = Number.parseFloat(val[filt.caption]) * Number.parseFloat(val[filt.filter]);
              break;
              case FilterDefine.Divided:
                val[filt.caption + "/" + filt.filter] = Number.parseFloat(val[filt.caption]) / Number.parseFloat(val[filt.filter]);
              break;
            }
          });
        }
      });
    }
    this.filteredSource = {
      source: this.source.source,
      value: values
    };
    this.setCaptions();
    this.emitSource();
  }


  emitSource() {
    if (this.selectedValue && this.selectedCaption) {
      let newSources: ChartData = { name: this.selectedCaption + "_" + this.selectedValue, points: []};      
      let rows = JSON.parse(JSON.stringify(this.filteredSource.value));
      for (let i = 0; i < rows.length; i++) {
        newSources.points.push({
          caption: rows[i][this.selectedCaption],
          value: rows[i][this.selectedValue],
          selected: true
        });
      }
      newSources.points.sort((a, b) => {
        if (a.caption > b.caption) {
          return 1;
        } else if (a.caption < b.caption) {
          return -1;
        } else {
          return 0;
        }
      });
      var captions = $.unique(newSources.points.map(function(value){return value.caption}));
      var summedValues: DataPointFilter[] = [];
      captions.forEach(cap => {
        var total = newSources.points.filter(x => x.caption == cap).reduce((sum, current) => sum + current.value, 0);
        summedValues.push({caption: cap, value: total, selected: true});
      });
      newSources.points = summedValues;      
      this.newSource.emit(newSources);
    }
  }

  trackByFn(index, filter) {
    return filter.filterId;
  }
}
