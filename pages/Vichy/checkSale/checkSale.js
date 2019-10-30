// pages/Vichy/checkSale/checkSale.js
const api = getApp().api;
const store = getApp().store;
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    currentGiftReceiveInfo:'',
  },
  checkGiftReceive(codeResult){
    let data = {
      code: codeResult
    }
    wx.showLoading({ title: '识别中...', })
    api.post('worker/checkGiftReceive', data).then(res => {
      console.log('checkGiftReceive',res)
      wx.hideLoading()
      wx.vibrateShort({})
      if(res.code === 1){
        wx.showToast({
          title: res.msg || '扫码失败',
          icon:'none'
        })
      } else {
        this.setData({
          currentGiftReceiveInfo: res.msg
        })
      }
    })
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
  showScanCode(){
    let that = this
    getApp().checkSessionFun().then(() => {
      // 允许从相机和相册扫码
      wx.scanCode({
        success(res) {
          console.log('scanCode',res)
          if (res.result){
            that.checkGiftReceive(res.result)
          }
        }
      })
    })
  },
  //工作人员确认兑换
  sureExchange(){
    let data = {
      id: this.data.currentGiftReceiveInfo.id
    }
    wx.showLoading({title: '兑换中...',})
    api.post('worker/confirmGiftReceive', data).then((res) => {
      wx.hideLoading()
      console.log('confirmGiftReceive',res)
      if(res.code === 0 && res.msg){
        this.setData({ currentGiftReceiveInfo: res.msg})
        if (res.msg.receive_flag === 1){
          wx.showToast({
            title: '兑换成功！',
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: res.msg || '兑换失败！',
          icon: 'none'
        })
      }
    })
  },
})