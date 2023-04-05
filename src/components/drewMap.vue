<template lang="pug">
.taiwanMap
  div(id="map")
    svg(
        id="svg"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      )
</template>
<script>
import * as d3 from 'd3';
import * as topojson from 'topojson';

import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const chagneValue = (type, value) => {
      if (type === 'h1') store.commit('changeName', value);
      if (type === 'h2') store.commit('changeEng', value);
    };

    const drewTaiwanMap = async (width, height) => {
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
          chagneValue('h1', COUNTYNAME);
          chagneValue('h2', COUNTYENG);

          // 有 .active 存在，就移除 .active
          if (document.querySelector('.active')) {
            document.querySelector('.active').classList.remove('active');
          }
          // 被點擊的縣市加上 .active
          document.getElementById(`city${d.properties.COUNTYCODE}`).classList.add('active');
        });
    };

    onMounted(() => {
      const taiwan = document.getElementsByClassName('taiwanMap')[0];
      const width = ref(taiwan.offsetWidth);
      const height = ref(taiwan.offsetHeight);
      drewTaiwanMap(width.value, height.value);
    });

    return {};
  },
};
</script>
