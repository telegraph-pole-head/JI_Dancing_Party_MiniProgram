// 邀请函的页面
Page({
  data: {
    name:'',
    gender:'',
    order:'',
    imageUrl:"https://636c-cloud1-7g4co5hf9c3c5ba7-1309004817.tcb.qcloud.la/invitation.png?sign=a48fb6913d662d014b9ec08444e23699&t=1640690174"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户的性别和名字
    this.setData({
      name:options.name,
      order:options.order
    });
    if(options.gender=="男")
    {
      this.setData({
        gender:"先生"
      })
    }
    else
    {
      this.setData({
        gender:"女士"
      })
    }
  },

})