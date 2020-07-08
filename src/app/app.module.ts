import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { GeneralInfoComponent } from './general-info/general-info.component';
import { HttpClientModule } from '@angular/common/http';
import { BasicPlotComponent } from './basic-plot/basic-plot.component';
import { AddedSourceComponent } from './added-source/added-source.component';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import { SourceAddModalComponent } from './source-add-modal/source-add-modal.component';
import { FilterFieldComponent } from './filter-field/filter-field.component';
 
PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    GeneralInfoComponent,
    BasicPlotComponent,
    AddedSourceComponent,
    DynamicTableComponent,
    SourceAddModalComponent,
    FilterFieldComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    PlotlyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
