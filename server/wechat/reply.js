/**
 * Created by maijinchao on 2018/5/13.
 */

const tip = 'fate ,来到fate代码世界\n' + '点击<a href="www.baidu.com"></a>'

export default async (ctx, next) => {
  const message = ctx.weixin
  console.log(message)
  ctx.body = tip
}
