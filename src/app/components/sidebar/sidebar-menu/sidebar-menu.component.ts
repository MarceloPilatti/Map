import { Component, OnInit, Input } from '@angular/core';

import { SidebarItem } from 'src/app/models/sidebar-item.model';

import { LayerGroup } from 'src/app/models/layer-group.model';

import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {

  @Input() sidebarItems: SidebarItem[];

  @Input() sidebarLayerGroups: LayerGroup[];

  constructor(
    private sidebarService: SidebarService
  ) { }

  ngOnInit() {
  }

}
