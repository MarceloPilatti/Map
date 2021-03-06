import { LayerData } from './layer-data.model';

import { Legend } from './legend.model';

import { Tool } from './tool.model';

export class Layer {
  constructor(
    public cod: string,
    public codgroup: string,
    public label: string,
    public shortLabel: string,
    public value: number,
    public dateColumn: string,
    public geomColumn: string,
    public areaColumn: string,
    public carRegisterColumn: string,
    public classNameColumn: string,
    public type: string,
    public isPrimary: boolean,
    public layerData: LayerData,
    public legend: Legend,
    public popupTitle: string,
    public tools?: Tool[],
    public markerSelected?: boolean
  ) {}
}
