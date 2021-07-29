<template>
  <div>
    <h2>Flight Dates</h2>
    <select v-model="datePicked">
      <option value="latest">Latest</option>
      <option v-for="d in dates" :key="d.text"
        :value="d.value" :selected="d.value === datePicked">
        {{ d.text }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions, mapMutations } from 'vuex';

export default defineComponent({
  data() {
    return {
      interval: 0
    };
  },

  computed: {
    ...mapState(['dates']),
    ...mapMutations({ setDates: 'dates' }),

    datePicked: {
      get(): string {
        return this.$store.state.datePicked;
      },
      set(value: string) {
        this.$store.commit('dates', []);
        this.datesLoad();
        this.$store.commit('datePicked', value);
      }
    }
  },

  mounted() {
    this.datesLoad();

    this.interval = setInterval(() => {
      this.datesLoad();
    }, 2000);
  },

  beforeUnmount() {
    clearInterval(this.interval);
  },

  methods: {
    ...mapActions(['datesLoad'])
  }
});
</script>

<style scoped>
h2 {
  margin-top: 0.7em;
  margin-bottom: 0.3em;
}
</style>
