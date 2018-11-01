/**
 * Created by 麦锦超 on 2018/10/14.
 */

import  Services from './services'
export default {
  getWechatSignature({commit},url) {
    console.log(url)
    return Services.getWechatSignature(url);
  }
}
