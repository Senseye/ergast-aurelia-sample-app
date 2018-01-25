import {ErgastService} from 'services/ergast-service';
import {inject} from 'aurelia-dependency-injection';

@inject(ErgastService)
export class Seasons {
  ready = false;

  constructor(ergastService) {
    this.ergastService = ergastService;
  }

  activate() {
    this.ergastService.getSeasons().then(response => response.json())
      .then(data => {
        this.seasonsData = data.MRData.SeasonTable.Seasons;
        this.ready = true;
      });
  }
}
