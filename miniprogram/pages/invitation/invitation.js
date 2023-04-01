// 邀请函的页面
Page({
  data: {
    name:'',
    gender:'',
    order:'',
    imageUrl:"https://i.postimg.cc/28NcRRhW/invitation.jpg"
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