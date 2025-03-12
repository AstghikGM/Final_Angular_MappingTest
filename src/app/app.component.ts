import { Component, OnInit} from '@angular/core';
import { Space } from './Space';
import { SpaceService } from './space.service';
import { forkJoin } from 'rxjs';

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

  constructor(private spaceService: SpaceService) {}

  ngOnInit(): void {
    this.spaceService.getSpaces().subscribe({
       next: (response: Space[]) => {
         this.spaces = [...response];
         console.debug('GetSpaces was successful', this.spaces);
            if(this.spaces.length >= 4) {
             this.space1 = this.spaces[0].id;
             this.space2 = this.spaces[1].id;
             this.space3 = this.spaces[2].id;
             this.space4 = this.spaces[3].id;
            }else{
              console.warn('NOT ENOUGH SPACES');
            }
       },
       error: (err) => {
         console.warn('Error at GetSpaces', err);
       }
    });
 
  }


        




}
