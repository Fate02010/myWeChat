/**
 * Created by 麦锦超 on 2018/10/14.
 */

import axios from 'axios'

const baseUrl = ''
class Services {
  getWechatSignature(url) {
    return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
  }
}
export default new Services()
