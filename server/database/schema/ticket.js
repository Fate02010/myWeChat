/**
 * Created by 麦锦超 on 2018/10/13.
 * 对ticket进行增删查改
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TicketSchema = new Schema({
  name:String,
  ticket:String,
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
TicketSchema.pre('save',function (next) {
  if(this.isNew){
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  }else{
    this.meta.updatedAt = Date.now();
  }
  next();
})


TicketSchema.statics = {
  /**
   * 获取accessticket
   * @returns {Promise<*>}
   */
  async getTicket(){
    const ticket = await this.findOne({
      name: 'ticket'
    }).exec();
    if(ticket && ticket.ticket){
      ticket.ticket = ticket.ticket;
    }
    return ticket;
  },
  /**
   * 保存 accessticket
   * @param data
   * @returns {Promise<*>}
   */
  async saveTicket(data) {
    let ticket = await this.findOne({
      name: 'ticket'
    }).exec();

    if(ticket){
      ticket.ticket = data.ticket;
      ticket.expires_in = data.expires_in;
    }else{
      ticket = new Ticket({
        name: 'ticket',
        ticket: data.ticket,
        expires_in: data.expires_in
      })
    }
    await ticket.save()
    return data;
  }
}


const Ticket = mongoose.model('Ticket',TicketSchema)
