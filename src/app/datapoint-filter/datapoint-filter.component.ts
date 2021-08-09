import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  IterableDiffer,
  IterableDiffers,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import {
  DataPoint,
  DataPointFilter
} from '../Interfaces/CovidData';
import {
  ChartData
} from '../Interfaces/General';
declare var $: any;

@Component({
  selector: 'app-datapoint-filter',
  templateUrl: './datapoint-filter.component.html',
  styleUrls: ['./datapoint-filter.component.scss']
})
export class DatapointFilterComponent implements OnInit, DoCheck {

  @Input() chartData: ChartData[];
  @Output() filterData = new EventEmitter();
  page = 1;
  pageSize = 10;
  selection = "";
  selectedData: DataPointFilter[] = [];
  filteredData: DataPointFilter[] = [];
  iterableDiffer: IterableDiffer < ChartData > ;
  tableSort = [true, true, true];

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
      if (this.chartData && this.chartData.length > 0) {
        this.selection = this.chartData[0].name;
        this.chartData.length > 0 ? this.selectedData = this.chartData[0].points : this.selectedData = [];
        this.filteredData = this.selectedData;
      }
    }
  }

  collectionChange(chartName) {
    var idx = this.chartData.findIndex(x => x.name == chartName.target.value);
    if (idx > -1) {
      this.selection = chartName.target.value;
      this.selectedData = this.chartData[idx].points;
      this.filteredData = this.selectedData;
      $('#CaptionFilter').val('');
    }
  }

  selectAll(select: boolean, onlyFiltered: boolean) {
    if (onlyFiltered) {
      if (select) {
        this.filteredData.forEach(x => x.selected = true);
      } else {
        this.filteredData.forEach(x => x.selected = false);
      }
      this.filteredData.forEach(x => this.selectedData.find(y => y.caption == x.caption).selected = x.selected);
    } else {
      if (select) {
        this.selectedData.forEach(x => x.selected = true);
        this.filteredData.forEach(x => x.selected = true);
      } else {
        this.selectedData.forEach(x => x.selected = false);
        this.filteredData.forEach(x => x.selected = false);
      }
    }
    this.confirmFilter();
  }

  filterChange(filter) {
    var lowerFilter: string = filter.target.value.toLocaleLowerCase();
    if (lowerFilter.length > 0) {
      this.filteredData = this.selectedData.filter(x => x.caption.toLocaleLowerCase().includes(lowerFilter) || x.value.toString().toLocaleLowerCase().includes(lowerFilter));
    } else {
      this.filteredData = this.selectedData;
    }
  }

  filterFrom(fromCaption) {
    var idx = this.filteredData.findIndex(x => x.caption == fromCaption.target.value);
    if (idx > -1) {
      this.filteredData = this.filteredData.slice(idx)
    }
  }

  filterTo(toCaption) {
    var idx = this.filteredData.findIndex(x => x.caption == toCaption.target.value);
    if (idx > -1) {
      this.filteredData = this.filteredData.slice(0, idx);
    }
  }

  resetFilter() {
    this.filteredData = this.selectedData;
    $('#CaptionFilter').val('');
  }

  confirmFilter() {
    this.filterData.emit();
  }

  sortFunction(colName, sortIdx) {
    if (this.tableSort[sortIdx] == true) {
      this.filteredData.sort((a, b) => a[colName] < b[colName] ? 1 : a[colName] > b[colName] ? -1 : 0);
    } else {
      this.filteredData.sort((a, b) => a[colName] > b[colName] ? 1 : a[colName] < b[colName] ? -1 : 0);
    }
    this.tableSort[sortIdx] = !this.tableSort[sortIdx];
  }

  sortedByCap(array) {
    return Array.prototype.slice.call(array).sort((a, b) => a.caption > b.caption ? 1 : a.caption < b.caption ? -1 : 0);
  }

}
