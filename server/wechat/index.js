/**
 * Created by maijinchao on 2018/4/30.
 */
import  mongoose from 'mongoose'
import  config from '../config'
import  WeChat from '../wechat-lib'

const Token = mongoose.model('Token')
const Ticket = mongoose.model('Ticket')

/**
 * 微信 配置
 * @type {{wechat: {appID: string, appSecret: string, token: string, getAccessToken: function(): *, saveAccessToken: function(*=): *}}}
 */
const  wechatConfig = {
  wechat: {
    appID: config.wechat.appID,
    appSecret: config.wechat.appSecret,
    token:config.wechat.token,
    // 操作token
    getAccessToken: async () => await Token.getAccessToken(),
    saveAccessToken: async (data) => await  Token.saveAccessToken(data),
    // 操作ticket
    getTicket: async () => await  Ticket.getTicket(),
    saveTicket: async (data) => await Ticket.saveTicket(data)
  }
}

/**
 * 微信客户端对象
 * @returns {WeChat}
 */
export const getWechat = () => {
  const weChatClient = new WeChat(wechatConfig.wechat);
  return weChatClient;

}

getWechat();
