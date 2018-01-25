import {inject} from 'aurelia-dependency-injection';
import {ErgastService} from 'services/ergast-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DRIVER_TEMPLATES} from 'resources/elements/driver/driver-templates';

const EA_SEASON_WINNER_LOADED = 'seasonRaces:seasonWinnerLoaded';
const EA_SEASON_RESULTS_LOADED = 'seasonRaces:seasonResultsLoaded';

@inject(ErgastService, EventAggregator)
export class SeasonRaces {
  /* this property is used in the view, to indicate that data is loading.
  * It is set to `true` when all data is fetched from the web service. */
  ready = false;

  constructor(ergastService, eventAggregator) {
    this.ergastService = ergastService;
    this.eventAggregator = eventAggregator;
    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.winnerLoadedSubs = this.eventAggregator.subscribe(EA_SEASON_WINNER_LOADED, () => {
      this.loadRaces();
    });

    this.seasonResultsSubs = this.eventAggregator.subscribe(EA_SEASON_RESULTS_LOADED, () => {
      this.ready = true;
    });
  }

  activate(params) {
    this.seasonYear = params.year;
    this.loadStandings();
  }

  loadStandings() {
    this.ergastService.getDriverStandings(this.seasonYear).then(response => response.json()).then(data => {
      this.setSeasonWinner(data);
      this.eventAggregator.publish(EA_SEASON_WINNER_LOADED);
    });
  }

  setSeasonWinner(data) {
    this.seasonResult = data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];
    this.seasonResult.Driver.template = DRIVER_TEMPLATES.seasonWinnerDetailed;
  }

  loadRaces() {
    this.ergastService.getSeasonResults(this.seasonYear).then(response => response.json())
      .then(data => {
        this.setRacesData(data);
        this.eventAggregator.publish(EA_SEASON_RESULTS_LOADED);
      });
  }

  /*
  * Iterating through Races and setting the proper template for a Driver.
  * The idea behind is to remove any if-else logic from the view (when highlighting the season winner),
  * and have it here in the ViewModel.
  * */
  setRacesData(data) {
    this.races = data.MRData.RaceTable.Races.map((race) => {
      let raceDriver = race.Results[0].Driver;
      raceDriver.template = this.getDriverTemplate(raceDriver);
      return race;
    });
  }

  getDriverTemplate(driver) {
    return driver.driverId === this.seasonResult.Driver.driverId
      ? DRIVER_TEMPLATES.seasonWinner
      : DRIVER_TEMPLATES.raceWinner;
  }

  deactivate() {
    this.winnerLoadedSubs.dispose();
    this.seasonResultsSubs.dispose();
  }
}
