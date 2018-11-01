/**
 * Created by fateMar on 2018/4/30.
 */
import request from 'request-promise'
// import formstream from 'formstream'
import * as _ from 'lodash'
import fs from 'fs'
//import path from 'path'
import { sign } from './util'


const base = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
  accessToken: base + 'token?grant_type=client_credential',
  // 临时素材的地址
  temporary: {
    upload: base + 'media/upload?',
    fetch: base + 'media/get?'
  },
  // 永久素材操作地址
  permanent: {
    // 新增其他类型的素材
    upload: base + 'material/add_material?',
    // 新增永久的图文素材
    uploadNews: base + 'material/add_news?',
    // 新增图片素材
    uploadNewPic: base + 'media/uploadimg?',
    // 获取永久素材
    fetch: base + 'material/get_material?',
    // 删除永久素材
    del: base + 'material/del_material?',
    // 更新永久素材
    update: base + 'material/update_news?',
    // 获取永久素材的数量
    count: base + 'material/get_materialcount?',
    // 获取永久素材列表
    batch: base + 'material/batchget_material?'
  },
  // 用户标签管理接口
  tag: {
    // 创建标签
    create: base + 'tags/create',
    // 获取标签
    fetch: base + 'tag/get?',
    // 更新标签
    update: base + 'tags/update?',
    // 删除标签
    del: base + 'tags/delete?',
    // 获取标签下粉丝列表
    fetchUsers: base + 'user/tag/get?',
    // 批量为用户打标签
    batchTag: base + 'tags/members/batchtagging?',
    // 批量为用户取消标签
    batchUnTag: base + 'tags/members/batchuntagging?',
    // 获取用户身上的标签列表
    getTagList: base + 'tags/getidlist?'
  },
  //
  user: {
    // 设置用户标签名
    remark: base + 'user/info/updateremark?',
    // 获取用户基本信息
    info: base + 'user/info?',
    // 批量获取用户基本信息
    batchInfo: base + 'user/info/batchget?',
    // 获取用户列表
    fetchUserList: base + 'user/get?',
    // 获取公众号的黑名单列表
    getBlackList: base + 'tags/members/getblacklist?',
    // 拉黑用户
    batchBlackUsers: base + 'tags/members/batchblacklist?',
    //  取消拉黑用户
    batchUnblackUsers: base + 'tags/members/batchunblacklist?'
  },

  // 菜单操作地址
  menu: {
    // 创建菜单
    create: base + 'menu/create?',
    // 自定义菜单查询
    get: base + 'menu/get',
    // 删除菜单
    del: base + 'menu/delete',
    // 创建个性化菜单
    addconditional: base + 'menu/addconditional?',
    // 获取自定义菜单接口
    getInfo: base + 'get_current_selfmenu_info?'
  },
  ticket: {
    get: base + 'ticket/getticket?'
  }
}

export default class WeChat {
  constructor(opts) {
    this.opts = Object.assign({}, opts);
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.fetchAccessToken();
    this.getTicket = opts.getTicket;
    this.saveTicket = opts.saveTicket;
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
    if (!this.isValidToken(data,'access_token')) {
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
  isValidToken(data, name) {
    if (!data || !data[name] || !data.expires_in) {
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

  async fetchTicket (token) {
    let data = await this.getTicket();
    if(!this.isValidToken(data,'ticket')) {
      data = await this.updateTicket(token);
    }
    await this.saveTicket(data);
    return data;
  }

  async updateTicket(token) {
    const  url = api.ticket.get + '&access_token=' + token + '&type=jsapi';
    let data = await this.request({url: url});
    const  now = (new Date().getTime());
    const expiresIn = now + (data.expires_in - 20) * 1000;
    data.expires_in = expiresIn;

    return data;
  }

  /**
   *  执行素材上传,更新等操作
   * @param operation 操作的函数名称
   * @param args 参数
   * @returns {Promise<void>}
   */
  async handle (operation, ...args) {
    const tokenData = await  this.fetchAccessToken();
    const options = this[operation](tokenData.access_token,...args);
    const  data = await this.request(options);
    return data;
  }

  /**
   * 上传素材
   * @param token 请求的token
   * @param type  素材的类型
   * @param material 素材文件
   * @param permanent 永久素材的标志
   */
  uploadMaterial (token, type, material, permanent) {
    let form = {};
    let url = api.temporary.upload;

    if (permanent) {
      url = api.permanent.upload;
      _.extend(form,permanent);
    }

    if (type === 'pic') {
      url = api.permanent.uploadNewPic;
    }

    if (type === 'news') {
      url = api.permanent.uploadNews;
      form = material;
    }else {
      form = fs.createReadStream(material)
    }

    let uploadUrl = url + 'access_token=' + token;

    if (!permanent) {
      uploadUrl += '&type' + type;
    }else {
      if (type !== 'news') {
        form.access_token = token;
      }
    }

    const options = {
      method: 'POST',
      url: uploadUrl,
      json: true
    }

    if (type === 'news') {
      options.body = form
    } else {
      options.formData = form;
    }

    return options;
  }


  /**
   *  下载素材
   * @param token 请求token
   * @param mediaId 素材的id
   * @param type  素材的类型
   * @param permanent 是否为永久素材
   */
  fetchMaterial(token,mediaId,type,permanent) {
    let form = {};
    let fetchUrl = api.temporary.fetch;

    if (permanent) {
      fetchUrl = api.temporary.fetch
    }

    let url = fetchUrl + 'access_token=' + token;
    let options = {method: 'POST',url:url};

    if (permanent) {
      form.media_id = mediaId;
      form.access_token = token;
      options.body = form;
    } else {
      if (type === 'video') {
        url = url.replace('https://','http://');
      }
      url += '&media_id=' + mediaId;
    }
    return options;
  }

  /**
   * 删除素材
   * @param token 请求token
   * @param mediaId 删除的素材ID
   */
  deleteMaterial (token,mediaId){
    const form = {
      media_id: mediaId
    }
    const  url = api.permanent.del + 'access_token=' + '&media_id' + mediaId;
    return {method: 'POST',url: url,body:form};
  }

  /**
   * 更新永久素材
   * @param token 请求token
   * @param mediaId 素材ID
   * @param news
   */
  updateMaterial (token, mediaId, news) {
    const form = {
      media_id: mediaId
    }

    _.extend(form, news)
    const url = api.permanent.update + 'access_token=' + token + '&media_id=' + mediaId

    return {method: 'POST', url: url, body: form}
  }

  /**
   *  获取素材的总数
   * @param token
   * @returns {{method: string, url: string}}
   */
  countMaterial (token) {
    const url = api.permanent.count + 'access_token=' + token
    return {method: 'POST', url: url}
  }

  /**
   *  获取素材列表
   * @param token 请求token
   * @param options 参数(素材类型,素材偏移位置,素材数量)
   * @returns {{method: string, url: string, body: *}}
   */
  batchMaterial (token, options) {
    options.type = options.type || 'image';
    options.offset = options.offset || 0;
    options.count = options.count || 10;

    const url = api.permanent.batch + 'access_token=' + token;
     return  {method:'POST',url: url,body: options};
  }

  /**
   * 创建标签
   * @param token
   * @param name
   */
  createTag(token,name) {
    const form = {
      tag: {
        name: name
      }
    }
    const url = api.tag.create + 'access_token=' + token;
    return {method: 'POST',url: url, body: form};
  }

  /**
   * 获取标签
   * @param token
   * @returns {{url: string}}
   */
  fetchTags(token) {
    const url = api.tag.fetch + 'access_token=' + token;
    return {url: url};
  }

  /**
   * 更新用户标签
   * @param token
   * @param tagId
   * @param name
   */
  updateTag(token,tagId,name) {
    const form = {
      tag: {
        id: tagId,
        name: name
      }
    }

    const  url = api.tag.update + 'access_token=' + token;
    return {method: 'POST',url: url,body: form};
  }

  /**
   * 删除标签
   * @param token
   * @param tagId
   */
  del(token,tagId) {
    const form =  {
      tag: {
        id: tagId
      }
    }

    const url = api.tag.update + 'access_token=' + token;
    return {method: 'POST',url:url,body: form};
  }

  /**
   * 获取标签下的用户
   * @param token
   * @param tagId
   * @param openId
   * @returns {{method: string, url: string, body: {tagid: *, next_openid: (*|string)}}}
   */
  fetchTagUsers(token,tagId,openId) {
    const form = {
      tagid: tagId,
      next_openid: openId || ''
    }
    const url = api.tag.fetchUsers +'access_token=' + token;
    return { method:'POST',url: url,body: form};
  }


  /**
   * 批量为用户打标签
   * @param token
   * @param openIdList
   * @param tagId
   * @param unTag
   * @returns {{method: string}}
   */
  batchTag(token, openIdList,tagId, unTag) {
    const form = {
      openid_list: openIdList,
      tagid: tagId
    }
    let url = api.tag.batchTag;
    if(unTag) {
      url = api.tag.batchUnTag
    }
    url += 'access_token' + token;
    return {method: 'POST'}
  }

  /**
   * 获取标签列表
   * @param token
   * @param openId
   * @returns {{method: string, url: string, body: {openId: *}}}
   */
  getTagList (token,openId) {
    const form = {
      openId : openId
    }
    const url = api.tag.getTagList + 'access_token=' + token;
    return {method: 'POST',url: url,body: form};
  }

  /**
   *  设置用户备注
   * @param token
   * @param openId
   * @param remark
   */
  remarkUser(token,openId,remark) {
    const form = {
      openId: openId,
      remark: remark
    }
    const url = api.user.remark + 'access_token=' + token;
    return {method: 'POST',url: url,body:form};
  }

  /**
   * 获取标签下用户信息
   * @param token
   * @param openId
   * @param lang
   * @returns {{url: string}}
   */
  getUserInfo(token,openId,lang) {
    const url = `${api.user.info}access_token=${token}&openid=${openId}&lang=${lang || 'zh_CN'}`;
    return {url:url};
  }

  /**
   * 批量获取用户信息
   * @param token
   * @param userList
   * @returns {{method: string, url: string, body: {user_list: *}}}
   */
  batchUserInfo (token, userList) {
    const url = api.user.batchInfo + 'access_token=' + token
    const form = {
      user_list: userList
    }

    return {method: 'POST', url: url, body: form}
  }

  /**
   * 获取用户列表
   * @param token
   * @param openId
   * @returns {{url: string}}
   */
  fetchUserList (token, openId) {
    const url = `${api.user.fetchUserList}access_token=${token}&next_openid=${openId || ''}`

    return {url: url}
  }

  /**
   *  创建菜单
   * @param token
   * @param menu
   */
  createMenu(token,menu) {
    const url = api.menu.create + 'access_token=' + token;
    return { method: 'POST',url: url, body: menu};
  }

  /**
   *  获取菜单
   * @param token
   * @returns {{url: string}}
   */
  getMenu(token) {
    const url = api.menu.get + 'access_token=' + token;
    return { url: url};
  }

  /**
   * 删除菜单
   * @param token
   * @returns {{url: string}}
   */
  delMenu(token) {
    const url = api.menu.del + 'access_token=' + token;
    return { url: url};
  }

  /**
   * 创建个性化菜单
   * @param token
   * @param menu
   * @param rule
   * @returns {{method: string, url: string, body: {button: *, matchrule: *}}}
   */
  addConditionMenu (token, menu, rule) {
    const url = api.menu.addconditional + 'access_token=' + token;
    const form = {
      button: menu,
      matchrule: rule
    };
    return {method: 'POST', url:url, body: form};
  }

  /**
   * 获取自定义菜单
   * @param token
   * @returns {{url: string}}
   */
  getCurrentMenuInfo(token) {
    const url = api.menu.getInfo + 'access_token=' + token;
    return {url: url};
  }

  /**
   * 签名
   * @param ticket
   * @param url
   * @returns {*}
   */
  sign(ticket,url) {
    return sign(ticket,url);
  }
}


