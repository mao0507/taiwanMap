<!-- eslint-disable max-len -->
<!-- eslint-disable import/no-unresolved -->
<template lang="pug">
.container(id="app")
  .taiwan-map(ref="map")
    div(id="map")
      svg(id="svg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet")
  .shop-list
    h1 {{h1}}
    h2 {{h2}}

</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import * as d3 from 'd3';
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
import * as topojson from 'topojson';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const h1 = ref('請選擇地區');
    const h2 = ref('');

    const chagneTitle = (type, value) => {
      if (type === 'h1') h1.value = value;
      if (type === 'h2') h2.value = value;
    };

    const getTaiwanMap = async (width, height) => {
      const mercatorScale = ref(0);
      const w = window.screen.width;
      const vw = ref(0);
      const vh = ref(0);
      if (w > 1366) {
        mercatorScale.value = 8000;
        vw.value = width / 2;
        vh.value = height / 2.5;
      } else if (w <= 1366 && w > 480) {
        mercatorScale.value = 5000;
        vw.value = width / 1.6;
        vh.value = height / 2.5;
      } else {
        mercatorScale.value = 5400;
        vw.value = width / 1.4;
        vh.value = height / 2.6;
      }

      const projection = d3.geo
        .mercator()
        .center([121, 24])
        .scale(mercatorScale.value)
        .translate([vw.value, vh.value]);

      const path = await d3.geo.path().projection(projection);

      const svg = await d3
        .select('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);

      const taiwanJson = require('../map/taiwan.json');

      svg
        .selectAll('path')
        .data(topojson.feature(taiwanJson, taiwanJson.objects.COUNTY_MOI_1090820).features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr({ id: (code) => `city${code.properties.COUNTYCODE}` })
        .on('click', (d) => {
          /**
           * @param COUNTYENG 換英文名
           * @param COUNTYNAME 換中文名
           */
          const { COUNTYNAME, COUNTYENG } = d.properties;
          console.log(COUNTYNAME, COUNTYENG);
          chagneTitle('h1', COUNTYNAME);
          chagneTitle('h2', COUNTYENG);

          // 有 .active 存在，就移除 .active
          if (document.querySelector('.active')) {
            document.querySelector('.active').classList.remove('active');
          }
          // 被點擊的縣市加上 .active
          document.getElementById(`city${d.properties.COUNTYCODE}`).classList.add('active');
        });
    };

    onMounted(() => {
      const taiwan = document.getElementsByClassName('taiwan-map')[0];
      const width = ref(taiwan.offsetWidth);
      const height = ref(taiwan.offsetHeight);
      getTaiwanMap(width.value.toFixed(), height.value.toFixed());

      window.addEventListener('resize', () => {
        width.value = taiwan.offsetWidth;
        height.value = taiwan.offsetHeight;
        getTaiwanMap(width.value, height.value);
      });
    });
    return {
      h1,
      h2,
    };
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

.taiwan-map, .shop-list
  width: 50%
  height: 100%
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

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
  .taiwan-map, .shop-list
    width: 100%
  .taiwan-map
    height: 80vh
  .shop-list
    height: 20vh
  h1
    font-size: 8vw
  h2
    font-size: 6vw
</style>
