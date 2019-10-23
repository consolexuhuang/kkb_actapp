// pages/Vichy/exchangeCode/exchangeCode.js
const api = getApp().api;
const store = getApp().store;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftReceiveInfo: '',
    isSureReceiveInfoComplate: false,
  },
  // 校验提交记录
  checkSubmit() {
    wx.showLoading({ title: '加载中...',})
    api.post('v2/gift/getGiftReceiveInfo').then((res) => {
      wx.hideLoading()
      console.log('getGiftReceiveInfo', res)
      if (res.msg.receive_flag === 1){
        // 已兑换
        wx.redirectTo({
          url: '/pages/Vichy/exchangeSuccess/exchangeSuccess',
        })
      } else {
        this.setData({
          isSureReceiveInfoComplate: true,
          giftReceiveInfo: res.msg
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().checkSessionFun().then(() => {
      if (getApp().passIsLogin()){
        this.checkSubmit()
      }
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
  backHome(){
    wx.redirectTo({
      url: '/pages/Vichy/index/index',
    })
  },
})