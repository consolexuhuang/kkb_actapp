// pages/informationWord/informationWord.js
const api = getApp().api;
const store = getApp().store;
var QQMapWX = require('../../../libs/qqmap-wx-jssdk.js');   // 引入腾讯地图SDK核心类

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeData:'',
    locationData:'',
    placeLoaction:[],
    storeLoaction: [],
    storeNameList:[],

    place_index:0,
    store_index: 0,
    data_index:0,

    allowMessgState: false,
    code:'',//授权电话所需code
  },
  // 获取福利信息（带经纬度）
  getActiveData() {
    let data = {
      latitude: getApp().globalData.location.latitude || '',
      longitude: getApp().globalData.location.longitude || '',
    }
    api.post('v2/gift/getGiftReceiveConfig', data).then(res => {
      console.log('福利信息内容', res)
      let data_list = []
      for (let i = 0; i < res.msg.data_list.length; i++) {
        data_list.push(`${res.msg.data_list[i].date} 周${res.msg.data_list[i].day}`)
      }
      this.setData({
        activeData: res.msg,
        locationData: res.msg.city_store_map,
        placeLoaction: Object.keys(res.msg.city_store_map),
        storeLoaction: Object.values(res.msg.city_store_map)[0],
        dataList: data_list
      })
    })
  },
  // 授权电话
  getPhoneNumber(e){
    let ency = e.detail.encryptedData;
    let iv = e.detail.iv;
    let errMsg = e.detail.errMsg
    if (iv == null || ency == null) {
      wx.showToast({
        title: "授权失败,请重新授权！",
        icon: 'none',
      })
      return false
    } else {
      let data = {
        code: this.data.code,
        encryptedData: ency,
        iv: iv,
        liteType: 'gift'
      }
      api.post('v2/member/liteMobile', data).then(res => {
        console.log('后台电话解密授权', res)
        this.getActiveData()
      })
    }

  },
  //地址逆解析
  locationInverse(){
    if (!store.getItem('address')) {
      // 本地无地址 腾讯解析
      var that = this
      let qqmapsdk = new QQMapWX({
        key: 'UMNBZ-AMQK6-22HS4-EJUVQ-D24LE-BBBK3'
      });
      //根据经纬度获取所在城市
      qqmapsdk.reverseGeocoder({
        location: { 
          latitude: getApp().globalData.location.latitude, 
          longitude: getApp().globalData.location.longitude 
        },
        success: function (res) {
          //address 城市
          that.setData({ address: res.result.address_component.city })
          store.setItem('address', res.result.address_component.city)
          if (res.result.address_component.city !== '上海市') {
            wx.showModal({
              showCancel: false,
              title: '提示',
              content: '该活动仅限上海区域',
            })
          }
        }
      })
    } else {
      console.log('无需再次逆解析')
    }
  },
  // 再次授权地理位置
  again_getLocation() {
    let that = this;
    // 获取位置信息
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
            success: function (res) {
              console.log(res)
              if (res.cancel) {
                that.setData({
                  isshowCIty: false
                })
                wx.showToast({
                  title: '授权失败',
                  icon: 'none',
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    console.log(dataAu)
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'none',
                      })
                      //再次授权，调用getLocationt的API
                      getApp().getLocation().then(() => {
                        console.log('地理位置', getApp().globalData.location)
                        that.locationInverse()
                      }, () => {})
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {//初始化进入
          getApp().getLocation().then(() => {
            console.log('地理位置', getApp().globalData.location)
            that.locationInverse()
          }, () => {})
        }
        else { //授权后默认加载
          getApp().getLocation().then(() => {
            console.log('地理位置', getApp().globalData.location)
            that.locationInverse()
          }, () => {})
        }
      }
    })
  },
  //领取
  getReserveGiftReceive(){
    wx.showLoading({title: '提交中...' })
    return new Promise((resolve) => {
      let data = {
        latitude: getApp().globalData.location.latitude || '',
        longitude: getApp().globalData.location.longitude || '',
        storeId: this.data.storeLoaction[this.data.store_index].id || '',
        reserveDate: this.data.activeData.data_list[this.data.data_index].date || '',
        shareMemberId: store.getItem('shareMemberId') || '',
      }
      api.post('v2/gift/reserveGiftReceive',data).then(res => {
        wx.hideLoading()
        resolve(res)
      })
    })
  },
  onLoad: function (options) {
    wx.login({
      success: res_code => {
        this.setData({ code: res_code.code })
      }
    })
    if (!getApp().globalData.location){
      getApp().getLocation().then(() => {
        console.log('地理位置', getApp().globalData.location)
        this.locationInverse()
        this.getActiveData()
      },()=>{
        this.getActiveData()
      })
    } else {
      this.getActiveData()
    }
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
  // 区域
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value,)
    this.setData({
      place_index: e.detail.value,
      storeLoaction: this.data.locationData[this.data.placeLoaction[e.detail.value]],
    })
    console.log('地区-', this.data.placeLoaction[e.detail.value])
  },
  // 地点
  bindPickerChange_store(e){
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      store_index: e.detail.value,
    })
    console.log('地点-', this.data.storeLoaction[e.detail.value].name)
  },
  //时间
  bindDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      data_index: e.detail.value
    })
    console.log('时间-', this.data.dataList[e.detail.value])
  },
  // 允许发送短信
  allowMessg(){
    this.setData({
      allowMessgState: !this.data.allowMessgState
    })
  },
  // 活动规则
  jumpToRuleDetail(){
    wx.navigateTo({
      url: '/pages/Vichy/ruleDetail/ruleDetail',
    })
  },
  submit(){
    if (!getApp().globalData.location){
      this.again_getLocation()
    } else if (store.getItem('address') !== '上海市') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '该活动仅限上海区域',
      })
    } else if (!this.data.activeData.cell_phone){
      wx.showToast({
        title: '您还未授权电话',
        icon:'none'
      })
    } else {
      this.getReserveGiftReceive().then(res_sub => {
        console.log('reserveGiftReceive提交', res_sub)
        if (res_sub.msg && res_sub.code === 0){
          wx.redirectTo({
            url: '/pages/Vichy/newExchange/newExchange',
          })
        } else {
          wx.showToast({
            title: res_sub.msg || '提交失败',
            icon: 'none'
          })
        }
      })
      
    }
  }
})