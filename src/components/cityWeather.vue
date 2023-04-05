<template lang="pug">
.city
  .name
    h1 {{ COUNTYNAME }}
    h2 {{ COUNTYENG }}
  .weather(v-if="weatherData")
    h1 {{ weatherData.datasetDescription }}
    div(v-for="item in weatherData.location[0].weatherElement[0].time")
      div.text 開始時間 : {{item.startTime}}
      div.text 結束時間 : {{item.endTime}}
      div.text 天氣 : {{item.parameter.parameterName}}
      div.line

</template>
<script>
import { computed, watch, ref } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
  setup() {
    // console.log(process.env.VUE_APP_TOKEN);
    // console.log(process.env.VUE_APP_API);

    const weatherData = ref(null);

    const getWeather = async (value) => {
      if (value) {
        axios
          .get(
            `${process.env.VUE_APP_API}api/v1/rest/datastore/F-C0032-001?Authorization=${process.env.VUE_APP_TOKEN}&locationName=${value}&elementName=Wx`
          )
          .then((response) => {
            if (response.status === 200) {
              // console.log(response.data.records);
              weatherData.value = response.data.records;
            }
          });
      }
    };

    const store = useStore();
    const COUNTYNAME = computed(() => store.state.COUNTYNAME);
    const COUNTYENG = computed(() => store.state.COUNTYENG);

    watch(COUNTYNAME, (newValue) => {
      if (COUNTYNAME.value !== '請選擇地區') {
        getWeather(newValue);
      }
    });

    return {
      COUNTYNAME,
      COUNTYENG,
      weatherData,
    };
  },
};
</script>
<style lang="sass">
.weather
  .text
    margin: 5px 0px
.weather
  .line
    background-color: #42b883
    height: 1px
    margin: 10px
</style>
