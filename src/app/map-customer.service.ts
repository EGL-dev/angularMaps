import { Injectable, EventEmitter  } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapCustomerService {
  cbAdress: EventEmitter<any> = new EventEmitter<any>();
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
          console.log('*********', result)
          this.cbAdress.emit(result);
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
    console.log(coords);
    const url = [
      `https://api.mapbox.com/directions/v5/mapbox/driving/`,
      `${coords[0][0]},${coords[0][1]};${coords[1][0]},${coords[1][1]}`,
      `?steps=true&geometries=geojson&access_token=${environment.mapPk}`,
    ].join('')

  }
 
}
