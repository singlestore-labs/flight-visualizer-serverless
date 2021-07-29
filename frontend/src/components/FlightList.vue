<template>
  <div>
    <h2>Flight list</h2>
    <ul>
      <li v-for="flight in flightList" :key="flight">
        {{flight.callsign}}, {{flight.ica024}}, {{flight.squawk}}
        <br />{{flight.origin_country}}, {{flight.current_country}}
        <br />{{flight.longitude}}, {{flight.latitude}}, {{flight.altitude}}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { Flight } from '../types/flight';

export default defineComponent({

  computed: {

    ...mapState(['datePicked']),

    flightList(): Flight[] {
      const date = this.$store.getters.datePicked;
      if (!date) {
        return [];
      }
      const countryCount: Flight[] | undefined = this.$store.getters.flightDate(date);
      return countryCount ?? [];
    }

  }

});
</script>
