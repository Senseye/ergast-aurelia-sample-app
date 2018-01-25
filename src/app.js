import {inject} from 'aurelia-dependency-injection';
import {Router} from 'aurelia-router';
import {appRoutes} from 'routes/app-routes';
import {AppFetchConfig} from 'configs/app-fetch-config';

@inject(Router, AppFetchConfig)
export class App {
  constructor(router, appFetchConfig) {
    this.router = router;
    this.appFetchConfig = appFetchConfig;
  }

  configureRouter(config, router) {
    config.title = 'Mobiquity Assignment';
    config.map(appRoutes);
    this.router = router;
  }

  activate() {
    this.appFetchConfig.configure();
  }
}
