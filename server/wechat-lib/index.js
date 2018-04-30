/**
 * Created by maijinchao on 2018/4/30.
 */
import request from 'request-promise'

const base = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
  accessToken: base + 'token?grant_type=client_credential'
}

export default class WeChat {
  constructor(opts) {
    this.opts = Object.assign({}, opts);
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.fetchAccessToken();
  }

  /**
   * 统一请求入口
   * @param options
   * @returns {Promise<*>}
   */
  async request(options) {
    console.log(options);
    options = Object.assign({}, options, {json: true})
    try {
      const response = await request(options);
      console.log(options);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   *  下载 token
   * @returns {Promise<void>}
   */
  async fetchAccessToken() {
    let data = await this.getAccessToken();
    if (!this.isValidAccessToken(data)) {
      data = await this.updateAccessToken();
    }
    await this.saveAccessToken(data);
    return data;
  }

  /**
   *  更新AccessToken
   * @returns {Promise<void>}
   */
  async updateAccessToken() {
    const url = api.accessToken + '&appid=' + this.appID + '&secret=' + this.appSecret;
    // 向微信服务器请求AccessToken
    const data = await this.request({url: url});
    const now = (new Date().getTime())
    const expiresIn = now + (data.expires_in - 20) * 1000;
    data.expires_in = expiresIn;
    return data;
  }

  /**
   * 判断AccessToken是否过期
   * @param data
   * @returns {boolean}
   */
  isValidAccessToken(data) {
    if (!data || !data.access_token || !data.expires_in) {
      return false;
    }
    const expiresIn = data.expires_in;
    const now = (new Date().getTime())
    if (now < expiresIn) {
      return true;
    } else {
      return false;
    }
  }
}
