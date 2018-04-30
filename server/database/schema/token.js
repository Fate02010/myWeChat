/**
 * Created by maijinchao on 2018/4/29.
 * 访问 accessToken 的表
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TokenSchema = new Schema({
  name:String,
  token:String,
  expires_in:Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

/**
 * 保存数据前操作,更新时间
 */
TokenSchema.pre('save',function (next) {
  if(this.isNew){
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  }else{
    this.meta.updatedAt = Date.now();
  }
  next();
})


TokenSchema.statics = {
  /**
   * 获取accessToken
   * @returns {Promise<*>}
   */
  async getAccessToken(){
    const token = await this.findOne({
      name: 'access_token'
    }).exec();
    if(token && token.token){
      token.access_token = token.token;
    }
    return token;
  },
  /**
   * 保存 accessToken
   * @param data
   * @returns {Promise<*>}
   */
  async saveAccessToken(data) {
    let token = await this.findOne({
      name: 'access_token'
    }).exec();

    if(token){
      token.token = data.access_token;
      token.expires_in = data.expires_in;
    }else{
      token = new Token({
        name: 'access_token',
        token: data.access_token,
        expires_in: data.expires_in
      })
    }
    await token.save()
    return data;
  }
}


const Token = mongoose.model('Token',TokenSchema)
