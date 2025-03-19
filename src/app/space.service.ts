import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Space } from './Space';


@Injectable({
  providedIn: 'root'
})
export class SpaceService {

  private apiUrl = 'http://localhost:8081/api/spaces';
  
   constructor(private http: HttpClient) {}

  // get spaces
  getSpaces(): Observable<Space[]> {
     return this.http.get<Space[]>(this.apiUrl);
  }
}
