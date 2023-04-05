import { createStore } from 'vuex';

export default createStore({
  state: {
    COUNTYNAME: '請選擇地區',
    COUNTYENG: 'Please choose place',
  },
  getters: {},
  mutations: {
    changeName(state, params) {
      state.COUNTYNAME = params;
    },
    changeEng(state, params) {
      state.COUNTYENG = params;
    },
  },
  actions: {},
  modules: {},
});
