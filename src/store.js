import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    excludedComponents: [],
    includedComponents: ['index']
  },
  mutations: {
    // 设置需要缓存的页面
    setPagesToCache (state, val) {
      state.includedComponents.push(val)
      state.excludedComponents.splice(state.excludedComponents.indexOf(val))
      state.includedComponents = Array.from(new Set(state.includedComponents))
    },
    // 设置不需要缓存的页面
    delPagesFromCache (state, val) {
      state.excludedComponents.push(val)
    }
  },
  actions: {

  }
})
