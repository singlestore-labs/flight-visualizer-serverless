<template>
  <div id="flight">
    <div v-if="!selectedFlight">Click on a plane<div>&nbsp;</div></div>
    <div v-if="selectedFlight">
      <div>
        <span class="data"><span class="title">callsign:</span> {{selectedFlight.callsign}}</span>
        <span class="data"><span class="title">from:</span> {{selectedFlight.origin_country}}</span>
        <span class="data" v-if="selectedFlight.current_country"><span class="title">now in:</span> {{selectedFlight.current_country}}</span>
        <span class="data" v-if="lastContact"><span class="title">last contact:</span> {{lastContact}}</span>
      </div>
      <div>
        <span class="data"><span class="title">position:</span> {{selectedFlight.latitude}}, {{selectedFlight.longitude}}</span>
        <span class="data" v-if="!selectedFlight.on_ground"><span class="title">altitude:</span> {{selectedFlight.altitude?.toLocaleString()}} m</span>
        <span class="data" v-if="!selectedFlight.on_ground"><span class="title">velocity:</span> {{selectedFlight.velocity?.toLocaleString()}} m/s</span>
        <span class="data" v-if="selectedFlight.on_ground"><span class="title">location:</span> landed</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { Flight } from '../types/flight';

export default defineComponent({
  computed: {
    ...mapState(['selectedFlight']),

    lastContact(): string {
      const lastContact = this.selectedFlight?.last_contact;
      if (!lastContact) {
        return '';
      }

      const loadDate = this.selectedFlight?.load_date;
      if (loadDate === lastContact) {
        return '';
      }

      return lastContact;
    }
  }
});
</script>

<style scoped>
#flight {
  margin: 0;
  font-size: 10pt;
  padding: 10px;
}

.title {
  font-weight: bold;
  color: #AA00FF;
}

.data {
  color: black;
  margin-right: 1em;
}
</style>
