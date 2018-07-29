/**
 * Created by maijinchao on 2018/5/13.
 */

const tip = 'fate ,来到fate代码世界\n' + '点击<a href="www.baidu.com"></a>'

export default async (ctx, next) => {
  const message = ctx.weixin
  console.log(message);

  // 事件 取消关注与关注
  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      ctx.body = tip
    }else if(message.Event === 'unsubscribe') {
      console.log('取关');
    }else if (message.Event === 'LOCATION') {
      ctx.body = message.latitude + ' : ' + message.Longitude
    }

  } else if (message.MsgType === 'text') {
    ctx.body = message.Content;
  } else if (message.MsgType === 'image') {
    console.log('图片')
    ctx.body = {
      type: 'image',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'voice') {
    ctx.body = {
      type: 'voice',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'video') {
    ctx.body = {
      title: message.ThumbMediaId,
      type: 'video',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'location') {
    ctx.body = message.Location_X + message.Location_Y + ': ' + message.Label;
  } else if (message.MsgType === 'link') {
    ctx.body = [{
      title: message.Title,
      description: message.Description,
      picUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/4yVYesUr75xfxctHUo8GTibV1jo5q3gMCAdOv7IusZiceQ8rgUluk72BbWsBibUk1bm1icBTPgDCUEVwJUW3CVePZQ/0',
      // url:
    }]
  }
  // console.log(message)
  // ctx.body = tip
}
