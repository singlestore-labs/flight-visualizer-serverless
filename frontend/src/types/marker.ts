import L from 'leaflet';
import { Flight } from './flight';

export type Marker = L.Marker & {
  ica024: string;
  flight: Flight;
  // from 'leaflet-rotatedmarker'
  setRotationAngle: (angle: number) => void;
}
