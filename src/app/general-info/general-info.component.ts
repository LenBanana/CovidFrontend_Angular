import { Component, OnInit, Input } from '@angular/core';
import { CovidData } from '../Interfaces/CovidData';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {
  @Input() data: CovidData;
  constructor() { }

  ngOnInit(): void {
    
  }

}
