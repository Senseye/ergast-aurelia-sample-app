define('app',['exports', 'aurelia-dependency-injection', 'aurelia-router', 'routes/app-routes', 'configs/app-fetch-config'], function (exports, _aureliaDependencyInjection, _aureliaRouter, _appRoutes, _appFetchConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaRouter.Router, _appFetchConfig.AppFetchConfig), _dec(_class = function () {
    function App(router, appFetchConfig) {
      _classCallCheck(this, App);

      this.router = router;
      this.appFetchConfig = appFetchConfig;
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Mobiquity Assignment';
      config.map(_appRoutes.appRoutes);
      this.router = router;
    };

    App.prototype.activate = function activate() {
      this.appFetchConfig.configure();
    };

    return App;
  }()) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    longStackTraces: _environment2.default.debug,
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().globalResources('resources/elements/loading-spinner.html').feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('configs/app-fetch-config',['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client', 'aurelia-event-aggregator'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AppFetchConfig = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AppFetchConfig = exports.AppFetchConfig = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function AppFetchConfig(httpClient, eventAggregator) {
      _classCallCheck(this, AppFetchConfig);

      this.httpClient = httpClient;
      this.eventAggregator = eventAggregator;
    }

    AppFetchConfig.prototype.configure = function configure() {
      this.httpClient.configure(function (httpConfig) {
        httpConfig.withInterceptor({
          requestError: function requestError(_requestError) {
            alert("Fetch client: request error.");
            return _requestError;
          },
          responseError: function responseError(_responseError) {
            alert("Fetch client: response error.");
            return _responseError;
          }
        });
      });
    };

    return AppFetchConfig;
  }()) || _class);
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('routes/app-routes',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var appRoutes = exports.appRoutes = [{ route: '', redirect: 'seasons' }, {
    route: 'seasons',
    name: 'seasons',
    moduleId: 'seasons/seasons',
    title: 'Formula 1 Seasons',
    navbar: {}
  }, {
    route: 'season/:year',
    activationStrategy: 'replace',
    name: 'season-races',
    moduleId: 'season-races/season-races',
    title: 'Race winners',
    navbar: {
      back: {
        route: 'seasons',
        title: 'Seasons'
      }
    }
  }];
});
define('season-races/season-races',['exports', 'aurelia-dependency-injection', 'services/ergast-service', 'aurelia-event-aggregator', 'resources/elements/driver/driver-templates'], function (exports, _aureliaDependencyInjection, _ergastService, _aureliaEventAggregator, _driverTemplates) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SeasonRaces = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var EA_SEASON_WINNER_LOADED = 'seasonRaces:seasonWinnerLoaded';
  var EA_SEASON_RESULTS_LOADED = 'seasonRaces:seasonResultsLoaded';

  var SeasonRaces = exports.SeasonRaces = (_dec = (0, _aureliaDependencyInjection.inject)(_ergastService.ErgastService, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function SeasonRaces(ergastService, eventAggregator) {
      _classCallCheck(this, SeasonRaces);

      this.ready = false;

      this.ergastService = ergastService;
      this.eventAggregator = eventAggregator;
      this.subscribeToEvents();
    }

    SeasonRaces.prototype.subscribeToEvents = function subscribeToEvents() {
      var _this = this;

      this.winnerLoadedSubs = this.eventAggregator.subscribe(EA_SEASON_WINNER_LOADED, function () {
        _this.loadRaces();
      });

      this.seasonResultsSubs = this.eventAggregator.subscribe(EA_SEASON_RESULTS_LOADED, function () {
        _this.ready = true;
      });
    };

    SeasonRaces.prototype.activate = function activate(params) {
      this.seasonYear = params.year;
      this.loadStandings();
    };

    SeasonRaces.prototype.loadStandings = function loadStandings() {
      var _this2 = this;

      this.ergastService.getDriverStandings(this.seasonYear).then(function (response) {
        return response.json();
      }).then(function (data) {
        _this2.setSeasonWinner(data);
        _this2.eventAggregator.publish(EA_SEASON_WINNER_LOADED);
      });
    };

    SeasonRaces.prototype.setSeasonWinner = function setSeasonWinner(data) {
      this.seasonResult = data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];
      this.seasonResult.Driver.template = _driverTemplates.DRIVER_TEMPLATES.seasonWinnerDetailed;
    };

    SeasonRaces.prototype.loadRaces = function loadRaces() {
      var _this3 = this;

      this.ergastService.getSeasonResults(this.seasonYear).then(function (response) {
        return response.json();
      }).then(function (data) {
        _this3.setRacesData(data);
        _this3.eventAggregator.publish(EA_SEASON_RESULTS_LOADED);
      });
    };

    SeasonRaces.prototype.setRacesData = function setRacesData(data) {
      var _this4 = this;

      this.races = data.MRData.RaceTable.Races.map(function (race) {
        var raceDriver = race.Results[0].Driver;
        raceDriver.template = _this4.getDriverTemplate(raceDriver);
        return race;
      });
    };

    SeasonRaces.prototype.getDriverTemplate = function getDriverTemplate(driver) {
      return driver.driverId === this.seasonResult.Driver.driverId ? _driverTemplates.DRIVER_TEMPLATES.seasonWinner : _driverTemplates.DRIVER_TEMPLATES.raceWinner;
    };

    SeasonRaces.prototype.deactivate = function deactivate() {
      this.winnerLoadedSubs.dispose();
      this.seasonResultsSubs.dispose();
    };

    return SeasonRaces;
  }()) || _class);
});
define('seasons/seasons',['exports', 'services/ergast-service', 'aurelia-dependency-injection'], function (exports, _ergastService, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Seasons = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Seasons = exports.Seasons = (_dec = (0, _aureliaDependencyInjection.inject)(_ergastService.ErgastService), _dec(_class = function () {
    function Seasons(ergastService) {
      _classCallCheck(this, Seasons);

      this.ready = false;

      this.ergastService = ergastService;
    }

    Seasons.prototype.activate = function activate() {
      var _this = this;

      this.ergastService.getSeasons().then(function (response) {
        return response.json();
      }).then(function (data) {
        _this.seasonsData = data.MRData.SeasonTable.Seasons;
        _this.ready = true;
      });
    };

    return Seasons;
  }()) || _class);
});
define('services/abstract-service',['exports', 'aurelia-framework', 'aurelia-fetch-client'], function (exports, _aureliaFramework, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AbstractService = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var AbstractService = exports.AbstractService = function () {
    function AbstractService(baseUrl) {
      _classCallCheck(this, AbstractService);

      this.httpClient = _aureliaFramework.Container.instance.get(_aureliaFetchClient.HttpClient);
      this.baseUrl = baseUrl;
    }

    AbstractService.prototype.fetch = function fetch(url) {
      return this.httpClient.fetch(this.baseUrl + url);
    };

    return AbstractService;
  }();
});
define('services/ergast-service',['exports', 'services/abstract-service', 'aurelia-path'], function (exports, _abstractService, _aureliaPath) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ErgastService = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var BASE_URL = 'http://ergast.com/api/f1/';

  var ErgastService = exports.ErgastService = function (_AbstractService) {
    _inherits(ErgastService, _AbstractService);

    function ErgastService() {
      _classCallCheck(this, ErgastService);

      return _possibleConstructorReturn(this, _AbstractService.call(this, BASE_URL));
    }

    ErgastService.prototype.getSeasons = function getSeasons() {
      return this.fetch('seasons.json?' + (0, _aureliaPath.buildQueryString)({
        offset: 55,
        limit: 11
      }));
    };

    ErgastService.prototype.getSeasonResults = function getSeasonResults(seasonYear) {
      return this.fetch(seasonYear + '/results/1.json');
    };

    ErgastService.prototype.getDriverStandings = function getDriverStandings(seasonYear) {
      return this.fetch(seasonYear + '/driverStandings.json');
    };

    return ErgastService;
  }(_abstractService.AbstractService);
});
define('resources/elements/nav-bar',['exports', 'aurelia-dependency-injection', 'aurelia-router'], function (exports, _aureliaDependencyInjection, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NavBarCustomElement = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var NavBarCustomElement = exports.NavBarCustomElement = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaRouter.Router), _dec(_class = function NavBarCustomElement(router) {
    _classCallCheck(this, NavBarCustomElement);

    this.router = router;
  }) || _class);
});
define('resources/value-converters/date-format',['exports', 'moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DateFormatValueConverter = exports.defaultDateFormat = undefined;

  var _moment2 = _interopRequireDefault(_moment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var defaultDateFormat = exports.defaultDateFormat = 'MMMM Do, YYYY';

  var DateFormatValueConverter = exports.DateFormatValueConverter = function () {
    function DateFormatValueConverter() {
      _classCallCheck(this, DateFormatValueConverter);
    }

    DateFormatValueConverter.prototype.toView = function toView(value, format) {
      format = format || defaultDateFormat;
      return (0, _moment2.default)(value).format(format);
    };

    return DateFormatValueConverter;
  }();
});
define('resources/elements/driver/driver-templates',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var DRIVER_TEMPLATES = exports.DRIVER_TEMPLATES = {
    seasonWinner: 'season-winner',
    raceWinner: 'race-winner',
    seasonWinnerDetailed: 'season-winner-detailed'
  };
});
define('resources/elements/driver/driver',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DriverCustomElement = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _desc, _value, _class, _descriptor, _descriptor2;

  var DriverCustomElement = exports.DriverCustomElement = (_dec = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.oneTime }), _dec2 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.oneTime }), (_class = function DriverCustomElement() {
    _classCallCheck(this, DriverCustomElement);

    _initDefineProp(this, 'driver', _descriptor, this);

    _initDefineProp(this, 'carConstructor', _descriptor2, this);
  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'driver', [_dec], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'carConstructor', [_dec2], {
    enumerable: true,
    initializer: null
  })), _class));
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./styles/main.css\"></require>\n  <require from=\"resources/elements/nav-bar\"></require>\n  <require from=\"resources/elements/app-footer.html\"></require>\n\n  <nav-bar></nav-bar>\n\n  <div class=\"container main\">\n    <router-view></router-view>\n  </div>\n\n  <app-footer></app-footer>\n</template>\n"; });
define('text!season-races/season-races.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"resources/elements/driver/driver\"></require>\n  <require from=\"resources/value-converters/date-format\"></require>\n\n  <loading-spinner if.bind=\"!ready\"></loading-spinner>\n  <div if.bind=\"ready\">\n    <h3>Season ${seasonYear} <span class=\"badge badge-secondary\">${races.length} races</span></h3>\n    <p class=\"lead\">\n      <driver driver.one-time=\"seasonResult.Driver\" car-constructor.one-time=\"seasonResult.Constructors[0]\"></driver>\n    </p>\n    <div class=\"card mb-3\" repeat.for=\"race of races\">\n      <div class=\"card-body\">\n        <h4 class=\"card-title\"><i class=\"fas fa-flag-checkered\"></i> ${race.raceName}</h4>\n        <h5 class=\"card-text\">\n          <driver driver.one-time=\"race.Results[0].Driver\" car-constructor.one-time=\"race.Results[0].Constructor\"></driver>\n        </h5>\n      </div>\n      <div class=\"card-footer\">\n        <small class=\"text-muted\">\n          <span class=\"mr-2\"><i class=\"fas fa-map-marker\"></i> ${race.Circuit.Location.locality}, ${race.Circuit.Location.country}</span>\n          <i class=\"fas fa-calendar-alt\"></i> ${race.date | dateFormat}\n        </small>\n      </div>\n    </div>\n  </div>\n\n</template>\n"; });
define('text!seasons/seasons.html', ['module'], function(module) { module.exports = "<template>\n  <loading-spinner if.bind=\"!ready\"></loading-spinner>\n  <div if.bind=\"ready\">\n    <p>Please select a year to see all races and winners.</p>\n    <div class=\"list-group\">\n      <a route-href=\"route: season-races; params.bind: {'year': season.season}\"\n         class=\"list-group-item list-group-item-action\"\n         repeat.for=\"season of seasonsData\">\n        ${season.season}\n      </a>\n    </div>\n  </div>\n</template>\n"; });
define('text!styles/main.css', ['module'], function(module) { module.exports = ".main{padding:65px 0 25px}.footer{border-top:1px solid #ccc;padding-top:15px;text-align:center}.app-nav{height:45px;line-height:45px}.app-nav__title{color:white;text-align:center}.app-nav__back:hover,.app-nav__back:focus{text-decoration:none}.driver--season-winner{color:gold}.driver--race-winner{color:#444}"; });
define('text!resources/elements/app-footer.html', ['module'], function(module) { module.exports = "<template>\n  <footer class=\"footer container\">\n    <p class=\"mb-0\">Mobiquity Assignment // <a href=\"//bitbucket.org/sergiuoala/mobiquity-f1\" target=\"_blank\">README</a></p>\n    <p>\n      <small class=\"mr-1\">\n        <i class=\"fas fa-user\"></i> <a href=\"//www.linkedin.com/in/sergiu-oala\" target=\"_blank\">Sergiu Oala</a>\n      </small>\n      <small class=\"mr-1\">\n        <i class=\"fas fa-envelope\"></i> <a href=\"mailto:oalasergiu@gmail.com\">oalasergiu@gmail.com</a>\n      </small>\n      <small>\n        <i class=\"fas fa-phone\"></i> +373 60 027 224\n      </small>\n    </p>\n  </footer>\n</template>\n"; });
define('text!resources/elements/loading-spinner.html', ['module'], function(module) { module.exports = "<template>\n  <p>The data is loading, will be there in a sec...</p>\n</template>\n"; });
define('text!resources/elements/nav-bar.html', ['module'], function(module) { module.exports = "<template>\n  <nav class=\"container-fluid fixed-top navbar-dark bg-dark app-nav\">\n    <div class=\"row\">\n      <div class=\"col\">\n        <span if.bind=\"router.currentInstruction.config.navbar.back\">\n          <a route-href=\"route.bind: router.currentInstruction.config.navbar.back.route\" class=\"app-nav__back\">\n            <i class=\"fas fa-chevron-left\"></i> ${router.currentInstruction.config.navbar.back.title}\n          </a>\n        </span>\n      </div>\n      <div class=\"col app-nav__title\">\n        ${router.currentInstruction.config.title}\n      </div>\n      <div class=\"col\">\n      </div>\n    </div>\n  </nav>\n</template>\n"; });
define('text!resources/elements/driver/driver.html', ['module'], function(module) { module.exports = "<template bindable=\"driver, carConstructor\">\n  <compose if.bind=\"driver\" view=\"./${driver.template}.html\"></compose>\n</template>\n"; });
define('text!resources/elements/driver/race-winner.html', ['module'], function(module) { module.exports = "<template>\n  <span class=\"driver driver--race-winner\">\n      <i class=\"fas fa-trophy\"></i> ${driver.givenName} ${driver.familyName} // ${carConstructor.name}\n  </span>\n</template>\n"; });
define('text!resources/elements/driver/season-winner-detailed.html', ['module'], function(module) { module.exports = "<template>\n  <i class=\"fas fa-trophy\" style=\"color: gold;\"></i>\n  ${driver.givenName} ${driver.familyName} || ${driver.nationality} || ${carConstructor.name}\n</template>\n"; });
define('text!resources/elements/driver/season-winner.html', ['module'], function(module) { module.exports = "<template>\n  <span class=\"driver driver--season-winner\">\n    <i class=\"fas fa-trophy\"></i> ${driver.givenName} ${driver.familyName}\n\n  </span>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map