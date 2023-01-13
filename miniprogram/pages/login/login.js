// 登陆页面
const db=wx.cloud.database();
const _=db.command;
Page({
  data: {
    authority:false, // 用户是否微信授权头像和昵称，不授权不能来玩！
    // 海报的图片
    imageUrl:"https://6b75-kulu-9g08tpms523e5824-1309004817.tcb.qcloud.la/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220506232013.jpg?sign=68c495095c73db53549ac4763d561092&t=1651850428",
    userInfo:{}, // 用户填写的信息
    name:"", // 用户填入的姓名
    openid:'', // 用户的openid
    canIUseGetUserProfile: false, // 用户是否授权头像
    hasUserInfo: false, // 用户授权信息
    haslog:false, // 用户是否已经登陆过了
    done:false, // 页面和数据库是否加载完毕
  },
btnSub(e){
  //第一次登陆时，将用户填写的信息和User数据库比对，判断是否能登陆
  var authority=this.data.authority;
  console.log(authority);
  if(authority==true){
  var userinfo=this.data.userInfo;
  var password=e.detail.value.password;
  var userid=e.detail.value.userid;
  console.log(userid);
  console.log(password);
  
  db.collection("User").where({
    name:userid
    ,phone:password
  }).get({
    success:ress=>{
      console.log(ress.data.length);
      if(ress.data.length!=0)
      { var person=ress.data[0];
        console.log(person);
        db.collection("ActiveUser").where({
        name:userid,phone:password
      }).get({
    success:res=>{
      console.log(res);
    if(res.data.length==0)
    {
      console.log(person);
      // 用户第一次登陆，在ActiveUser数据库中添加个人的数据
      db.collection('ActiveUser').add({
        data: {
          gender:person.gender,
          name:person.name,
          phone:person.phone,
          school:person.school,
          order:person.order,
          free:person.free,
          receive:{},
          send:{},
          grade:'',
          canedit:true,
          hasPartner:false,
          love:'',
          message:'',
          partner:"Ta还没有呢",
          mypartner:'我还没有呢',
          nickname:userinfo.nickName,
          image:userinfo.avatarUrl
        },
        success:ress2=>{
          console.log(1);
          if(authority==true)
          {
          wx.showToast({
            title:"登录成功",
            icon:'success',
            mask:true
          })
          wx.switchTab({
        url: '../home/home',
        })}
        }
      })
  }
    else{
      wx.showToast({
        title:"账户已注册过",
        icon:'error',
        mask:true
      })
    }
  }})}
  else{
    wx.showToast({
      title:"登陆失败",
      icon:'error',
      mask:true
    })
  }
}})
}
    else{
      wx.showToast({
        title:"请先授权",
        icon:'error',
        mask:true
    })
    }
  }
,
getOpenid() {  let that = this;
  //获得用户的openid
  wx.cloud.callFunction({   name: 'getOpenid',   complete: res => {    console.log("云函数获得的openid：",res.result.openId); var openid=res.result.openId;
  that.setData({
    openid:openid,
    done:false,
    invitedone:false,
    acceptdone:false
  });
  //如果ActiveUser有该用户，直接跳转
  db.collection("ActiveUser").where({_openid:this.data.openid}).get({
    success:res=>{
    if(res.data.length!=0)
    {
      // 跳转到首页页面
      wx.switchTab({
        url: '../home/home',
      })
    }
 }})
   }
  });
  }
,

getUserProfile(e) {
  wx.getUserProfile({
    desc: '用于完善会员资料', 
    success: (res) => {
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo:true,
        authority:true,
      })
    }
  })
},
getUserInfo(e) {
  this.setData({
    userInfo: e.detail.userInfo,
    hasUserInfo: true,
    authority:true,
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    this.getOpenid();
  },
})