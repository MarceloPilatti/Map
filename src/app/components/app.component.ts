import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';

import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private appConfig;

  displaySidebar = true;

  constructor(
    private configService: ConfigService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.appConfig = this.configService.getAppConfig();
    this.titleService.setTitle(`${this.appConfig.mainApplication} | ${this.appConfig.headerTitle}`);
  }

  showHideSidebar(displaySidebar: boolean) {
    this.displaySidebar = displaySidebar;
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}
