import {SeasonRaces} from '../../src/season-races/season-races';
import {ErgastServiceStub} from './stub/ergast-service-stub.js';
import {EventAggregatorStub} from './stub/event-aggregator-stub.js';
import {DRIVER_TEMPLATES} from 'resources/elements/driver/driver-templates';

describe('the app', () => {
  let seasonRaces;

  beforeEach(() => {
    seasonRaces = new SeasonRaces(
      new ErgastServiceStub(),
      new EventAggregatorStub()
    );
  });

  it('upon view model activation, it should set season year and load standings', () => {
    spyOn(seasonRaces, 'loadStandings');
    const expectedYear = 2010;
    const activationParams = {
      year: 2010
    };

    seasonRaces.activate(activationParams);

    expect(seasonRaces.seasonYear).toEqual(expectedYear);
    expect(seasonRaces.loadStandings).toHaveBeenCalled();
  });

  it('should return race winner and season winner template', () => {
    seasonRaces.seasonResult = { Driver: {driverId: 'sergiuoala'} };
    const raceWinnerKimi = { driverId: 'kimi' };
    const seasonWinnerSergiu = { driverId: 'sergiuoala' };

    const kimiExpectedTemplate = DRIVER_TEMPLATES.raceWinner;

    const kimiActualTemplate = seasonRaces.getDriverTemplate(raceWinnerKimi);
    const sergiuActualTemplate = seasonRaces.getDriverTemplate(seasonWinnerSergiu);

    expect(kimiActualTemplate).toEqual(kimiExpectedTemplate);
    expect(sergiuActualTemplate).toEqual(sergiuActualTemplate);
  });

  afterEach(() => {
    seasonRaces = null;
  });
});
