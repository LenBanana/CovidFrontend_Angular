import { DataPoint, DataPointFilter } from "./CovidData";

export class Filter {
  filterId: string;
  caption: string;
  filter: string;
  define: FilterDefine;
  getType(): FilterType {
    switch (this.define) {
      case FilterDefine.Equal:
        return FilterType.Filter;
      case FilterDefine.Unequal:
        return FilterType.Filter;
      case FilterDefine.Sum:
        return FilterType.Aggregation;
      case FilterDefine.Average:
        return FilterType.Aggregation;
      case FilterDefine.Plus:
        return FilterType.Calculation;
      case FilterDefine.Minus:
        return FilterType.Calculation;
      case FilterDefine.Times:
        return FilterType.Calculation;
      case FilterDefine.Divided:
        return FilterType.Calculation;
    }
  }
}

export interface ChartData {
  name: string,
  points: DataPointFilter[]
}

export enum FilterType {
  Filter,
  Aggregation,
  Calculation
}

export enum FilterDefine {
  Equal,
  Unequal,
  Sum,
  Average,
  Plus,
  Minus,
  Times,
  Divided
}
