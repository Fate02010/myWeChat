import sha1 from "sha1";
import config from "../config";
import getRawBody from 'raw-body'
import * as util from './util'

/**
 * Created by maijinchao on 2018/5/13.
 */
export default function (opts, reply) {
  return async function wechatMiddle(ctx, next) {
    console.log('OK');
    const token = opts.token
    const {
      signature,
      nonce,
      timestamp,
      echostr
    } = ctx.query
    const str = [token, timestamp, nonce].sort().join('')
    const sha = sha1(str)

    if (ctx.message === 'GET') {
      if (sha === signature) {
        ctx.body = echostr
      } else {
        ctx.body = 'Failed'
      }
    } else if (ctx.method === 'POST') {
      if (sha !== signature) {
        ctx.body = 'Failed'
        return false;
      }
      const data = await  getRawBody(ctx.req, {
        length: ctx.length,
        limit: '1mb',
        encoding: ctx.charset
      })
      const content = await util.parseXML(data)
      const message = util.formatMessage(content.xml)
      console.log(content)
      //ctx.weixin = message
      ctx.weixin = message

      await reply.apply(ctx, [ctx, next])
      const replyBody = ctx.body
      const msg = ctx.weixin
      const xml = util.tpl(replyBody, msg)
      console.log(replyBody)
      console.log(content.xml.FromUserName[0])
      console.log(content.xml.ToUserName[0])

      //
      console.log(xml)
      ctx.status = 200
      ctx.type = 'application/xml'
      ctx.body = xml
    }
  }
}
