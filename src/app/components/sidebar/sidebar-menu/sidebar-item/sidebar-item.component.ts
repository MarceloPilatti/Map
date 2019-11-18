import { Component, OnInit, Input } from '@angular/core';

import { SidebarItem } from 'src/app/models/sidebar-item.model';

import { Router } from '@angular/router';

import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.css']
})
export class SidebarItemComponent implements OnInit {

  @Input() sidebarItem: SidebarItem;

  constructor(
    private router: Router,
    private sidebarService: SidebarService
  ) { }

  ngOnInit() {
  }

  onSidebarItemClicked() {
    if (this.sidebarItem.link) {
      this.router.navigateByUrl(this.sidebarItem.link);
    } else if (this.sidebarItem.method) {
      this[this.sidebarItem.method]();
    }
  }

  generateReport() {
    this.sidebarService.sidebarReload.next();
  }

}
