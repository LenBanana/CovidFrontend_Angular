export interface AddedSource {
  source: string;
  value: object;
}

export interface Config {
  iso_code: string;
  location: string;
  continent: string;
  datasource: string;
  addedSources: AddedSource[];
}

export interface Info {
  cases: number;
  deaths: number;
  casesPerMillion: number;
  deathsPerMillion: number;
  tests: number;
  testsPerThousand: number;
  population: number;
  populationDensity: number;
  medianAge: number;
  agedOver65: number;
  agedOver70: number;
  gdpPerCapita: number;
  poverty: number;
  deathrate: number;
  diabetesPrevalence: number;
  femaleSmokers: number;
  maleSmokers: number;
  handwashingFacilities: number;
  hospitalBedsPerThousand: number;
  lifeExpectancy: number;
}

export interface DataPoint {
  caption: string;
  value: number;
}

export interface DataPointFilter extends DataPoint {
  selected: boolean;
}

export interface CovidData {
  config: Config;
  info: Info;
  dataPoints: DataPointFilter[];
}
