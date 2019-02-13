/**
 * Created by 麦锦超 on 2018/11/2.
 */

import request from 'request-promise'

// 网页认证的基础地址
const base = 'https://api.weixin.qq.com/sns/'

// 获取认证 token 的 api
const api = {
  authorize: 'https://open.weixin.qq.com/connect/oauth2/authorize?',
  accessToken: base + 'oauth2/access_token?',
  userInfo: base + 'userinfo?'
}

export default class WechatOAuth {

  constructor(opts) {
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
  }


  async request(options) {
    options = Object.assign({},options,{json:true});
    try {
      const response = await request(options);
      return response;
    }catch (error) {
      console.log(error);
    }
  }


  /**
   *  拼接请求认证的地址
   * @param scope
   * @param target 目标地址
   * @param state 附带参数
   * @returns {string}
   */
  getAuthorizeURL(scope = 'snsapi_base',target,state) {
    const url = `${api.authorize}appid=${this.appID}&redirect_uri=${encodeURIComponent(target)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
    return url
  }

  /**
   *  根据 code 获取认证的accessToken
   * @param code
   * @returns {Promise<*>}
   */
  async fetchAccessToken(code) {
    console.log(this.appID);
    const url = `${api.accessToken}appid=${this.appID}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`;
    const data = await this.request({url:url});
    return data;
  }

  /**
   * 获取用户信息
   * @param token
   * @param openID
   * @param lang
   * @returns {Promise<*>}
   */
  async getUserInfo(token,openID,lang='zh_CN') {
    const url = `${api.userInfo}access_token=${token}&openid=${openID}&lang=${lang}`;
    const data = await this.request({url:url});
    return data;
  }

}
