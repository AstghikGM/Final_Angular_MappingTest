import { Inject, Input, Component, OnInit} from '@angular/core';
import { Space } from './Space';
import { SpaceService } from './space.service';
import { forkJoin } from 'rxjs';

import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { icon, Marker } from 'leaflet';


 
export const DEFAULT_LAT = 0.0; //48.20807
export const DEFAULT_LON =  0.0; //16.37320
export const TITULO = 'Default';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'MappingTestAngular';

  spaces: Space[] = [];
  space1?: number;
  space2?: number;
  space3?: number;
  space4?: number;
  
  private map:any;
  @Input() lat: number = DEFAULT_LAT;
  @Input() lon: number = DEFAULT_LON;
  @Input() titulo: string = TITULO ;
  
  

  constructor(private spaceService: SpaceService) {}

  ngOnInit(): void {
    
     this.spaceService.getSpaces().subscribe({
       next: (response: Space[]) => {
         this.spaces = [...response];
         console.debug('GetSpaces was successful', this.spaces);
          this.lat = this.spaces[6].longitude!;
          this.lon = this.spaces[6].latitude!;
          this.titulo = 'space7 - Madrid'; 
          this.initMap();

           /*if(this.spaces.length >= 4) {
             this.space1 = this.spaces[0].id;
             this.space2 = this.spaces[1].id;
             this.space3 = this.spaces[2].id;
             this.space4 = this.spaces[3].id;
             
            }else{
              console.warn('NOT ENOUGH SPACES');
            }*/

       },
       error: (err) => {
         console.warn('Error at GetSpaces', err);
       }
    });

 
  }
  
  
  private initMap(): void {
      // MAP CONFIGURATION
      this.map = L.map('map', {
        center: [this.lat, this.lon],
        zoom: 10
      });
 
      // ICON PERSONALIZATION
      var iconDefault = L.icon({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });
      L.Marker.prototype.options.icon = iconDefault;
 
      //MAP LAYER CREATION
      
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }); 

      /* ONLY IN ENGLISH - CARTOO STYLE 1 light_all / dark_all
       const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }
      );*/
     


     /* ONLY IN ENGLISH - CARTOO STYLE 2 voyager
       const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }
      );*/

     
     
     /* SATELIT VIEW - maptyler- LIMITED
     const key = 'syxzJg5tOeW43CmhslJZ';
     const tiles = L.tileLayer(`https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${key}`,{ //style URL
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
        crossOrigin: true
      });
     */
     
      tiles.addTo(this.map);

      // MARKER WITH POP UP => marker[coordinates]
      const marker = L.marker([this.lat, this.lon]).bindPopup(this.titulo);
      marker.addTo(this.map);
 
      // MARKER WITH CIRCLE
      //const mark = L.circleMarker([this.lat, this.lon]).addTo(this.map);
      //mark.addTo(this.map);
      

    }
      
}
