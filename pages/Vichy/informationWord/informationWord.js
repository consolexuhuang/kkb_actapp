// pages/informationWord/informationWord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeLoaction:['上海市','北京市'],
    storeLoaction: ['中信泰富旗舰店','J&J X 锐樊健身授课中信泰富旗舰店馆（大宁国际店）','南京西路'],
    date: '2019-10-01',
    place_index:0,
    store_index: 0,
    height:'',
    allowMessgState: false
  },
  // 动话函数
  util: function () {
    var animation = wx.createAnimation({
      duration: 1000,  //动画时长
      timingFunction: "ease-out", //线性
      delay: 1000  //0则不延迟
    });
    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;
    animation.height().step();
    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })
    // // 第5步：设置定时器到指定时候后，执行第二组动画
    // setTimeout(function () {
    //   // 执行第二组动画：Y轴不偏移，停
    //   animation.translateY(0).step()
    //   // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
    //   this.setData({
    //     animationData: animation
    //   })

    // }.bind(this), 2000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //获取电话
  getPhoneNumber(e){
   console.log('授权电话',e)
  },
  // 区域
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      place_index: e.detail.value
    })
  },
  // 地点
  bindPickerChange_store(e){
    this.setData({
      store_index: e.detail.value
    })
    this.util()
  },
  //时间
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  // 允许发送短信
  allowMessg(){
    this.setData({
      allowMessgState: !this.data.allowMessgState
    })
  },
})