import Vue from 'vue'
import Vuex from 'vuex'
import account from './state/account'
import api from './state/api'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    account,
    api
  }
})
