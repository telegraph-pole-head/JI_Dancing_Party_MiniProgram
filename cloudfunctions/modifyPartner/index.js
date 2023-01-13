// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log("hello")
    db.collection("ActiveUser").where({_openid:event.dataobj._openid}).update({
      // data 传入需要局部更新的数据
      data: {
        hasPartner:true,
        partner:event.user.name,
        mypartner:event.user.name
          }
    }),
    db.collection("ActiveUser").where({_openid:event.user._openid}).update({
      // data 传入需要局部更新的数据
      data: {
        hasPartner:true,
        partner:event.dataobj.name,
        mypartner:event.dataobj.name
      }
    })
  } catch (e) {
    console.error(e)
  }
  return{
    new:"kulu"
    ,name:event.name
    ,senderid:event.senderid
  }
}