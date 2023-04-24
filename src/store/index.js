import Vue from 'vue'
import Vuex from 'vuex'
import { reqAllSats, reqSatById } from '@/api/sat'

Vue.use(Vuex)

const state = {
  // 存储卫星轨道数据
  satList: [],
  // satInfoList: [],
  satOnShow: {},
}

const getters = {
}

const mutations = {
  GET_ALL_SATS(state, data) {
    state.satList = data
  },
  GET_SAT_BY_ID(state, data) {
    state.satOnShow = data
  }
}

const actions = {
  // 获取所有tle
  async getAllSats({commit}) {
    let result = await reqAllSats()
    if (result.status == 0) {
      commit('GET_ALL_SATS', result.data)
    }
  },
  // 获取卫星信息
  async getSatById({commit}, id) {
    let result = await reqSatById(id)
    if (result.status == 0) {
      commit('GET_SAT_BY_ID', result.data)
    }
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
})
