import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from 'src/environments/environment';




@Injectable({
  providedIn: 'root'
})
export class MapCustomerService {
  mapbox = (mapboxgl as typeof mapboxgl)
  map: mapboxgl.Map;
  style = "mapbox://styles/mapbox/streets-v11";
  lat = -29.144242648922337;
  long = -59.64377875521803;
  zoom = 3;

  constructor() {
    this.mapbox.accessToken = environment.mapPk;
  }

  buildMap(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.map = new mapboxgl.Map({
          container: 'map',
          style: this.style,
          zoom: this.zoom,
          center: [this.lat, this.long]
        });
  
        const geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl,

        })


        geocoder.on('result', ($event) => {
          const {result}=$event
          geocoder.clear();

        })


        resolve({
          map: this.map,
          geocoder
        });

      } catch (e) {
        reject(e)
        
      }

    })



     
 
  
  }

  loadCoords(coords): void{
    
  }
    
  
}
