import { Injectable } from '@angular/core';

import ConfigJson from '../../assets/config.json';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() {}

  getConfig(name) {
    if (name) {
      return ConfigJson[name];
    }
    return ConfigJson;
  }

  getAppConfig(name = '') {
    const appConfig = this.getConfig('app');
    if (name) {
      return appConfig[name];
    }
    return appConfig;
  }

  getSidebarConfig(name = '') {
    const sidebarConfig = this.getConfig('sidebar');
    if (name) {
      return sidebarConfig[name];
    }
    return sidebarConfig;
  }

  getMapConfig(name = '') {
    const mapConfig = this.getConfig('map');
    if (name) {
      return mapConfig[name];
    }
    return mapConfig;
  }

}
