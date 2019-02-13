/**
 * Created by maijinchao on 2018/4/13.
 */

import Router from 'koa-router'
import config from '../config'
import sha1 from 'sha1'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'
import { signature,redirect,oauth } from "../controllers/wechat";


export const router = app => {
  const router = new Router();
  // 配置接口信息代码
  // router.get('/wechat-hear', (ctx, next) => {
  //   require('../wechat')
  //   console.log('OK');
  //   const token = config.wechat.token
  //   const {
  //     signature,
  //     nonce,
  //     timestamp,
  //     echostr
  //   } = ctx.query
  //   const str = [token, timestamp, nonce].sort().join('')
  //   const sha = sha1(str)
  //   if (sha === signature) {
  //     ctx.body = echostr
  //   } else {
  //     ctx.body = 'Fail'
  //   }
  // })

  router.all('/wechat-hear',wechatMiddle(config.wechat,reply));
  router.get('/wechat-signature',signature);
  router.get('/wechat-redirect',redirect);
  router.get('/wechat-oauth',oauth);
  app
    .use(router.routes())
    .use(router.allowedMethods())
}
