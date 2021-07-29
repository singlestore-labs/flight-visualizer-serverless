<template>
  <div id="maps">
    <div id="mapContainer"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { mapState, mapMutations } from 'vuex';
import { Flight } from '../types/flight';
import { LatLng } from '../types/latlng';
import "leaflet-canvas-markers";

const planeFlySel = {
  url: '/plane-fly-selected.png',
  size: [24, 24],
  offset: { x: 12, y: 12},
};

const planeFly = {
  url: '/plane-fly.png',
  size: [24, 24],
  offset: { x: 12, y: 12},
};

const planeLandSel = {
  url: '/plane-land-selected.png',
  size: [26, 7],
  offset: { x: 13, y: 7},
};

const planeLand = {
  url: '/plane-land.png',
  size: [26, 7],
  offset: { x: 13, y: 7},
};

interface MapData {
  center: LatLng;
  zoom: number;
  map: L.Map | undefined;
  loading: boolean;
  planesRendered: number;
  selectedPlaneIca024: string | undefined;
}

export default defineComponent({
  data() {
    const data: MapData = {
      center: { lat: 38.736946, lng: -9.142685 },
      zoom: 8,
      map: undefined, // defined in mounted
      planesRendered: 0,
      loading: false,
      selectedPlaneIca024: undefined,
    };

    return data;
  },

  mounted() {
    this.setupLeafletMap();
  },

  computed: {
    ...mapState(['datePicked', 'selectedFlight']),

    flightList(): Flight[] {
      const date = this.$store.getters.datePicked;
      if (!date) {
        return [];
      }
      const flights: Flight[] | undefined = this.$store.getters.flightDate(date);
      if (typeof flights === 'undefined') {
        console.log('need flights');
        this.$store.dispatch('flightDateLoad', date);
      }
      return flights ?? [];
    }
  },

  watch: {
    flightList(newValue /*, oldValue */) {
      this.renderMarkers(newValue);
    }
  },

  methods: {
    ...mapMutations({ setSelectedFlight: 'selectedFlight' }),

    setupLeafletMap: function () {
      this.map = L.map('mapContainer', {
        renderer: L.canvas(),
        preferCanvas: true
      });

      this.map.setView(this.center, this.zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        updateWhenIdle: true,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Icons: <a href="https://www.vecteezy.com/free-vector/silhouette">Silhouette Vectors by Vecteezy</a>'
      }).addTo(this.map);

      this.map.on('zoomend', () => {
        this.renderMarkers(this.flightList);
      });

      this.map.on('moveend', () => {
        this.renderMarkers(this.flightList);
      });
    },

    async renderMarkers(flights: Flight[]) {
      if (!flights.length) {
        // ASSUME: we're in the middle of switching to a new date
        // leave the old planes in place for now
        return;
      }
      if (!this.map) {
        return;
      }
      const map: L.Map = this.map;
      if (this.markersLayer) {
        map.removeLayer(this.markersLayer);
      }
      this.markersLayer = new L.FeatureGroup();
      this.map.addLayer(this.markersLayer);

      this.loading = true;
      console.log(`render start: ${flights.length} total planes`);
      const t0 = performance.now();
      
      const bounds = this.map.getBounds();
      this.planesRendered = 0;
      flights.forEach(f => this.updateMarker(f, map, bounds));

      this.loading = false;
      const t1 = performance.now();
      console.log(`render done: ${this.planesRendered} planes rendered in ${t1 - t0} milliseconds`);
    },

    updateMarker(flight: Flight, map: L.Map, bounds: L.LatLngBounds) {
      const latlng: L.LatLngTuple = [flight.latitude ?? 0, flight.longitude ?? 0];

      const visible = bounds.contains(latlng);

      if (visible) {
        let icon;
        if (flight.ica024 === this.selectedPlaneIca024) {
          icon = flight.on_ground ? planeLandSel : planeFlySel;
        } else {
          icon = flight.on_ground ? planeLand : planeFly;
        }

        const rotationAngle: number = flight.on_ground ? 0 : (flight.true_track ?? 0);
        const newMarker = L.canvasMarker(latlng, {
          radius: 20,
          img: {
            url: icon.url,
            size: icon.size,
            offset: icon.offset,
            rotate: rotationAngle,
          }
        });
        newMarker.flight = flight;
        
        newMarker.on('click', () => {
          this.selectedPlaneIca024 = newMarker.flight.ica024;
          this.renderMarkers(this.flightList);
          this.setSelectedFlight(newMarker.flight);
        });

        // newMarker.addTo(this.markersLayer);
        this.markersLayer.addLayer(newMarker);
        this.planesRendered++;
      }
    },
  }

});
</script>

<style scoped>
#maps, #mapContainer {
  width: 100%;
  height: 100%;
}

#mapContainer.loading {
  display: none;
}

#maps {
  position: relative;
}
</style>
