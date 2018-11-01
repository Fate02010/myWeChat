/**
 * Created by maijinchao on 2018/5/13.
 */
import  xml2js from 'xml2js'
import template from './tpl'
import sha1 from 'sha1'

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
  console.log('tpl:  ' + content)

  if(Array.isArray(content)) {
    type = 'news'
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

/**
 * 生成14位随机字符
 * @returns {string}
 */
function createNonce() {
  return Math.random().toString(36).substr(2,15);
}

/**
 * 创建时间戳
 * @returns {string}
 */
function createTimestamp() {
  return parseInt(new Date().getTime()/1000,0) + '';
}

/**
 * 对签名参数进行排序(具体规则请查看微信api文档 jsapi_ticket)
 * @param args
 * @returns {string}
 */
function raw(args) {
  let keys= Object.keys(args);
  let newArgs = {};
  let str = '';
  keys = keys.sort();
  keys.forEach((key) => {
    newArgs[key.toLowerCase()] = args[key];
  });
  for(let k in newArgs) {
    str += '&' + k + '=' + newArgs[k];
  }
  // 从1开始,主要去掉第一个空字符
  return str.substr(1);
}

/**
 * 对参数进行签名
 * @param nonce
 * @param ticket
 * @param timestamp
 * @param url
 * @returns {*}
 */
function signIt(nonce,ticket,timestamp,url) {
  const  ret = {
    jsapi_ticket: ticket,
    nonceStr: nonce,
    timestamp: timestamp,
    url: url
  };
  console.log('字符串处理');
  const string = raw(ret);
  console.log('sha加密-----');
  const  sha = sha1(string);
  return sha;


}

function sign(ticket,url) {
  const nonce = createNonce();
  const timesTamp = createTimestamp();
  console.log(nonce + timesTamp + '签名字符串' + url);
  const signature = signIt(nonce,ticket,timesTamp,url);
  return {
    noncestr: nonce,
    timestamp: timesTamp,
    signature: signature
  }
}

export {
  parseXML,
  formatMessage,
  tpl,
  sign
}
