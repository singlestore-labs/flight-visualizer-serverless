<template>
  <div>
    <h2>Country list</h2>
    <ul>
      <li v-for="country in countryList" :key="country.name">
        {{country.name}}: <span v-if="country.count">{{country.count}}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { CountryCount } from '../types/country-count';
import { StoreState } from '../types/store';

export default defineComponent({

  computed: {

    ...mapState(['datePicked']),

    countryList(): CountryCount[] {
      return this.getCountryCounts();
    }

  },

  methods: {

    getCountryCounts(): CountryCount[] {
      const date = this.$store.getters.datePicked;
      if (!date) {
        return this.getCountryDefault();
      }
      const countryCount: CountryCount[] | undefined = this.$store.getters.countryDate(date);
      if (countryCount) {
        return countryCount.filter(c => c.count);
      }
      return this.getCountryDefault();
    },

    getCountryDefault(): CountryCount[] {
      const state: StoreState = this.$store.state;
      return (state.countries || []).map(c => ({
        name: c.name,
        count: 0
      }));
    }

  }

});
</script>
