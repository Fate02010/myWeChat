/**
 * Created by 麦锦超 on 2018/10/14.
 */

import { getWechat} from "../wechat"


const client = getWechat();

/**
 * 获取签名
 * @param url
 * @returns {Promise<*>}
 */
export async function getSignatureAsync(url) {
  const data = await client.fetchAccessToken();
  const token = data.access_token;
  const ticketData = await client.fetchTicket(token);
  const ticket = ticketData.ticket;
  console.log('签名');
  let params = client.sign(ticket,url);
  params.appId = client.appID;
  return params;
}
