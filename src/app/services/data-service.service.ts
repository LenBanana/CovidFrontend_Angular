import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CovidData, Config, AddedSource } from '../Interfaces/CovidData';

export var baseUrl: string = 'https://cov.dreckbu.de/';
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor(private http: HttpClient) { }

  public GetCases(iso_code: string) {
    return this.http.get<CovidData>(baseUrl + 'CovidDataPoints/Cases/?iso_code=' + iso_code);
  }

  public GetDeaths(iso_code: string) {
    return this.http.get<CovidData>(baseUrl + 'CovidDataPoints/Deaths/?iso_code=' + iso_code);
  }

  public GetNewCases(iso_code: string) {
    return this.http.get<CovidData>(baseUrl + 'CovidDataPoints/NewCases/?iso_code=' + iso_code);
  }

  public GetNewDeaths(iso_code: string) {
    return this.http.get<CovidData>(baseUrl + 'CovidDataPoints/NewDeaths/?iso_code=' + iso_code);
  }

  public GetNewTests(iso_code: string) {
    return this.http.get<CovidData>(baseUrl + 'CovidDataPoints/NewTests/?iso_code=' + iso_code);
  }

  public GetWorldPercentages() {
    return this.http.get<CovidData>(baseUrl + 'CovidDataPoints/CasePercentagePerCountry/');
  }

  public GetConfigs() {
    return this.http.get<Config[]>(baseUrl + 'CovidDataPoints/GetCountryConfigs/');
  }

  public GetConfig(iso_code: string, location: string) {
    return this.http.get<Config>(baseUrl + 'CovidDataPoints/GetCountryConfig/?iso_code=' + iso_code + '&location=' + location);
  }

  public GetCSVModel(url: string) {
    return this.http.get<AddedSource>(baseUrl + 'CovidDataPoints/GetCSVModel/?url=' + url);
  }

  public SaveCSVModel(url: string, iso_code: string, location: string) {
    return this.http.post(baseUrl + 'CovidDataPoints/SaveCSV/?url=' + url + '&iso_code=' + iso_code + '&location=' + location, "");
  }

  public uploadFile(fileToUpload: File) {
    const _formData = new FormData();
    _formData.append('file', fileToUpload, fileToUpload.name);   
    return this.http.post(baseUrl + 'CovidDataPoints/PostCSVFile/', _formData);
  }
}
