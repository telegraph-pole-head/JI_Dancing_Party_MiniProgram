// edit页面时点入个人界面后点击编辑个人信息跳出的页面
const db=wx.cloud.database(); // 获得数据库
Page({
  data: {
    openid: '', // 用户的openid
    dataobj:{}, // 用户自己的数据 record
    done:false, // 页面 数据库 是否加载完成的bool
    messagelove:'', // 用户填写的 “我喜欢的” 的字符串
    lovelength:0, // messagelove的字数，用于设置字数限制
    messagelength:0, // 用户填写的 “个性名片” 的字数限制
    messagemsg:'' // 用户填写的 “个性名片” 的字符串
  },

  // 输入框触发的函数 用于储存用户输入内容的函数
  inputlove(e){
    var msg=e.detail.value;
    this.setData({
      lovelength:msg.length
    });
    if(msg.length<=30)
    {
      this.setData({
      messagelove:msg,
    });
    }
  },
  textcheck(e){
   var msg=e.detail.value;
    this.setData({
      messagelength:msg.length
    });
    if(msg.length<=400)
    {
      this.setData({
      messagemsg:msg
      })
    }
  },
  
  // 提交按钮，确认编辑的内容
  btnSub(e){
    console.log(e);
    var newgrade=e.detail.value.editgrade;
    var newlove=this.data.messagelove;
    var newmessage=this.data.messagemsg;
    console.log(newmessage);
    db.collection('ActiveUser').where({_openid:this.data.openid}).update({
      data: {
        grade:newgrade,
        love:newlove,
        message:newmessage,
      },
      success: function(res) {
        console.log(res.data)
      }
    })
    wx.switchTab({
      url: '../mine/mine',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  // 获得用户的openid
  getOpenid() {  let that = this;
    wx.cloud.callFunction({   name: 'getOpenid',   complete: res => {    console.log("云函数获得的openid：",res.result.openId); var openid=res.result.openId;
    that.setData({
      openid:openid,
      done:false
    });
    // 从数据库中找到用户的信息
    db.collection("ActiveUser").where({_openid:this.data.openid}).get({
      success:res=>{
        this.setData({
          dataobj:res.data[0],
          done:true,
          lovelength:res.data[0].love.length,
          messagelove:res.data[0].love,
          messagemsg:res.data[0].message
        })
      }
    });
     }
    })
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenid();
   },
  })