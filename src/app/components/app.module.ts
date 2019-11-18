import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';

import localePt from '@angular/common/locales/pt';
import { AppRoutingModule } from './app-routing.module';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SidebarModule } from 'primeng/sidebar';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { DragDropModule } from 'primeng/dragdrop';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TreeDragDropService, MessageService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToolbarModule } from 'primeng/toolbar';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { TableComponent } from './map/table/table.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LegendComponent } from './map/legend/legend.component';
import { SidebarHeaderComponent } from './sidebar/sidebar-header/sidebar-header.component';
import { SidebarMenuComponent } from './sidebar/sidebar-menu/sidebar-menu.component';
import { SidebarLayerGroupComponent } from './sidebar/sidebar-menu/sidebar-layer/sidebar-layer-group.component';
import { SidebarItemComponent } from './sidebar/sidebar-menu/sidebar-item/sidebar-item.component';
import { SidebarFooterComponent } from './sidebar/sidebar-footer/sidebar-footer.component';
import { SidebarLayerComponent } from './sidebar/sidebar-menu/sidebar-layer/sidebar-layer/sidebar-layer.component';
import { VisibleLayersComponent } from './map/visible-layers/visible-layers.component';
registerLocaleData(localePt, 'pt');
@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    MapComponent,
    TableComponent,
    LegendComponent,
    SidebarHeaderComponent,
    SidebarFooterComponent,
    SidebarMenuComponent,
    SidebarLayerGroupComponent,
    SidebarLayerComponent,
    VisibleLayersComponent,
    SidebarItemComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CardModule,
    ChartModule,
    ScrollPanelModule,
    TableModule,
    DragDropModule,
    SidebarModule,
    MultiSelectModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ButtonModule,
    TooltipModule,
    DropdownModule,
    DialogModule,
    CalendarModule,
    AccordionModule,
    KeyFilterModule,
    InputSwitchModule,
    CheckboxModule,
    ToastModule,
    RadioButtonModule,
    ToolbarModule
  ],
  providers: [
    TreeDragDropService,
    Title,
    MessageService
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
