import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MapCustomerService } from './map-customer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  @ViewChild('asgeoCoder') asgeoCoder: ElementRef;

  constructor(private MapCustomerService : MapCustomerService , private renderer2:Renderer2) {

  }
  
  ngOnInit(): void {

    this.MapCustomerService.buildMap()
      .then(({geocoder, map}) => {
        
      this.renderer2.appendChild(this.asgeoCoder.nativeElement,
        geocoder.onAdd(map)
      )


        console.log("*****TODO BIEN*****")
      })
      .catch((err) => {
        console.log("*****ERRROR*******", err)
      })
    
  }
}

