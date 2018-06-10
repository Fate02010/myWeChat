/**
 * Created by maijinchao on 2018/5/13.
 */
import  xml2js from 'xml2js'
import template from './tpl'

function parseXML(xml) {

  return new Promise((resolve,reject) => {
    xml2js.parseString(xml,{trim:true},(err,content) => {
      if(err){
        console.log('发生错误')
        reject(err)
      }
      else resolve(content)
    })
  })
}

/**
 * 对消息进行格式化
 * @param result
 */
function  formatMessage(result) {
  let message = {};

  if(typeof result === 'object') {
    const keys = Object.keys(result);
    //遍历 result 中所有元素
    for(let i = 0; i < keys.length; i++){
      let item = result[keys[i]];
      let key = keys[i];

      if(!(item instanceof Array) || item.length === 0) {
        continue;
      }

      if(item.length === 1) {
        let val = item[0]

        if(typeof  val === 'object') {
          message[key] = formatMessage(value);
        }else{
          message[key] = (val || '').trim();
        }
      }else {
        message[key] = [];
        for(let j = 0; j < item.length; j++) {
          message[key].push(formatMessage(item[j]));
        }
      }
    }
  }

  return message;
}

function tpl(content,message) {
  let type = 'text';

  if(Array.isArray(content)) {
    type = 'new'
  }

  if(!content) {
    content = 'Empty News';
  }

  if(content && content.type) {
    type = content.type;
  }

  let info = Object.assign({},{
    content: content,
    createTime: new Date().getTime(),
    msgType: type,
    toUserName: message.FromUserName,
    fromUserName: message.ToUserName
  });

  return template(info);
}

export {
  parseXML,
  formatMessage,
  tpl
}
