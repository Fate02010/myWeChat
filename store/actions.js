/**
 * Created by 麦锦超 on 2018/10/14.
 */

import  Services from './services'
export default {
  getWechatSignature({commit},url) {
    console.log(url)
    return Services.getWechatSignature(url);
  },
  getUserByOAuth({commit},url) {
    console.log(url)
    return Services.getUserByOAuth(url);
  },

  /**
   * 获取家族信息
   * @param state
   * @returns {Promise<*>}
   */
  async fetchHouses({ state }) {
    const res = await Services.fetchHouses()
    state.houses = res.data.data
    return res
  },

  /**
   * 获取家族人物数据
   * @param state
   * @returns {Promise<*>}
   */
  async fetchCharacters ({ state }) {
    const res = await Services.fetchCharacters()
    state.characters = res.data.data
    return res
  },

  async fetchCities ({ state }) {
    const res = await Services.fetchCities()
    state.cities = res.data.data
    return res
  }
}



