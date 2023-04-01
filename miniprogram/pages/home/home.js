// 这个页面时首页页面，显示所有已经登录的用户
const db=wx.cloud.database();
Page({
  data: {
    done:false, // 页面和数据库是否加载完成的bool
    dataobj:[], // 每个用户的数据大数组
    dataobjWithPartner:[], // 筛选出有舞伴的用户的数组
    dataobjWithoutPartner:[], // 筛选出没有舞伴的用户的数组
    tabs:[ // 4个栏目，判定选定的是哪个栏目
      {
        id:0,name:"  全部",isActive:true // 显示全部的用户，没有舞伴的排在前面，有舞伴的排在后面
      },
      {
        id:1,name:"  男生",isActive:false // 显示所有的男生 没有舞伴的排在前面，有舞伴的排在后面
      },
      {
        id:2,name:"  女生",isActive:false // 显示所有的女生 没有舞伴的排在前面，有舞伴的排在后面
      },
      {
        id:3,name:"  刷新",isActive:false // 刷新顺序 没有舞伴的排在前面，有舞伴的排在后面
      }
]
  },

  // 切换栏目
  handleItemChange(e)
  {
    console.log(e);
    let tabs2=this.data.tabs;
    let index=e.detail;
    let i=0;
    if(index!=3)
    {
    for(i=0;i<tabs2.length;i++)
      {
        if(i!=index)
        {tabs2[i].isActive=false;}
        else
        {tabs2[i].isActive=true;}
      }
    }
    else if(index==3)
    {
      var dataobj2=this.data.dataobj;
      var temp={};
      let i=0;let j=0;
      for(i=0;i<dataobj2.length;i++)
      {
        temp=dataobj2[i];
        j=Math.floor(Math.random()*dataobj2.length);
        dataobj2[i]=dataobj2[j];
        dataobj2[j]=temp;
      }
      this.setData({
        dataobj:dataobj2
      })
      this.classify(dataobj2)
    }
    this.setData({
    tabs:tabs2
  })
  }

  // 获得所有已登录用户的数据
  ,getData(){
    wx.cloud.callFunction({
      name: 'finddataActiveUser',
    })
    .then(res => {
      console.log(res.result);
      this.setData({
        dataobj:res.result.data,
        done:true
      });
      this.classify(res.result.data)
    })
    .catch(console.error)
  },

  // 筛选用户 是否已经有舞伴
  classify(dataobj){
    var dataobjWithPartner=[];
    var dataobjWithoutPartner=[];
    let i=0;
    for(i=0;i<dataobj.length;i++)
      {
        if (dataobj[i].hasPartner==true)
          {
            dataobjWithPartner.push(dataobj[i])
          }
        else
          {
            dataobjWithoutPartner.push(dataobj[i])
          }
      }
    this.setData({
      dataobjWithPartner:dataobjWithPartner,
      dataobjWithoutPartner:dataobjWithoutPartner
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {
    console.log("here")
    this.setData({
      done:false
    });
    this.getData();
  }
})