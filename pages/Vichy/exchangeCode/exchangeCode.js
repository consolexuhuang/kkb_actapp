// pages/Vichy/exchangeCode/exchangeCode.js
const api = getApp().api;
const store = getApp().store;
var requestTask
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
      if (res.msg && res.msg.receive_flag === 1){
        // 已兑换
        wx.redirectTo({
          url: '/pages/Vichy/exchangeSuccess/exchangeSuccess',
        })
      } else {
        this.setData({
          isSureReceiveInfoComplate: true,
          giftReceiveInfo: res.msg
        })
        res.msg ? this.checkGiftStatus(res.msg.id) : ''
      }
    })
  },
  //长轮询
  checkGiftStatus(id){
    let data = {
      id: id
    }
    console.log('轮询中-------')
    requestTask = wx.request({
      url: `${getApp().globalData.API_URI}v2/gift/checkGiftStatus`,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        '_token': store.getItem('userData').token,
      },
      data: data,
      method: 'POST',
      success: res => {
        console.log('轮询结果', res)
        if (res.data.errcode === 1 && !res.data.errmsg) { //超时
          this.checkGiftStatus(id)
        } else if (res.data.errcode === 0 && res.data.errmsg == '发放成功') { //发放成功
          this.checkSubmit()
        } else {  //其他异常错误，暂不处理，会死循环
          // this.checkGiftStatus(id)
        }
      },
      fail: res => {
        console.log('requestTaskFail-abort',res)
      }
    })
    // const requestTask = api.post('v2/gift/checkGiftStatus', data).then(res => {
    //   console.log('轮询结果',res)
    //   if (res.errcode === 1 && !res.errmsg) { //超时
    //     this.checkGiftStatus(id)
    //   } else if (res.errcode === 0 && res.errmsg == '发放成功') { //发放成功
    //     this.checkSubmit()
    //   } else {  //其他异常错误
    //     this.checkGiftStatus(id)
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getApp().checkSessionFun().then(() => {
      if (getApp().passIsLogin()) {
        this.checkSubmit()
      }
    })
  },
  onHide(){
    console.log('onHide----')
    requestTask ? requestTask.abort() : ''
  },
  onUnload(){
    console.log('onUnload----')
    requestTask ? requestTask.abort() : ''
  },
  backHome(){
    wx.redirectTo({
      url: '/pages/Vichy/index/index',
    })
  },
  // onPullDownRefresh(){
  //   getApp().checkSessionFun().then(() => {
  //     if (getApp().passIsLogin()) {
  //       this.checkSubmit()
  //       wx.stopPullDownRefresh()
  //     }
  //   })
  // },
})