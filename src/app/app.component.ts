import { Inject, Input, Component, OnInit} from '@angular/core';
import { Space } from './Space';
import { SpaceService } from './space.service';
import { forkJoin } from 'rxjs';

import * as L from 'leaflet';
import 'leaflet-routing-machine';


 
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
  @Input() lat2: number = DEFAULT_LAT;
  @Input() lon2: number = DEFAULT_LON;
  @Input() lat3: number = DEFAULT_LAT;
  @Input() lon3: number = DEFAULT_LON;
  @Input() titulo: string = TITULO ;
  @Input() titulo2: string = TITULO ;
  
  

  constructor(private spaceService: SpaceService) {}

  ngOnInit(): void {
    
     this.spaceService.getSpaces().subscribe({
       next: (response: Space[]) => {
         this.spaces = [...response];
         console.debug('GetSpaces was successful', this.spaces);
          this.lat = this.spaces[6].latitude!;
          this.lon = this.spaces[6].longitude!;
          this.lat2 = this.spaces[5].latitude!;
          this.lon2 = this.spaces[5].longitude!;
          this.titulo = 'space7 - Madrid'; 
          this.titulo2 = 'space6 - Viena';
          this.initMap();
       },
       error: (err) => {
         console.warn('Error at GetSpaces', err);
       }
    });

 
  }
  
  
  private initMap(): void {
      // ---- MAP INICIALIZATION ---- 
     this.map = L.map('map', {
        center: [this.lat, this.lon],
        zoom: 10
      }); 
 
      // ---- ICON PERSONALIZATION ---- 
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
 
      // ---- MAP LAYER CREATION ---- 
      
     const tiles_1 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' //COPYRIGHT!!
        //attribution: '© OpenStreetMap' 
      });  

      /* ONLY IN ENGLISH - CARTOO STYLE 1 light_all / dark_all */
       const tiles_2 = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{zoom}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }
      ); 
     


     /* ONLY IN ENGLISH - CARTOO STYLE 2 voyager */ 
       const tiles_3 = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }
      );

     
     
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
      
      // mapa por defecto 
      tiles_1.addTo(this.map);
      

      // ---- MULTI-LAYERS IN MAP ----
      L.control.layers(
        {
          "OSM": tiles_1,
          "CARTOO_LIGHT": tiles_2,
          "CARTOO_VOYAGER": tiles_3
        }
      ).addTo(this.map);
      

      // ---- MARKER WITH POP UP ---- we use marker[coordinates]

        // ONE MARKER
      //const marker = L.marker([this.lat, this.lon]).bindPopup(`${this.titulo}: (Lat: ${this.lat}, Lng: ${this.lon})`);
      //marker.addTo(this.map); 
      

      // MULTIPLE MARKERS
      /* METHOD 1
      const coordinates = [ // Define multiple markers location, latitude, and longitude
        { lat: this.lat, lon: this.lon, name: `${this.titulo}: (Lat: ${this.lat}, Lng: ${this.lon})`},
        { lat: this.lat2, lon: this.lon2, name: `${this.titulo2}: (Lat: ${this.lat2}, Lng: ${this.lon2})`},
      ];

      coordinates.forEach( coordinates => {
         L.marker([coordinates.lat, coordinates.lon])
          .bindPopup(`${coordinates.name}`)
          .addTo(this.map);
      });
      */
      
       // METHOD 2 
       var loc1 = L.marker([this.lat, this.lon]).bindPopup(`${this.titulo}: (Lat: ${this.lat}, Lng: ${this.lon})`),
           loc2 = L.marker([this.lat2, this.lon2]).bindPopup(`${this.titulo2}: (Lat: ${this.lat2}, Lng: ${this.lon2})`);

       var locations = L.featureGroup([loc1, loc2]); //function .addLayer to add new loc
       locations.addTo(this.map);
       this.map.fitBounds(locations.getBounds());
      
      // ---- COORDINATES FOR EVERY POINT WHEN CLICKED ---- we get (latitude, longitude) | MARKER STYLE CAN BE CHANGED
      /* // METHOD 1. Version with popup
      this.map.on('click', (e: L.LeafletMouseEvent) => {
       L.popup()//oppened object at clicking
        .setLatLng(e.latlng) //gets coordinates and fixes them at their ubication [setWhereCoord(getCoord.)]
        .setContent("You clicked the map at " + e.latlng.toString()) //text
        .openOn(this.map); //opens and closes popup when another one is oppened
      }); //calls the function whenever the map is clicked on
      */
      

         // METHOD 2. Version with markers

      let clickedPoint: L.Marker | null = null; 
      this.map.on('click', (e: L.LeafletMouseEvent) => {
       const {lat, lng} = e.latlng;
       if(clickedPoint){ // if it exists => update 
         clickedPoint.setLatLng([lat, lng])
         .bindPopup(`Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`);
       }else{ // if doesn't exist it is created
         clickedPoint = L.marker([lat, lng])
        .bindPopup(`Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`) 
        .addTo(this.map); 
       }
        
       clickedPoint.openPopup();
      }); 


    }

      
}
