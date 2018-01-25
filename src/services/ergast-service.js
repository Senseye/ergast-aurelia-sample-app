import {AbstractService} from 'services/abstract-service';
import {buildQueryString} from 'aurelia-path';

const BASE_URL = 'http://ergast.com/api/f1/';

export class ErgastService extends AbstractService {

  constructor() {
    super(BASE_URL);
  }

  /* The offset and limit are intentionally hardcoded.
    I assumed the 2005-2015 period is required for reducing the complexity of the app.*/
  getSeasons() {
    return this.fetch(`seasons.json?${buildQueryString({
      offset: 55,
      limit: 11
    })}`);
  }

  getSeasonResults(seasonYear) {
    return this.fetch(`${seasonYear}/results/1.json`);
  }

  getDriverStandings(seasonYear) {
    return this.fetch(`${seasonYear}/driverStandings.json`);
  }
}
