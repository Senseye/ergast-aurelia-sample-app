import {inject} from 'aurelia-dependency-injection';
import {HttpClient} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(HttpClient, EventAggregator)
export class AppFetchConfig {
  constructor(httpClient, eventAggregator) {
    this.httpClient = httpClient;
    this.eventAggregator = eventAggregator;
  }

  configure() {
    this.httpClient.configure(httpConfig => {
      httpConfig
        .withInterceptor({
          requestError(requestError) {
            alert("Fetch client: request error.");
            return requestError;
          },
          responseError(responseError) {
            alert("Fetch client: response error.");
            return responseError;
          }
        });
    });
  }
}
