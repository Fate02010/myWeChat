/**
 * Created by 麦锦超 on 2018/10/14.
 */

import axios from 'axios'

const baseUrl = ''
const apiUrl = 'http://localhost:8080/mockjsdata/1'
class Services {
  getWechatSignature(url) {
    return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
  }

  getUserByOAuth(url) {
    return axios.get(`${baseUrl}/wechat-oauth?url=${url}`)
  }

  fetchHouses () {
    return axios.get(`${apiUrl}/wiki/houses`)
  }

  fetchHouse (id) {
    return axios.get(`${apiUrl}/wiki/houses/${id}`)
  }

  fetchCharacters () {
    return axios.get(`${apiUrl}/wiki/characters`)
  }

  fetchCharacter (id) {
    return axios.get(`${apiUrl}/wiki/characters/${id}`)
  }

  fetchCities () {
    return axios.get(`${apiUrl}/wiki/cities`)
  }

}
export default new Services()
