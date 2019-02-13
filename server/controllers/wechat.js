/**
 * Created by 麦锦超 on 2018/10/14.
 */

import api from '../api'
import config from '../config'
import { parse as urlParse } from 'url'
import { parse as queryParse } from 'querystring'


/**
 * 签名
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
export async function signature(ctx,next) {
  let url = ctx.query.url;
  if(!url) ctx.throw(404);
  url = decodeURIComponent(url);
  const params = await api.wechat.getSignatureAsync(url);
  console.log(params);
  ctx.body = {
    success: true,
    params: params
  }
}

export async function redirect(ctx,next) {
  const target = config.SITE_ROOT_URL + '/oauth';
  const scope = 'snsapi_userinfo';
  const {a,b} = ctx.query;
  const params = `${a}_${b}`;
  console.log(target);
  const  url = api.wechat.getAuthorizeURL(scope,target,params);
  console.log(url);
  ctx.redirect(url);

}

export async function oauth(ctx,next) {
  let url = ctx.query.url;
  url = decodeURIComponent(url);
  const urlObj = urlParse(url);
  const params = queryParse(urlObj.query);
  const code = params.code;
  const user = await api.wechat.getUserByCode(code);
  ctx.session.user = user;
  ctx.body = {
    success:true,
    data:user
  }

}
