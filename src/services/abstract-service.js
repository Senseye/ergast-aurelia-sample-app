import {Container} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

/*
* AbstractService - every service, should extend this class.
* In case the HttpClient library is replaced, it shouldn't affect the implemented services.
* */
export class AbstractService {
  constructor(baseUrl) {
    this.httpClient = Container.instance.get(HttpClient);
    this.baseUrl = baseUrl;
  }

  fetch(url) {
    return this.httpClient.fetch(this.baseUrl + url);
  }
}
