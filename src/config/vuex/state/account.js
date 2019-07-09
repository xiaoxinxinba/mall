export default {
  state: {
    storeName: '',
    pcLogo: ''
  },
  mutations: {
    setShopInfo (state, res) {
      state.storeName = res.storeName;
      state.pcLogo = res.pcLogo
    }
  },
  action: {}
}
