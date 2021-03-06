import { Component, OnInit, Input } from '@angular/core';

import { LazyLoadEvent } from 'primeng/api';

import { HTTPService } from 'src/app/services/http.service';

import { ConfigService } from 'src/app/services/config.service';

import { TableService } from 'src/app/services/table.service';

import { Layer } from '../../../models/layer.model';

import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Input() tableData: any[] = [];

  @Input() columns: any[] = [];

  @Input() selectedColumns: any[] = [];

  @Input() selectedLayers: Layer[] = [];

  @Input() tableHeight = '30vh';

  selectedProperties;

  selectedLayer;
  selectedLayerLabel: string;
  selectedLayerValue: number;

  loading = false;

  totalRecords = 0;

  rowsPerPage: any[];
  defaultRowsPerPage = 10;
  selectedRowsPerPage: number = this.defaultRowsPerPage;

  filters: any[];
  selectedFilter;
  selectedFilterValue: string;
  selectedFilterSortField: string;

  private tableConfig;

  constructor(
    private hTTPService: HTTPService,
    private configService: ConfigService,
    private tableService: TableService,
    private mapService: MapService,
  ) { }

  ngOnInit() {
    this.tableConfig = this.configService.getMapConfig('table');

    this.rowsPerPage = this.tableConfig.rowsPerPage;

    this.tableService.loadTableData.subscribe(layer => {
      if (layer) {
        this.loading = true;
        this.loadTableData(layer, this.selectedRowsPerPage, 0);
      }
    });

    this.tableService.unloadTableData.subscribe((layer: Layer) => {
      if (layer && layer.value === this.selectedLayerValue) {
        this.clearTable();
      }
    });

    this.tableService.clearTable.subscribe(() => this.clearTable());
  }

  loadTableData(layer,
                limit: number,
                offset: number,
                sortField?: string,
                sortOrder?: number
  ) {
    if (!layer) {
      return;
    }

    const url = this.configService.getAppConfig('layerUrls')[layer.type];
    const countTotal = true;
    const date = JSON.parse(localStorage.getItem('dateFilter'));
    const viewId = layer.value;
    const params = {viewId, limit, offset, countTotal, date};
    if (sortField) {
      params['sortField'] = sortField;
    }
    if (sortOrder) {
      params['sortOrder'] = sortOrder;
    }

    if (this.selectedFilter) {
      params['count'] = this.selectedFilter.count;
      params['sum'] = this.selectedFilter.sum;
      params['isDynamic'] = this.selectedFilter.isDynamic;
      params['tableAlias'] = this.selectedFilter.tableAlias;
      params['sumAlias'] = this.selectedFilter.sumAlias;
      params['countAlias'] = this.selectedFilter.countAlias;
      params['sumField'] = this.selectedFilter.sumField;
      params['sortField'] = this.selectedFilter.sortField;
    }

    this.hTTPService
      .get(url, params)
      .subscribe(data => this.setData(data));
  }

  setData(data) {
    if (data) {
      this.selectedColumns = [];
      this.columns = [];

      Object.keys(data[0]).forEach(key => {
        if (key !== 'lat' && key !== 'long' && key !== 'geom' && key !== 'intersection_geom') {
          this.columns.push({field: key, header: key});
        }
      });

      this.selectedColumns = this.columns;

      this.totalRecords = data.pop();
      this.tableData = data;

      this.rowsPerPage = this.rowsPerPage.filter((row) => row.value !== this.totalRecords);

      if (this.totalRecords > 1000) {
        this.rowsPerPage.push({
          label: this.totalRecords,
          value: this.totalRecords
        });
      }

    }
    this.loading = false;
  }

  lazyLoad(event: LazyLoadEvent) {
    this.loadTableData(this.selectedLayer,
                      event.rows,
                      event.first,
                      event.sortField,
                      event.sortOrder
    );
  }

  onSelectedLayerChange(layer) {
    this.loading = true;
    this.selectedLayer = layer.selectedOption;
    this.selectedLayerLabel = this.selectedLayer.label;
    this.loadTableData(layer.selectedOption, this.selectedRowsPerPage, 0);
  }

  onRowsPerPageChange(event) {
    this.loading = true;
    this.loadTableData(this.selectedLayer, this.selectedRowsPerPage, 0);
  }

  onFilterChange(filter) {
    this.loading = true;
    const selectedOption = filter.selectedOption;
    this.selectedLayer = selectedOption;
    this.selectedFilter = selectedOption;
    this.loadTableData(selectedOption, this.selectedRowsPerPage, 0, selectedOption.sortField, 1);
  }

  trackByFunction(index, item) {
    return index;
  }

  onShowMapClicked(rowData = null) {
    if (!rowData) {
      rowData = this.selectedProperties;
    }
    this.mapService.showMarker.next({
      layer: this.selectedLayer,
      data: rowData
    });
  }

  clearTable() {
    this.tableData = undefined;
    this.selectedLayer = undefined;
    this.selectedFilterValue = undefined;
    this.selectedLayerLabel = '';
    this.selectedLayerValue = 0;
    this.selectedColumns = undefined;
    this.selectedRowsPerPage = this.defaultRowsPerPage;
    this.totalRecords = 0;
  }

  onGenerateReportClick(rowData) {
  }

}
