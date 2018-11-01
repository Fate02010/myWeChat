/**
 * Created by 麦锦超 on 2018/10/14.
 */

import api from '../api'


/**
 * 签名
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
export async function signature(ctx,next) {
  const url = ctx.query.url;
  if(!url) ctx.throw(404);
  const params = await api.wechat.getSignatureAsync(url);
  console.log(params);
  ctx.body = {
    success: true,
    params: params
  }
}
