<template>
  <div id="main">
    <div id="header">
      <Header />
      <div id="top-row">
        <DatePicker />
        <SelectedFlight />
      </div>
    </div>
    <Map />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from './components/Header.vue';
import DatePicker from './components/DatePicker.vue';
import SelectedFlight from './components/SelectedFlight.vue';
import Map from './components/Map.vue';

export default defineComponent({
  name: 'App',

  components: {
    Header,
    DatePicker,
    SelectedFlight,
    Map
  }
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}
#app {
  font-family: Lato, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  height: 100vh;
}
#main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}
#main > * {
  width: 100%;
}
#header {
  background-color: black;
  color: white;
}
#top-row {
  display: flex;
  flex-direction: row;
  background-color: white;
  color: #AA00FF;
}
@media (max-width: 970px) {
  #top-row {
    flex-direction: column;
  }
}
#top-row > * {
  padding: 0 15px 0 15px;
  margin: 0;
}
h2 {
  font-size: 15pt;
  display: inline-block;
  padding-right: 0.5em;
}
</style>
