/**
 * Created by maijinchao on 2018/4/29.
 */
import mongoose from 'mongoose'
import  config from '../config'
import { resolve } from 'path'
import fs from 'fs'

const models = resolve(__dirname,'../database/schema');

//读取 schema 文件夹下所有model
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*js$/))
  .forEach(file => require(resolve(models,file)))


export  const database = app => {
  //设置为debug 模式打印出链接信息
  mongoose.set('debug',true);

  mongoose.connect(config.db);

  mongoose.connection.on('disconnected',() => {
    mongoose.connect(config.db);
  });

  mongoose.connection.on('error', err => {
    console.error(err);
  });

  mongoose.connection.on('open',async => {
    console.log('Connected to MongoDB',config.db);
  })
}
