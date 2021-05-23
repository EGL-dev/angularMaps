import { Injectable, EventEmitter } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class MapCustomerService {
  cbAdress: EventEmitter<any> = new EventEmitter<any>();
  mapbox = mapboxgl as typeof mapboxgl;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = -29.144242648922337;
  long = -59.64377875521803;
  zoom = 3;
  wayPoints: Array<any> = [];
  markerdriver: any = null;


  constructor(private httpClient: HttpClient , private socket:Socket) {
    this.mapbox.accessToken = environment.mapPk;
  }

  buildMap(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.map = new mapboxgl.Map({
          container: 'map',
          style: this.style,
          zoom: this.zoom,
          center: [this.lat, this.long],
        });

        const geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl,
        });

        geocoder.on('result', ($event) => {
          const { result } = $event;
          geocoder.clear();
          console.log('*********', result);
          this.cbAdress.emit(result);
        });

        resolve({
          map: this.map,
          geocoder,
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  loadCoords(coords): void {
    console.log(coords);
    const url = [
      `https://api.mapbox.com/directions/v5/mapbox/driving/`,
      `${coords[0][0]},${coords[0][1]};${coords[1][0]},${coords[1][1]}`,
      `?steps=true&geometries=geojson&access_token=${environment.mapPk}`,
    ].join('');

    this.httpClient.get(url).subscribe((rest: any) => {
      const data = rest.routes[0];
      const route = data.geometry.coordinates;

      this.map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        }
      });


      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': 'red',
          'line-width': 5
        }
      });

      this.wayPoints = route;
      this.map.fitBounds([route[0], route[route.length - 1]], {
        padding:100
      })

      this.socket.emit('find-driver', { points: route });


    })
  }

  addMarkerCustom(coords): void {
    const el = document.createElement('div');
    el.className = 'marker';
    if (!this.markerdriver) {
      this.markerdriver = new mapboxgl.Marker(el);
    } else {
      this.markerdriver
        .setLngLat(coords)
        .addTo(this.map);
    }
  }
}
