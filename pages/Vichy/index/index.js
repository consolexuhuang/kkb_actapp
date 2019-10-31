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
    isApplyBl: false, //是否申请
    isShowApplyBtn: false, //是否开出领取嗯妞
    jurisdictionSmallState: false,
    userInfoState: false,
  },
  // 校验提交记录
  checkSubmit(){
    return new Promise(resolve => {
      wx.showLoading({ title: '加载中...',})
      api.post('v2/gift/getGiftReceiveInfo').then((res) => {
        console.log('getGiftReceiveInfo',res)
        wx.hideLoading()
        resolve(res)
      })
    })
  },
  //用户信息状态
  userActiveState(){
    if (getApp().passIsLogin()) {
      this.checkSubmit().then((check_res) => {
        if (check_res.msg) {
          store.setItem('giftReceive', check_res.msg)
          wx.navigateTo({
            url: '/pages/Vichy/newExchange/newExchange',
          })
        } else {
          wx.navigateTo({
            url: '/pages/Vichy/informationWord/informationWord',
          })
        }
      })
    } else {
      this.setData({
        jurisdictionSmallState: true,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options----index', options)
    if (options.scene) {
      //小程序码参数
      console.log('scene-index', options.scene)
      store.setItem('shareMemberId', options.scene)
    } else if (options.shareMemberId) {
       //分享链接参数
      console.log('shareMemberId-index', options.shareMemberId)
      store.setItem('shareMemberId', options.shareMemberId)
    }
    getApp().checkSessionFun().then(() => {
      if (store.getItem('userData') && store.getItem('userData').head_img && store.getItem('userData').nick_name){
        this.setData({ userInfoState: true})
      }
      this.setData({ isShowApplyBtn: true})
      // this.userAuthState().then(() => {
      // })
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
  // 点击授权
  bindgetuserinfo() {
    getApp().wx_AuthUserLogin().then(() => {
      this.setData({
        jurisdictionSmallState: false,
      })
    })
  },
  // 下一张
  nextBanner(e){
    this.setData({
      currentIndex: this.data.currentIndex+1
    })
    // console.log(e.currentTarget.dataset.index, this.data.currentIndex)
  },
  swiperbindchange(e){
    // console.log(e.detail.current)
    this.setData({
      currentIndex: e.detail.current
    })
  },
  updateUserReceive(){
    wx.getUserInfo({
      lang: 'zh_CN',
      success: res => {
        console.log('用户授权信息', res.userInfo)
        if ((res.userInfo.nickName != store.getItem('userData').nick_name || res.userInfo.avatarUrl != store.getItem('userData').head_img) && store.getItem('userData')){
          store.setItem('wx_userInfo', res.userInfo)
          getApp().wx_modifyUserInfo().then(() => {
            this.userActiveState()
          }); //后台更新头像
        } else {
            this.userActiveState()
        }
      },
      fail: () => {
        console.log('拒绝')
        // this.userActiveState()
      }
    })
  },
  // 免费领取
  jumpToFreeReceive(){
    this.userActiveState()
  }
})