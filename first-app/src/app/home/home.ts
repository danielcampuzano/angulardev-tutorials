import { Component, inject } from '@angular/core';
import { HousingLocation  } from '../housing-location/housing-location';
import { HousingService } from '../housing-service';
import { HousingLocationInfo } from '../housinglocation';


@Component({
  imports: [HousingLocation],
  selector: 'app-home',
  styleUrls: ['./home.css'],
  template: `
    <section>
      <form>
        <input type="text" placeholder="Filter by city" #filter />
        <button class="primary" type="button" (click)="filterResults(filter.value)">Search</button>
      </form>
    </section>
    <section class="results">
      @for (housingLocation of filteredLocationList; track $index) {
        <app-housing-location [housingLocation]="housingLocation" />
      }
    </section>
  `,
})
export class Home {
  housingLocationList: HousingLocationInfo[] = [];
  housingService: HousingService = inject(HousingService);

  filteredLocationList: HousingLocationInfo[] = [];

  constructor() {
    this.housingLocationList = this.housingService.getAllHousingLocations();
    this.filteredLocationList = this.housingLocationList;
  }

  filterResults(text: string) {
    if (!text) {
      this.filteredLocationList = this.housingLocationList;
      return;
    }

    this.filteredLocationList = this.housingLocationList.filter((housingLocation) =>
      housingLocation?.city.toLowerCase().includes(text.toLowerCase()),
    );
  }

}