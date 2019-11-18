import { Component, OnInit, Input } from '@angular/core';

import { SidebarService } from 'src/app/services/sidebar.service';

import { Layer } from 'src/app/models/layer.model';

import { LayerGroup } from 'src/app/models/layer-group.model';

@Component({
  selector: 'app-sidebar-layer-group',
  templateUrl: './sidebar-layer-group.component.html',
  styleUrls: ['./sidebar-layer-group.component.css']
})
export class SidebarLayerGroupComponent implements OnInit {

  @Input() sidebarLayerGroup: LayerGroup;

  @Input() sidebarLayers: Layer[];

  switchChecked = false;

  isLayerGroupOpened = false;

  constructor(
    private sidebarService: SidebarService
  ) { }

  ngOnInit() {
  }

  onSwitchChanged(event) {
    if (event.checked === true) {
      this.sidebarService.sidebarLayerGroupSelect.next(this.sidebarLayerGroup);
    } else if (event.checked === false) {
      this.sidebarService.sidebarLayerGroupDeselect.next(this.sidebarLayerGroup);
    }
    this.switchChecked = !this.switchChecked;
  }

  onLayerGroupClicked() {
    this.isLayerGroupOpened = !this.isLayerGroupOpened;
  }

}
