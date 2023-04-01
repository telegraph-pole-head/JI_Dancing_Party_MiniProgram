// 登陆页面
const db=wx.cloud.database();
const _=db.command;
const defaultAvatarUrl = 'https://i.postimg.cc/pdbCXg0d/20230219181927.jpg'
Page({
  data: {
    authority:false, // 用户是否微信授权头像和昵称，不授权不能来玩！
    // 海报的图片
    poster:"https://626c-blossom-4gzwd51i82e0ac00-1309004817.tcb.qcloud.la/poster.jpg?sign=24aacd6bb37f61e56788aa3b32649825&t=1678594615",
    imageUrl:"https://i.postimg.cc/pdbCXg0d/20230219181927.jpg",
    userInfo:{}, // 用户填写的信息
    name:"", // 用户填入的姓名
    openid:'', // 用户的openid
    haslog:false, // 用户是否已经登陆过了
    done:false, // 页面和数据库是否加载完毕,
    submit_status:false,
    avatarUrl: defaultAvatarUrl,
    theme: wx.getSystemInfoSync().theme,
    user_avatar:"",
    avatar_submit:false,
    debug:"initial state",
    count:0,
    onstack:false
  },
btnSub(e){
  if(this.data.count!=0)
  {
    return;
  }
  if(this.data.onstack==true)
  {
    return;
  }
  else 
  {
    this.setData({
      onstack:true
    })
  }
  if(this.data.avatar_submit==false)
  {
    wx.showToast({
    title:"头像捏",
    icon:'error',
    mask:true
    })
    this.setData({
      onstack:false
    })
    return;
  }
  var nickname=e.detail.value.nickname;
  if(nickname=="")
  {
    wx.showToast({
      title:"昵称捏",
      icon:'error',
      mask:true
      })
      this.setData({
        onstack:false
      })
    return;
  }
  //第一次登陆时，将用户填写的信息和User数据库比对，判断是否能登陆\
  var password=e.detail.value.password;
  var userid=e.detail.value.userid;
  console.log(userid);
  console.log(password);
 
  db.collection("User") .where({
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
    wx.cloud.uploadFile({
      cloudPath:this.data.openid+".jpg",
      filePath: this.data.avatarUrl, // 文件路径
      success: res => {
        this.setData({
          user_avatar:res.fileID,
          avatarUrl:res.fileID,
          count:1
        })

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
          nickname:nickname,
          image: this.data.user_avatar,
        },
        success:ress2=>{
          console.log(1);
          wx.showToast({
            title:"登录成功",
            icon:'success',
            mask:true
          })
          this.setData({
            onstack:false
          })
          wx.switchTab({
        url: '../home/home',
        })}
        }
      )
      },
     
      fail: err => {
        // handle error
      }
    })
     
  }
    else{
      wx.showToast({
        title:"账户已注册过",
        icon:'error',
        mask:true
      })
      this.setData({
        onstack:false
      })
    }
  }})}
  else{
    wx.showToast({
      title:"登陆失败",
      icon:'error',
      mask:true
    })
    this.setData({
      onstack:false
    })
  }

}})
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
onChooseAvatar(e) {
  const { avatarUrl } = e.detail 
    this.setData({
      avatar_submit:true,
      user_avatar:avatarUrl,
      avatarUrl:avatarUrl
    })
},

  /**
   * 生命周期函数--监听页面加载
   */ 
onLoad() {
    wx.onThemeChange((result) => {
      this.setData({
        theme: result.theme
      })
    })
    this.getOpenid();
  },
})