/**
 * Created by maijinchao on 2018/4/13.
 */

import Router from 'koa-router'
import config from '../config'
import sha1 from 'sha1'



export const router = app => {
  const router = new Router();

  router.get('/wechat-hear', (ctx, next) => {
    require('../wechat')
    console.log('OK');
    const token = config.wechat.token
    const {
      signature,
      nonce,
      timestamp,
      echostr
    } = ctx.query
    const str = [token, timestamp, nonce].sort().join('')
    const sha = sha1(str)
    if (sha === signature) {
      ctx.body = echostr
    } else {
      ctx.body = 'Fail'
    }
  })


  app.use(router.routes())
  app.use(router.allowedMethods())

}
