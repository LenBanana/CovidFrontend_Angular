import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataServiceService } from '../services/data-service.service';
import { AddedSource } from '../Interfaces/CovidData';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-source-add-modal',
  templateUrl: './source-add-modal.component.html',
  styleUrls: ['./source-add-modal.component.scss']
})
export class SourceAddModalComponent implements OnInit {

  constructor(public dataservice: DataServiceService) { }
  @Input() iso_code;
  @Input() location;
  @Output() successful = new EventEmitter();
  newSource: AddedSource;
  url: string;
  loading: boolean;
  error = false;
  success = false;
  fileSelected: File

  ngOnInit(): void {

  }

  onChangeUrl(newUrl) {
    this.url = newUrl;
  }

  sendSource() {
    this.loading = true;
    if (this.fileSelected) {
      this.dataservice.uploadFile(this.fileSelected)
    .subscribe((response) => {
      this.success = true;
      this.successful.emit(response);
      this.loading = false;
     }, (error) => {
      console.log(error);
        this.error = true;
        this.loading = false;
      });
      return;
    }
    this.dataservice.GetCSVModel(this.url).subscribe(result => {
      this.newSource = result;
      this.loading = false;
    }, error => {
      this.error = true;
      this.loading = false;
    });
  }

  saveSource() {
    this.loading = true;
    this.dataservice.SaveCSVModel(this.url, this.iso_code, this.location).subscribe(() => {
      this.success = true;
      this.successful.emit();
      this.loading = false;
    }, error => {
      this.error = true;
      this.loading = false;
    });
  }

  public fileEvent($event) {
    this.fileSelected = $event.target.files[0];    
 }
}
