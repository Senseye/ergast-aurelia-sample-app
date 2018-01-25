import {bindable, bindingMode} from 'aurelia-framework';

export class DriverCustomElement {
  @bindable({ defaultBindingMode: bindingMode.oneTime }) driver;
  @bindable({ defaultBindingMode: bindingMode.oneTime }) carConstructor;
}
