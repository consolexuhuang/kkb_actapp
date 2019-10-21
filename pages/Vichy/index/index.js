// pages/Vichy/index/index.js
const api = getApp().api;
const store = getApp().store;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex:0,
    index_banner_X:[
      'https://img.cdn.powerpower.net/5da13fcae4b0697c15ae69ab.jpg',
      'https://img.cdn.powerpower.net/5da13fc5e4b0697c15ae69aa.jpg',
      'https://img.cdn.powerpower.net/5da13fb5e4b0697c15ae69a9.jpg',

    ],
    index_banner: [
      'https://img.cdn.powerpower.net/5da172a1e4b0697c15ae69b5.png',
      'https://img.cdn.powerpower.net/5da17298e4b0697c15ae69b4.png',
      'https://img.cdn.powerpower.net/5da1728ce4b0697c15ae69b3.png'
    ],
    isXModel: getApp().globalData.isIpX, //是否是X系列机型
  },
  // 校验提交记录
  checkSubmit(){
    api.post('v2/gift/getGiftReceiveInfo').then((res) => {
      console.log('getGiftReceiveInfo',res)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().checkSessionFun().then(() => {
      this.checkSubmit()
    })
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
  // 下一张
  nextBanner(e){
    this.setData({
      currentIndex: e.currentTarget.dataset.index+1
    })
    // console.log(e.currentTarget.dataset.index, this.data.currentIndex)
  },
  // 免费领取
  jumpToFreeReceive(){
     wx.navigateTo({
       url: '/pages/Vichy/informationWord/informationWord',
     })
  }
})