import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MapCustomerService } from './map-customer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('asGeoCoder') asgeoCoder: ElementRef;
  modeInput = 'start';
  wayPoints: WayPoints = { start: null, end: null };

  constructor(
    private MapCustomerService: MapCustomerService,
    private renderer2: Renderer2
  ) {}

  ngOnInit(): void {
    this.MapCustomerService.buildMap()
      .then(({ geocoder, map }) => {
        this.renderer2.appendChild(
          this.asgeoCoder.nativeElement,
          geocoder.onAdd(map)
        );

        console.log('*****TODO BIEN*****');
      })
      .catch((err) => {
        console.log('*****ERRROR*******', err);
      });

    this.MapCustomerService.cbAdress.subscribe((getPoint) => {
      if (this.modeInput === 'start') {
        this.wayPoints.start = getPoint;
      }
      if (this.modeInput === 'end') {
        this.wayPoints.end = getPoint;
      }
    });
  }

  drawerRoute(): void {
    console.log(this.wayPoints);
    const coords = [this.wayPoints.start.center, this.wayPoints.end.center];

    this.MapCustomerService.loadCoords(coords);
  }

  changeMode(mode: string): void {
    this.modeInput = mode;
  }
}
export class WayPoints {
  start: any;
  end: any;
}
