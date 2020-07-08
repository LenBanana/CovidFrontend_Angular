import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../services/data-service.service';
import { AddedSource } from '../Interfaces/CovidData';

@Component({
  selector: 'app-source-add-modal',
  templateUrl: './source-add-modal.component.html',
  styleUrls: ['./source-add-modal.component.scss']
})
export class SourceAddModalComponent implements OnInit {

  constructor(public dataservice: DataServiceService) { }
  newSource: AddedSource;
  url: string;
  loading: boolean;

  ngOnInit(): void {

  }

  onChangeUrl(newUrl) {
    this.url = newUrl;
  }

  sendSource() {
    this.loading = true;
    this.dataservice.GetCSVModel(this.url).subscribe(result => {
      this.newSource = result;
      this.loading = false;
    }, error => {
      console.log(error);
      this.loading = false;
    });
  }
}
