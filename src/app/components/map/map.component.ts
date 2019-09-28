import { Component, OnInit, Input } from '@angular/core';

import * as L from 'leaflet';

import 'leaflet.markercluster';

import 'leaflet.fullscreen';

import { HTTPService } from '../../services/http.service';

import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private map: L.Map;

  private mapConfig;

  private layerControl: L.Control.Layers;

  layers = [];

  displayInfo = false;

  @Input() zoomControl;
  @Input() fullScreenControl;
  @Input() infoControl;
  @Input() restoreMapControl;
  @Input() scaleControl;

  constructor(
    private hTTPService: HTTPService,
    private configService: ConfigService,
  ) { }

  ngOnInit() {
    this.mapConfig = this.configService.getConfig('map');
    this.setMap();
    this.setControls();
    this.setLayers();
  }

  setMap() {
    const zoomControl = this.zoomControl;
    this.map = L.map('map', {maxZoom: this.mapConfig.maxZoom, zoomControl});
    this.panMap(this.mapConfig.initialLatLong, this.mapConfig.initialZoom);
    L.Marker.prototype.options.icon = L.icon({
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
  }

  setLayers() {
    this.setBaseLayers();
    this.setOverlays();
  }

  setBaseLayers() {
    this.mapConfig.baselayers.forEach(baseLayerData => {
      const baseLayer = this.getLayer(baseLayerData);
      const baseLayerName = baseLayerData.name;
      this.layerControl.addBaseLayer(baseLayer, baseLayerName);
      if (baseLayerData.default) {
        baseLayer.addTo(this.map);
      }
    });
  }

  setOverlays() {
    this.mapConfig.overlays.forEach(overlayData => {
      const overlayName = overlayData.name;
      const overlay = this.getLayer(overlayData);
      this.layerControl.addOverlay(overlay, overlayName);
      this.layers.push(overlayData);
    });
  }

  // Leaflet controls

  setControls() {
    this.setLayerControl();

    if (this.fullScreenControl) {
      this.setFullScreenControl();
    }

    if (this.scaleControl) {
      this.setScaleControl();
    }

    if (this.infoControl) {
      this.setInfoControl();
    }

    if (this.restoreMapControl) {
      this.setRestoreMapControl();
    }

  }

  setCqlFilter(layer) {
    if (layer.defaultDateInterval) {
      const days = layer.defaultDateInterval * 86400000;
      const dateColumn = layer.dateColumn;

      const date = new Date();
      const compareDate = new Date((date.getTime() - days));

      const compareDateStr = `${compareDate.getFullYear()}-${compareDate.getMonth() + 1}-${compareDate.getDate()} ${compareDate.getHours()}:${compareDate.getMinutes()}:${compareDate.getSeconds()}`;

      const cqlFilter = `${dateColumn} > '${compareDateStr}'`;

      layer.layerData.cql_filter = cqlFilter;

      return layer;
    }
  }

  getLayer(layer) {
    layer.crs = L.CRS.EPSG3857;
    if (layer && layer.hasOwnProperty('crs')) {
      layer.crs = L.CRS.EPSG4326;
    }
    return L.tileLayer.wms(layer.url, layer);
  }

  panMap(latlng, zoom) {
    this.map.setView(latlng, zoom);
  }

  // Map controls

  setLayerControl() {
    this.layerControl = L.control.layers(
      {}, {},
      this.mapConfig.controls.layers
    ).addTo(this.map);
  }

  setFullScreenControl() {
    this.map.addControl(L.control.fullscreen(this.mapConfig.controls.fullscreen));
  }

  setScaleControl() {
    this.map.addControl(L.control.scale(this.mapConfig.controls.scale));
  }

  setInfoControl() {
    const Info = L.Control.extend({
      onAdd: () => {
        const div = L.DomUtil.create('div');
        div.innerHTML = `
          <div id="infoBtn" class="leaflet-control-layers leaflet-custom-icon leaflet-info" title="Informação">
            <a><i class='fas fa-info'></i></a>
          </div>`;
        return div;
      }
    });

    new Info({ position: 'topleft' }).addTo(this.map);

    this.setInfoControlEvent();
  }

  setInfoControlEvent() {
    document.querySelector('#infoBtn').addEventListener('click', () => {
      if (this.displayInfo === false) {
        this.displayInfo = true;
        document.querySelector('#infoBtn').classList.add('leaflet-custom-icon-selected');
        document.querySelector('#map').classList.remove('cursor-grab');
        document.querySelector('#map').classList.add('cursor-help');
        this.map.on('click', (event: MouseEvent) => this.getFeatureInfo(event));
      } else {
        this.displayInfo = false;
        document.querySelector('#infoBtn').classList.remove('leaflet-custom-icon-selected');
        document.querySelector('#map').classList.remove('cursor-help');
        document.querySelector('#map').classList.add('cursor-grab');
        this.map.off('click');
      }
    });
  }

  async getFeatureInfo(event: MouseEvent) {
    let popupTitle = '';
    let latLong;
    let popupContent = `<div class="popup-container">`;
    for (const selectedLayer of this.layers) {
      const layer = this.getLayer(selectedLayer);
      const layerName = selectedLayer.name;
      popupTitle = layerName;

      latLong = event['latlng'];

      const params = this.getFeatureInfoParams(layer, event);

      const url = `http://www.terrama2.dpi.inpe.br/mpmt/geoserver/wms`;
      await this.hTTPService.get(url, params).toPromise().then(info => {
        const features = info['features'];
        popupContent += this.getFeatureInfoPopup(layerName, features);
      });
    }

    popupContent += `</div>`;
    const marker = this.createMarker(popupTitle, popupContent, latLong);
    if (marker) {
      marker.addTo(this.map);
      marker.openPopup();
    }
  }

  getFeatureInfoParams(layer: L.TileLayer.WMS, event: MouseEvent) {
    const layerId = layer.wmsParams.layers;
    const layerPoint = this.map.layerPointToContainerPoint(event['layerPoint']);
    const bbox = this.map.getBounds().toBBoxString();
    const mapSize = this.map.getSize();
    const width = mapSize.x;
    const height = mapSize.y;
    const x = Math.round(layerPoint.x);
    const y = Math.round(layerPoint.y);
    const params = {
      service: 'WMS',
      version: '1.1.0',
      request: 'GetFeatureInfo',
      layers: layerId,
      bbox,
      width,
      height,
      query_layers: layerId,
      info_format: 'application/json',
      x,
      y
    };
    return params;
  }

  getFeatureInfoPopup(layerName: string, features: []) {
    let popupContent = '';
    features.forEach(feature => {
      const properties = feature['properties'];
      popupContent = this.getPopupContent(properties, layerName);
    });
    return popupContent;
  }

  getPopupContent(data, name) {
    let popupContent = '';
    let popupContentBody = '';
    Object.keys(data).forEach(key => {
      popupContentBody += `
          <tr>
            <td>${key}</td>
            <td>${data[key]}</td>
          </tr>
      `;
    });

    popupContent += `
        <br />
        <div class="table-responsive">
          <table class="table table-hover">
              <thead><th colspan="2">${name}</th></thead>
              ${popupContentBody}
          </table>
        </div>
    `;

    return popupContent;
  }

  setRestoreMapControl() {
    const Info = L.Control.extend({
      onAdd: () => {
        const div = L.DomUtil.create('div');
        div.innerHTML = `
          <div id="restoreMapBtn" class="leaflet-control-layers leaflet-custom-icon leaflet-restore-map" title="Restaurar mapa">
            <a><i class='fas fa-crosshairs'></i></a>
          </div>`;
        return div;
      }
    });

    new Info({ position: 'topleft' }).addTo(this.map);

    this.setRestoreMapControlEvent();
  }

  setRestoreMapControlEvent() {
    const initialLatLong = this.mapConfig.initialLatLong;
    const initialZoom = this.mapConfig.initialZoom;

    document.querySelector('#restoreMapBtn')
            .addEventListener('click', () => this.panMap(initialLatLong, initialZoom));
  }

  createMarker(popupTitle, popupContent, latLong: L.LatLng) {
    if (!popupContent) {
      return null;
    }
    const marker = L.marker(latLong, {title: popupTitle});
    marker.bindPopup(popupContent);
    return marker;
  }

}
