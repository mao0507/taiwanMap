<!-- eslint-disable max-len -->
<!-- eslint-disable import/no-unresolved -->
<template lang="pug">
.container()
  taiwan-map
  city-weather

</template>

<script>
import taiwanMap from '@/components/drewMap.vue';
import cityWeather from '@/components/cityWeather.vue';

export default {
  components: {
    taiwanMap,
    cityWeather,
  },
  setup() {
    return {};
  },
};
</script>
<style lang="sass">
$main: #42b883

*
  margin: 0
  padding: 0
  box-sizing: border-box
html, body, .container
  width: 100%
  height: 100vh
  overflow: hidden

body
  letter-spacing: 1px

.container
  display: flex
  justify-content: space-around
  background: #e0e0e0
  //background: linear-gradient(to right, #414345, #232526)

.taiwanMap, .city
  width: 50%
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

.city
  .weather
    margin-top: 10px
    color: $main

#map
  display: flex
  justify-content: center
  align-items: center
  width: 100%
  height: 100%
  svg
    max-height: 100vh
  path
    fill: transparent
    stroke: $main
    cursor: pointer
    transition: fill .2s ease, stroke .2s ease, transform .2s ease
    &:hover, &.active
      fill: rgba($main, .5)
      stroke: $main
      transform: translateY(-5px)

h1, h2
  position: relative
  line-height: 2
  text-align: center
  font-weight: bold
  color: $main

@media screen and (max-width: 480px)
  .container
    flex-wrap: wrap
  .taiwanMap, .city
    width: 100%
  .taiwanMap
    height: 80vh
  .city
    height: 20vh
  h1
    font-size: 8vw
  h2
    font-size: 6vw
</style>
